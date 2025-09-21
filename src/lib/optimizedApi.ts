// src/lib/optimizedApi.ts
import { supabase } from './supabase'

// ✅ Single source of truth for blog_posts rows
export type CMSBlogPost = {
  id: string
  title: string
  summary?: string | null
  content: string
  created_at: string | null
  publish_date?: string | null
  category?: string | null        // e.g. "news" | "blog" | "charity" | "snippets"
  tags?: string[] | null
  image_url?: string | null
  is_members_only?: boolean | null
  is_published?: boolean | null
  author?: string | null
  featured?: boolean | null
  view_count?: number | null
}

// ✅ Blog posts
async function getBlogPosts(): Promise<CMSBlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('❌ Error fetching blog posts:', error)
    return []
  }

  return (data ?? []) as CMSBlogPost[]
}

async function getBlogPost(id: string): Promise<CMSBlogPost | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error(`❌ Error fetching blog post ${id}:`, error)
    return null
  }

  return data as CMSBlogPost
}

// ✅ News
async function getNews(): Promise<CMSBlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('category', 'news')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('❌ Error fetching news:', error)
    return []
  }

  return (data ?? []) as CMSBlogPost[]
}

// ✅ Snippets
async function getSnippets(): Promise<CMSBlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('category', 'snippets')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('❌ Error fetching snippets:', error)
    return []
  }

  return (data ?? []) as CMSBlogPost[]
}

// ✅ Charity
async function getCharity(): Promise<CMSBlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('category', 'charity')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('❌ Error fetching charity:', error)
    return []
  }

  return (data ?? []) as CMSBlogPost[]
}

// ✅ Centralized export
export const optimizedApi = {
  getBlogPosts,
  getBlogPost,
  getNews,
  getSnippets,
  getCharity,
}
