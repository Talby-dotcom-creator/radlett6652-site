import { supabase } from './supabase';
import { 
  CMSEvent, 
  CMSNewsArticle, 
  CMSOfficer, 
  CMSTestimonial, 
  CMSFAQItem, 
  CMSSiteSetting, 
  CMSPageContent 
} from '../types';

// Helper function to add timeout to promises
const withTimeout = <T>(promise: Promise<T>, timeoutMs: number = 15000): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => 
      setTimeout(() => reject(new Error(`Request timeout after ${timeoutMs}ms`)), timeoutMs)
    )
  ]);
};

// Add retry logic for failed requests
const withRetry = async <T>(
  operation: () => Promise<T>, 
  maxRetries: number = 1,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      if (attempt < maxRetries) {
        console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms delay`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError!;
};

export const cmsApi = {
  // Events
  getEvents: async (): Promise<CMSEvent[]> => {
    try {
      return withRetry(async () => {
        console.log('🔍 CmsAPI: Fetching events...');
        const startTime = Date.now();
        
        const query = supabase
          .from('events')
          .select('*')
          .order('event_date', { ascending: true });
        
        const { data, error } = await withTimeout(query, 10000); // Reduced timeout
        
        const queryTime = Date.now() - startTime;
        console.log(`📅 CmsAPI: Events query completed in ${queryTime}ms`);
        
        if (error) {
          console.error('Error fetching events:', error);
          throw new Error(`Failed to fetch events: ${error.message}`);
        }
        
        console.log(`📅 CmsAPI: Retrieved ${data?.length || 0} events`);
        return data as CMSEvent[];
      });
    } catch (error) {
      console.error('CMS API Error - getEvents:', error);
      throw error;
    }
  },

  getNextUpcomingEvent: async (): Promise<CMSEvent | null> => {
    try {
      const now = new Date().toISOString();
      const query = supabase
        .from('events')
        .select('*')
        .eq('is_past_event', false)
        .gte('event_date', now)
        .order('event_date', { ascending: true })
        .limit(1);
      
      const { data, error } = await withTimeout(query);
      
      if (error) {
        console.error('Error fetching next upcoming event:', error);
        throw new Error(`Failed to fetch next upcoming event: ${error.message}`);
      }
      
      return data && data.length > 0 ? data[0] as CMSEvent : null;
    } catch (error) {
      console.error('CMS API Error - getNextUpcomingEvent:', error);
      throw error;
    }
  },

  createEvent: async (event: Omit<CMSEvent, 'id' | 'created_at' | 'updated_at'>): Promise<CMSEvent> => {
    try {
      const query = supabase
        .from('events')
        .insert(event)
        .select()
        .single();
      
      const { data, error } = await withTimeout(query);
      
      if (error) {
        console.error('Error creating event:', error);
        throw new Error(`Failed to create event: ${error.message}`);
      }
      
      return data as CMSEvent;
    } catch (error) {
      console.error('CMS API Error - createEvent:', error);
      throw error;
    }
  },

  updateEvent: async (id: string, event: Partial<CMSEvent>): Promise<CMSEvent> => {
    try {
      const query = supabase
        .from('events')
        .update(event)
        .eq('id', id)
        .select()
        .single();
      
      const { data, error } = await withTimeout(query);
      
      if (error) {
        console.error('Error updating event:', error);
        throw new Error(`Failed to update event: ${error.message}`);
      }
      
      return data as CMSEvent;
    } catch (error) {
      console.error('CMS API Error - updateEvent:', error);
      throw error;
    }
  },

  deleteEvent: async (id: string): Promise<void> => {
    try {
      const query = supabase
        .from('events')
        .delete()
        .eq('id', id);
      
      const { error } = await withTimeout(query);
      
      if (error) {
        console.error('Error deleting event:', error);
        throw new Error(`Failed to delete event: ${error.message}`);
      }
    } catch (error) {
      console.error('CMS API Error - deleteEvent:', error);
      throw error;
    }
  },

  // News Articles
  getNewsArticles: async (): Promise<CMSBlogPost[]> => {
    try {
      const query = supabase
        .from('blog_posts')
        .select('*')
        .eq('category', 'news')
        .order('publish_date', { ascending: false });
      
      const { data, error } = await withTimeout(query);
      
      if (error) {
        console.error('Error fetching blog posts:', error);
        throw new Error(`Failed to fetch blog posts: ${error.message}`);
      }
      
      return data as CMSBlogPost[];
    } catch (error) {
      console.error('CMS API Error - getNewsArticles:', error);
      throw error;
    }
  },

  getBlogPosts: async (): Promise<CMSBlogPost[]> => {
    try {
      const query = supabase
        .from('blog_posts')
        .select('*')
        .eq('category', 'blog')
        .order('publish_date', { ascending: false });
      
      const { data, error } = await withTimeout(query);
      
      if (error) {
        console.error('Error fetching blog posts:', error);
        throw new Error(`Failed to fetch blog posts: ${error.message}`);
      }
      
      return data as CMSBlogPost[];
    } catch (error) {
      console.error('CMS API Error - getBlogPosts:', error);
      throw error;
    }
  },

  getSnippets: async (): Promise<CMSBlogPost[]> => {
    try {
      const query = supabase
        .from('blog_posts')
        .select('*')
        .eq('category', 'snippet')
        .order('publish_date', { ascending: false });
      
      const { data, error } = await withTimeout(query);
      
      if (error) {
        console.error('Error fetching snippets:', error);
        throw new Error(`Failed to fetch snippets: ${error.message}`);
      }
      
      return data as CMSBlogPost[];
    } catch (error) {
      console.error('CMS API Error - getSnippets:', error);
      throw error;
    }
  },

  getLatestSnippet: async (): Promise<CMSBlogPost | null> => {
    try {
      const query = supabase
        .from('blog_posts')
        .select('*')
        .eq('category', 'snippet')
        .eq('is_published', true)
        .order('publish_date', { ascending: false })
        .limit(1);
      
      const { data, error } = await withTimeout(query);
      
      if (error) {
        console.error('Error fetching latest snippet:', error);
        throw new Error(`Failed to fetch latest snippet: ${error.message}`);
      }
      
      return data && data.length > 0 ? data[0] as CMSBlogPost : null;
    } catch (error) {
      console.error('CMS API Error - getLatestSnippet:', error);
      throw error;
    }
  },

  createNewsArticle: async (article: Omit<CMSBlogPost, 'id' | 'created_at' | 'updated_at'>): Promise<CMSBlogPost> => {
    try {
      // Ensure publish_date is properly formatted
      const formattedArticle = {
        ...article,
        publish_date: article.publish_date || new Date().toISOString().split('T')[0]
      };
      
      const query = supabase
        .from('blog_posts')
        .insert(formattedArticle)
        .select()
        .single();
      
      const { data, error } = await withTimeout(query);
      
      if (error) {
        console.error('Error creating blog post:', error);
        throw new Error(`Failed to create blog post: ${error.message}`);
      }
      
      return data as CMSBlogPost;
    } catch (error) {
      console.error('CMS API Error - createNewsArticle:', error);
      throw error;
    }
  },

  updateNewsArticle: async (id: string, article: Partial<CMSBlogPost>): Promise<CMSBlogPost> => {
    try {
      const query = supabase
        .from('blog_posts')
        .update(article)
        .eq('id', id)
        .select()
        .single();
      
      const { data, error } = await withTimeout(query);
      
      if (error) {
        console.error('Error updating blog post:', error);
        throw new Error(`Failed to update blog post: ${error.message}`);
      }
      
      return data as CMSBlogPost;
    } catch (error) {
      console.error('CMS API Error - updateNewsArticle:', error);
      throw error;
    }
  },

  deleteNewsArticle: async (id: string): Promise<void> => {
    try {
      const query = supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);
      
      const { error } = await withTimeout(query);
      
      if (error) {
        console.error('Error deleting blog post:', error);
        throw new Error(`Failed to delete blog post: ${error.message}`);
      }
    } catch (error) {
      console.error('CMS API Error - deleteNewsArticle:', error);
      throw error;
    }
  },

  createBlogPost: async (post: Omit<CMSBlogPost, 'id' | 'created_at' | 'updated_at'>): Promise<CMSBlogPost> => {
    try {
      // Ensure publish_date is properly formatted
      const formattedPost = {
        ...post,
        publish_date: post.publish_date || new Date().toISOString().split('T')[0]
      };
      
      const query = supabase
        .from('blog_posts')
        .insert(formattedPost)
        .select()
        .single();
      
      const { data, error } = await withTimeout(query);
      
      if (error) {
        console.error('Error creating blog post:', error);
        throw new Error(`Failed to create blog post: ${error.message}`);
      }
      
      return data as CMSBlogPost;
    } catch (error) {
      console.error('CMS API Error - createBlogPost:', error);
      throw error;
    }
  },

  updateBlogPost: async (id: string, post: Partial<CMSBlogPost>): Promise<CMSBlogPost> => {
    try {
      const query = supabase
        .from('blog_posts')
        .update(post)
        .eq('id', id)
        .select()
        .single();
      
      const { data, error } = await withTimeout(query);
      
      if (error) {
        console.error('Error updating blog post:', error);
        throw new Error(`Failed to update blog post: ${error.message}`);
      }
      
      return data as CMSBlogPost;
    } catch (error) {
      console.error('CMS API Error - updateBlogPost:', error);
      throw error;
    }
  },

  deleteBlogPost: async (id: string): Promise<void> => {
    try {
      const query = supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);
      
      const { error } = await withTimeout(query);
      
      if (error) {
        console.error('Error deleting blog post:', error);
        throw new Error(`Failed to delete blog post: ${error.message}`);
      }
    } catch (error) {
      console.error('CMS API Error - deleteBlogPost:', error);
      throw error;
    }
  },

  // Officers
  getOfficers: async (): Promise<CMSOfficer[]> => {
    try {
      const query = supabase
        .from('officers')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      
      const { data, error } = await withTimeout(query);
      
      if (error) {
        console.error('Error fetching officers:', error);
        throw new Error(`Failed to fetch officers: ${error.message}`);
      }
      
      return data as CMSOfficer[];
    } catch (error) {
      console.error('CMS API Error - getOfficers:', error);
      throw error;
    }
  },

  createOfficer: async (officer: Omit<CMSOfficer, 'id' | 'created_at' | 'updated_at'>): Promise<CMSOfficer> => {
    try {
      const query = supabase
        .from('officers')
        .insert(officer)
        .select()
        .single();
      
      const { data, error } = await withTimeout(query);
      
      if (error) {
        console.error('Error creating officer:', error);
        throw new Error(`Failed to create officer: ${error.message}`);
      }
      
      return data as CMSOfficer;
    } catch (error) {
      console.error('CMS API Error - createOfficer:', error);
      throw error;
    }
  },

  updateOfficer: async (id: string, officer: Partial<CMSOfficer>): Promise<CMSOfficer> => {
    try {
      const query = supabase
        .from('officers')
        .update(officer)
        .eq('id', id)
        .select()
        .single();
      
      const { data, error } = await withTimeout(query);
      
      if (error) {
        console.error('Error updating officer:', error);
        throw new Error(`Failed to update officer: ${error.message}`);
      }
      
      return data as CMSOfficer;
    } catch (error) {
      console.error('CMS API Error - updateOfficer:', error);
      throw error;
    }
  },

  deleteOfficer: async (id: string): Promise<void> => {
    try {
      const query = supabase
        .from('officers')
        .delete()
        .eq('id', id);
      
      const { error } = await withTimeout(query);
      
      if (error) {
        console.error('Error deleting officer:', error);
        throw new Error(`Failed to delete officer: ${error.message}`);
      }
    } catch (error) {
      console.error('CMS API Error - deleteOfficer:', error);
      throw error;
    }
  },

  // Testimonials
  getTestimonials: async (): Promise<CMSTestimonial[]> => {
    try {
      const query = supabase
        .from('testimonials')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true });
      
      const { data, error } = await withTimeout(query);
      
      if (error) {
        console.error('Error fetching testimonials:', error);
        throw new Error(`Failed to fetch testimonials: ${error.message}`);
      }
      
      return data as CMSTestimonial[];
    } catch (error) {
      console.error('CMS API Error - getTestimonials:', error);
      throw error;
    }
  },

  createTestimonial: async (testimonial: Omit<CMSTestimonial, 'id' | 'created_at' | 'updated_at'>): Promise<CMSTestimonial> => {
    try {
      const query = supabase
        .from('testimonials')
        .insert(testimonial)
        .select()
        .single();
      
      const { data, error } = await withTimeout(query);
      
      if (error) {
        console.error('Error creating testimonial:', error);
        throw new Error(`Failed to create testimonial: ${error.message}`);
      }
      
      return data as CMSTestimonial;
    } catch (error) {
      console.error('CMS API Error - createTestimonial:', error);
      throw error;
    }
  },

  updateTestimonial: async (id: string, testimonial: Partial<CMSTestimonial>): Promise<CMSTestimonial> => {
    try {
      const query = supabase
        .from('testimonials')
        .update(testimonial)
        .eq('id', id)
        .select()
        .single();
      
      const { data, error } = await withTimeout(query);
      
      if (error) {
        console.error('Error updating testimonial:', error);
        throw new Error(`Failed to update testimonial: ${error.message}`);
      }
      
      return data as CMSTestimonial;
    } catch (error) {
      console.error('CMS API Error - updateTestimonial:', error);
      throw error;
    }
  },

  deleteTestimonial: async (id: string): Promise<void> => {
    try {
      const query = supabase
        .from('testimonials')
        .delete()
        .eq('id', id);
      
      const { error } = await withTimeout(query);
      
      if (error) {
        console.error('Error deleting testimonial:', error);
        throw new Error(`Failed to delete testimonial: ${error.message}`);
      }
    } catch (error) {
      console.error('CMS API Error - deleteTestimonial:', error);
      throw error;
    }
  },

  // FAQ Items
  getFAQItems: async (): Promise<CMSFAQItem[]> => {
    try {
      const query = supabase
        .from('faq_items')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true });
      
      const { data, error } = await withTimeout(query);
      
      if (error) {
        console.error('Error fetching FAQ items:', error);
        throw new Error(`Failed to fetch FAQ items: ${error.message}`);
      }
      
      return data as CMSFAQItem[];
    } catch (error) {
      console.error('CMS API Error - getFAQItems:', error);
      throw error;
    }
  },

  createFAQItem: async (faq: Omit<CMSFAQItem, 'id' | 'created_at' | 'updated_at'>): Promise<CMSFAQItem> => {
    try {
      const query = supabase
        .from('faq_items')
        .insert(faq)
        .select()
        .single();
      
      const { data, error } = await withTimeout(query);
      
      if (error) {
        console.error('Error creating FAQ item:', error);
        throw new Error(`Failed to create FAQ item: ${error.message}`);
      }
      
      return data as CMSFAQItem;
    } catch (error) {
      console.error('CMS API Error - createFAQItem:', error);
      throw error;
    }
  },

  updateFAQItem: async (id: string, faq: Partial<CMSFAQItem>): Promise<CMSFAQItem> => {
    try {
      const query = supabase
        .from('faq_items')
        .update(faq)
        .eq('id', id)
        .select()
        .single();
      
      const { data, error } = await withTimeout(query);
      
      if (error) {
        console.error('Error updating FAQ item:', error);
        throw new Error(`Failed to update FAQ item: ${error.message}`);
      }
      
      return data as CMSFAQItem;
    } catch (error) {
      console.error('CMS API Error - updateFAQItem:', error);
      throw error;
    }
  },

  deleteFAQItem: async (id: string): Promise<void> => {
    try {
      const query = supabase
        .from('faq_items')
        .delete()
        .eq('id', id);
      
      const { error } = await withTimeout(query);
      
      if (error) {
        console.error('Error deleting FAQ item:', error);
        throw new Error(`Failed to delete FAQ item: ${error.message}`);
      }
    } catch (error) {
      console.error('CMS API Error - deleteFAQItem:', error);
      throw error;
    }
  },

  // Site Settings
  getSiteSettings: async (): Promise<CMSSiteSetting[]> => {
    try {
      const query = supabase
        .from('site_settings')
        .select('*')
        .order('setting_key', { ascending: true });
      
      const { data, error } = await withTimeout(query);
      
      if (error) {
        console.error('Error fetching site settings:', error);
        throw new Error(`Failed to fetch site settings: ${error.message}`);
      }
      
      return data as CMSSiteSetting[];
    } catch (error) {
      console.error('CMS API Error - getSiteSettings:', error);
      throw error;
    }
  },

  updateSiteSetting: async (key: string, value: string): Promise<CMSSiteSetting> => {
    try {
      const query = supabase
        .from('site_settings')
        .update({ setting_value: value })
        .eq('setting_key', key)
        .select()
        .single();
      
      const { data, error } = await withTimeout(query);
      
      if (error) {
        console.error('Error updating site setting:', error);
        throw new Error(`Failed to update site setting: ${error.message}`);
      }
      
      return data as CMSSiteSetting;
    } catch (error) {
      console.error('CMS API Error - updateSiteSetting:', error);
      throw error;
    }
  },

  // Page Content
  getPageContent: async (pageName?: string): Promise<CMSPageContent[]> => {
    try {
      let query = supabase
        .from('page_content')
        .select('*');
      
      if (pageName) {
        query = query.eq('page_name', pageName);
      }
      
      query = query.order('page_name', { ascending: true });
      
      const { data, error } = await withTimeout(query);
      
      if (error) {
        console.error('Error fetching page content:', error);
        throw new Error(`Failed to fetch page content: ${error.message}`);
      }
      
      return data as CMSPageContent[];
    } catch (error) {
      console.error('CMS API Error - getPageContent:', error);
      throw error;
    }
  },

  updatePageContent: async (pageName: string, sectionName: string, content: string): Promise<CMSPageContent> => {
    try {
      const query = supabase
        .from('page_content')
        .upsert({ 
          page_name: pageName, 
          section_name: sectionName, 
          content: content,
          content_type: 'text'
        })
        .select()
        .single();
      
      const { data, error } = await withTimeout(query);
      
      if (error) {
        console.error('Error updating page content:', error);
        throw new Error(`Failed to update page content: ${error.message}`);
      }
      
      return data as CMSPageContent;
    } catch (error) {
      console.error('CMS API Error - updatePageContent:', error);
      throw error;
    }
  },

  createPageContent: async (pageContent: Omit<CMSPageContent, 'id' | 'updated_at'>): Promise<CMSPageContent> => {
    try {
      const query = supabase
        .from('page_content')
        .insert(pageContent)
        .select()
        .single();
      
      const { data, error } = await withTimeout(query);
      
      if (error) {
        console.error('Error creating page content:', error);
        throw new Error(`Failed to create page content: ${error.message}`);
      }
      
      return data as CMSPageContent;
    } catch (error) {
      console.error('CMS API Error - createPageContent:', error);
      throw error;
    }
  }
};