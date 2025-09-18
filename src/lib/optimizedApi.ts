import { supabase } from './supabase';
import { dataCache, deduplicateRequest, CACHE_KEYS } from './dataCache';
import type { Database } from '../types/supabase';

export type MemberProfile = Database['public']['Tables']['member_profiles']['Row'];
export type LodgeDocument = Database['public']['Tables']['lodge_documents']['Row'];
export type CMSBlogPost   = Database['public']['Tables']['blog_posts']['Row'];
export type CMSEvent      = Database['public']['Tables']['events']['Row'];
export type MeetingMinutes= Database['public']['Tables']['meeting_minutes']['Row'];


// ✅ Add BLOG_POSTS to cache keys
CACHE_KEYS.BLOG_POSTS = 'blog_posts';

// -------------------
// MEMBER PROFILE
// -------------------
export async function getMemberProfile(userId: string): Promise<MemberProfile | null> {
  return dataCache.get(CACHE_KEYS.MEMBERS + ':' + userId, async () => {
    const { data, error } = await supabase
      .from('member_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  });
}

export async function getAllMembers(): Promise<MemberProfile[]> {
  return dataCache.get(CACHE_KEYS.MEMBERS, async () => {
    const { data, error } = await supabase.from('member_profiles').select('*');
    if (error) throw error;
    return data || [];
  });
}

export async function getLodgeDocumentsPaginated(
  page: number = 1,
  pageSize: number = 10,
  category?: string
): Promise<{ data: LodgeDocument[]; count: number }> {
  const key = category
    ? `${CACHE_KEYS.DOCUMENTS_BY_CATEGORY(category)}:page:${page}:size:${pageSize}`
    : `${CACHE_KEYS.DOCUMENTS}:page:${page}:size:${pageSize}`;

  return dataCache.get(key, async () => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from('lodge_documents')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (category) {
      query = query.eq('category', category);
    }

    const { data, count, error } = await query;
    if (error) throw error;

    return { data: (data as LodgeDocument[]) || [], count: count || 0 };
  });
}


// -------------------
// BLOG POSTS
// -------------------
export async function getBlogPosts(): Promise<CMSBlogPost[]> {
  return dataCache.get(CACHE_KEYS.BLOG_POSTS, async () => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  });
}

export async function getBlogPost(id: string): Promise<CMSBlogPost | null> {
  return dataCache.get(CACHE_KEYS.BLOG_POSTS + ':' + id, async () => {
    const { data, error } = await supabase.from('blog_posts').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  });
}

export async function createBlogPost(
  post: Omit<CMSBlogPost, 'id' | 'created_at' | 'updated_at'>
): Promise<CMSBlogPost> {
  const { data, error } = await supabase.from('blog_posts').insert([post]).select().single();
  if (error) throw error;

  dataCache.invalidate(CACHE_KEYS.BLOG_POSTS);
  return data;
}

export async function updateBlogPost(id: string, post: Partial<CMSBlogPost>): Promise<CMSBlogPost> {
  const { data, error } = await supabase
    .from('blog_posts')
    .update(post)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;

  dataCache.invalidate(CACHE_KEYS.BLOG_POSTS);
  dataCache.invalidate(CACHE_KEYS.BLOG_POSTS + ':' + id);
  return data;
}

export async function deleteBlogPost(id: string): Promise<void> {
  const { error } = await supabase.from('blog_posts').delete().eq('id', id);
  if (error) throw error;

  dataCache.invalidate(CACHE_KEYS.BLOG_POSTS);
  dataCache.invalidate(CACHE_KEYS.BLOG_POSTS + ':' + id);
}

// -------------------
// EVENTS
// -------------------
export async function getEvents(): Promise<CMSEvent[]> {
  return dataCache.get(CACHE_KEYS.EVENTS, async () => {
    const { data, error } = await supabase.from('events').select('*').order('date', { ascending: true });
    if (error) throw error;
    return data || [];
  });
}

// -------------------
// MEETING MINUTES
// -------------------
export async function getMeetingMinutes(): Promise<MeetingMinutes[]> {
  return dataCache.get(CACHE_KEYS.MEETING_MINUTES, async () => {
    const { data, error } = await supabase
      .from('meeting_minutes')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  });
}

// -------------------
// EXPORT AS SINGLETON
// -------------------
export const optimizedApi = {
  getMemberProfile,
  getAllMembers,
  getLodgeDocuments,
  getLodgeDocumentsPaginated, // ✅ add here
  getBlogPosts,
  getBlogPost,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getEvents,
  getMeetingMinutes,
};