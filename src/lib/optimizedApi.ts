// src/lib/optimizedApi.ts
import { supabase } from './supabase';
import { dataCache, deduplicateRequest, CACHE_KEYS } from './dataCache';
import {
  MemberProfile,
  LodgeDocument,
  MeetingMinutes,
  CMSEvent,
  CMSBlogPost,
  CMSOfficer,
  CMSTestimonial,
  CMSFAQItem,
  CMSSiteSetting,
  CMSPageContent,
} from '../types';
import type {
  PostgrestSingleResponse,
  PostgrestMaybeSingleResponse,
} from '@supabase/supabase-js';

// -------------------------------
// Helper: typed timeout wrapper
// -------------------------------
const withTimeout = async <T>(
  operation: () => Promise<PostgrestSingleResponse<T> | PostgrestMaybeSingleResponse<T>>,
  timeoutMs: number = 15000
): Promise<PostgrestSingleResponse<T> | PostgrestMaybeSingleResponse<T>> => {
  return Promise.race([
    operation(),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Request timeout after ${timeoutMs}ms`)), timeoutMs)
    ),
  ]);
};

// -------------------------------
// Circuit breaker
// -------------------------------
class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private readonly threshold = 3;
  private readonly timeout = 30000; // 30s

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.isOpen()) throw new Error('Circuit breaker is open - too many recent failures');
    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private isOpen(): boolean {
    return this.failures >= this.threshold && Date.now() - this.lastFailureTime < this.timeout;
  }
  private onSuccess(): void {
    this.failures = 0;
  }
  private onFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();
  }
}

const circuitBreaker = new CircuitBreaker();

// -------------------------------
// Optimized API
// -------------------------------
export const optimizedApi = {
  // MEMBER PROFILES
  getMemberProfile: async (userId: string): Promise<MemberProfile | null> => {
    const cacheKey = `member_profile:${userId}`;

    return dataCache.get(cacheKey, async () =>
      circuitBreaker.execute(async () => {
        const { data, error } = await withTimeout(() =>
          supabase
            .from('member_profiles')
            .select('*')
            .eq('user_id', userId)
            .limit(1)
            .then(r => r)
        );

        if (error) throw new Error(`Failed to fetch profile: ${error.message}`);
        if (!data || data.length === 0) return null;

        return {
          ...data[0],
          status: data[0].status ?? undefined,
        } as MemberProfile;
      })
    );
  },

  getAllMembers: async (): Promise<MemberProfile[]> => {
    return deduplicateRequest(CACHE_KEYS.MEMBERS, () =>
      dataCache.get(CACHE_KEYS.MEMBERS, async () => {
        const { data, error } = await withTimeout(() =>
          supabase
            .from('member_profiles')
            .select('*')
            .order('full_name', { ascending: true })
            .then(r => r)
        );
        if (error) throw new Error(`Failed to fetch members: ${error.message}`);

        return (data || []).map(row => ({
          ...row,
          status: row.status ?? undefined,
        })) as MemberProfile[];
      })
    );
  },

  // DOCUMENTS
  getLodgeDocuments: async (category?: string): Promise<LodgeDocument[]> => {
    const cacheKey = category ? CACHE_KEYS.DOCUMENTS_BY_CATEGORY(category) : CACHE_KEYS.DOCUMENTS;

    return deduplicateRequest(cacheKey, () =>
      dataCache.get(cacheKey, async () => {
        let query = supabase.from('lodge_documents').select('*').order('created_at', { ascending: false });
        if (category) query = query.eq('category', category);

        const { data, error } = await withTimeout(() => query.then(r => r));
        if (error) throw new Error(`Failed to fetch documents: ${error.message}`);

        return (data || []).map(row => ({
          ...row,
          file_url: row.url ?? '',
        })) as LodgeDocument[];
      })
    );
  },

  createDocument: async (
    document: Omit<LodgeDocument, 'id' | 'created_at' | 'updated_at'>
  ): Promise<LodgeDocument> => {
    const { data, error } = await supabase
      .from('lodge_documents')
      .insert([{
        title: document.title,
        category: document.category,
        url: document.file_url, // map file_url → url for Supabase
        description: document.description ?? null,
      }])
      .select()
      .single();

    if (error) throw new Error(`Failed to create document: ${error.message}`);

    optimizedApi.invalidateCache.documents(document.category);

    return {
      ...data,
      file_url: data.url ?? '',
    } as LodgeDocument;
  },

  updateDocument: async (id: string, document: Partial<LodgeDocument>): Promise<LodgeDocument> => {
    const { data, error } = await supabase
      .from('lodge_documents')
      .update({
        ...(document.title && { title: document.title }),
        ...(document.category && { category: document.category }),
        ...(document.file_url && { url: document.file_url }),
        ...(document.description && { description: document.description }),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update document: ${error.message}`);

    optimizedApi.invalidateCache.documents(document.category);

    return {
      ...data,
      file_url: data.url ?? '',
    } as LodgeDocument;
  },

  deleteDocument: async (id: string): Promise<void> => {
    const { error } = await supabase.from('lodge_documents').delete().eq('id', id);
    if (error) throw new Error(`Failed to delete document: ${error.message}`);

    optimizedApi.invalidateCache.documents();
  },

  // MEETING MINUTES
  getMeetingMinutes: async (): Promise<MeetingMinutes[]> => {
    const { data, error } = await withTimeout(() =>
      supabase.from('meeting_minutes').select('*').order('meeting_date', { ascending: false }).then(r => r)
    );
    if (error) throw new Error(`Failed to fetch meeting minutes: ${error.message}`);

    return (data || []).map(row => ({
      ...row,
      file_url: row.url ?? '',
    })) as MeetingMinutes[];
  },

  // EVENTS
  getEvents: async (): Promise<CMSEvent[]> => {
    const { data, error } = await withTimeout(() =>
      supabase.from('events').select('*').order('event_date', { ascending: true }).then(r => r)
    );
    if (error) throw new Error(`Failed to fetch events: ${error.message}`);

    return (data || []).map(row => ({
      ...row,
      is_members_only: row.is_members_only ?? false,
      is_past_event: row.is_past_event ?? false,
    })) as CMSEvent[];
  },

  // BLOG / NEWS / SNIPPETS
  getNewsArticles: async (): Promise<CMSBlogPost[]> => {
    const { data, error } = await withTimeout(() =>
      supabase
        .from('blog_posts')
        .select('id, title, summary, content, publish_date, category, tags, is_published, is_members_only, image_url')
        .eq('category', 'news')
        .order('publish_date', { ascending: false })
        .then(r => r)
    );
    if (error) throw error;

    return (data || []).map(row => ({
      ...row,
      category: (['news', 'blog', 'snippet'].includes(row.category ?? '')
        ? row.category
        : 'news') as 'news' | 'blog' | 'snippet',
    })) as CMSBlogPost[];
  },

  getBlogPosts: async (): Promise<CMSBlogPost[]> => {
    const { data, error } = await withTimeout(() =>
      supabase
        .from('blog_posts')
        .select('id, title, summary, content, publish_date, category, tags, is_published, is_members_only, image_url')
        .eq('category', 'blog')
        .order('publish_date', { ascending: false })
        .then(r => r)
    );
    if (error) throw error;

    return (data || []).map(row => ({
      ...row,
      category: (['news', 'blog', 'snippet'].includes(row.category ?? '')
        ? row.category
        : 'blog') as 'news' | 'blog' | 'snippet',
    })) as CMSBlogPost[];
  },

  getSnippets: async (): Promise<CMSBlogPost[]> => {
    const { data, error } = await withTimeout(() =>
      supabase
        .from('blog_posts')
        .select('id, title, summary, content, publish_date, category, tags, is_published, is_members_only, image_url')
        .eq('category', 'snippet')
        .order('publish_date', { ascending: false })
        .then(r => r)
    );
    if (error) throw error;

    return (data || []).map(row => ({
      ...row,
      category: (['news', 'blog', 'snippet'].includes(row.category ?? '')
        ? row.category
        : 'snippet') as 'news' | 'blog' | 'snippet',
    })) as CMSBlogPost[];
  },

  createBlogPost: async (
    post: Omit<CMSBlogPost, 'id' | 'created_at' | 'updated_at'>
  ): Promise<CMSBlogPost> => {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([{
        title: post.title,
        summary: post.summary ?? '',
        content: post.content,
        publish_date: post.publish_date || new Date().toISOString().split('T')[0],
        category: post.category,
        tags: post.tags ?? [],
        is_published: post.is_published,
        is_members_only: post.is_members_only ?? false,
        image_url: post.image_url ?? null,
      }])
      .select()
      .single();

    if (error) throw error;

    optimizedApi.invalidateCache.blogPosts();

    return data as CMSBlogPost;
  },

  updateBlogPost: async (id: string, post: Partial<CMSBlogPost>): Promise<CMSBlogPost> => {
    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        ...(post.title && { title: post.title }),
        ...(post.summary && { summary: post.summary }),
        ...(post.content && { content: post.content }),
        ...(post.publish_date && { publish_date: post.publish_date }),
        ...(post.category && { category: post.category }),
        ...(post.tags && { tags: post.tags }),
        ...(post.is_published !== undefined && { is_published: post.is_published }),
        ...(post.is_members_only !== undefined && { is_members_only: post.is_members_only }),
        ...(post.image_url && { image_url: post.image_url }),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    optimizedApi.invalidateCache.blogPosts();

    return data as CMSBlogPost;
  },

  deleteBlogPost: async (id: string): Promise<void> => {
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (error) throw error;

    optimizedApi.invalidateCache.blogPosts();
  },

  // CACHE INVALIDATION
  invalidateCache: {
    memberProfile: (userId: string) => {
      dataCache.invalidate(`member_profile:${userId}`);
      dataCache.invalidate(CACHE_KEYS.MEMBERS);
    },
    documents: (category?: string) => {
      if (category) dataCache.invalidate(CACHE_KEYS.DOCUMENTS_BY_CATEGORY(category));
      dataCache.invalidate(CACHE_KEYS.DOCUMENTS);
    },
    meetingMinutes: () => {
      dataCache.invalidate(CACHE_KEYS.MEETING_MINUTES);
    },
    events: () => {
      dataCache.invalidate(CACHE_KEYS.EVENTS);
    },
    blogPosts: () => {
      dataCache.invalidate(CACHE_KEYS.NEWS_ARTICLES);
    },
    all: () => {
      dataCache.clear();
    },
  },
};

// Export alias for gradual migration
export { optimizedApi as api };
