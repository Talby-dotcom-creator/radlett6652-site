// src/lib/optimizedApi.ts
import { supabase } from './supabase'
import {
  CMSBlogPost,
  MemberProfile,
  LodgeDocument,
  MeetingMinutes,
  CMSEvent,
} from '../types'

/* ------------------ BLOGS ------------------ */
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

async function getNews(): Promise<CMSBlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('category', 'news')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (error) return []
  return (data ?? []) as CMSBlogPost[]
}

async function getSnippets(): Promise<CMSBlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('category', 'snippets')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (error) return []
  return (data ?? []) as CMSBlogPost[]
}

async function getCharity(): Promise<CMSBlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('category', 'charity')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (error) return []
  return (data ?? []) as CMSBlogPost[]
}

/* ------------------ MEMBERS ------------------ */
async function getAllMembers(): Promise<MemberProfile[]> {
  const { data, error } = await supabase
    .from('member_profiles')
    .select('*')
    .order('full_name')

  if (error) {
    console.error('❌ Error fetching members:', error)
    return []
  }
  return (data ?? []) as MemberProfile[]
}

async function updateMemberProfile(
  userId: string,
  updates: Partial<MemberProfile>
) {
  const { data, error } = await supabase
    .from('member_profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  return data as MemberProfile
}

async function adminCreateMemberProfile(profile: Omit<MemberProfile, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('member_profiles')
    .insert(profile)
    .select()
    .single()

  if (error) throw error
  return data as MemberProfile
}

async function deleteUserAndProfile(userId: string) {
  await supabase.from('member_profiles').delete().eq('user_id', userId)
  // ⚠️ Deleting from auth.users requires service role key (server-side only)
}

/* ------------------ DOCUMENTS ------------------ */
async function getLodgeDocuments(): Promise<LodgeDocument[]> {
  const { data, error } = await supabase
    .from('lodge_documents')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('❌ Error fetching documents:', error)
    return []
  }
  return (data ?? []) as LodgeDocument[]
}

async function getLodgeDocumentsPaginated(
  page: number,
  pageSize: number,
  category?: string
) {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('lodge_documents')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })

  if (category) query = query.eq('category', category)

  const { data, error, count } = await query.range(from, to)

  if (error) {
    console.error('❌ Error fetching paginated documents:', error)
    return { documents: [], total: 0, hasMore: false }
  }

  return {
    documents: data as LodgeDocument[],
    total: count ?? 0,
    hasMore: to + 1 < (count ?? 0),
  }
}

async function createDocument(
  doc: Omit<LodgeDocument, 'id' | 'created_at' | 'updated_at'>
) {
  const { data, error } = await supabase
    .from('lodge_documents')
    .insert(doc)
    .select()
    .single()

  if (error) throw error
  return data as LodgeDocument
}

async function updateDocument(id: string, updates: Partial<LodgeDocument>) {
  const { data, error } = await supabase
    .from('lodge_documents')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as LodgeDocument
}

async function deleteDocument(id: string) {
  const { error } = await supabase.from('lodge_documents').delete().eq('id', id)
  if (error) throw error
}

/* ------------------ MEETING MINUTES ------------------ */
async function getMeetingMinutes(): Promise<MeetingMinutes[]> {
  const { data, error } = await supabase
    .from('meeting_minutes')
    .select('*')
    .order('meeting_date', { ascending: false })

  if (error) {
    console.error('❌ Error fetching minutes:', error)
    return []
  }
  return (data ?? []) as MeetingMinutes[]
}

async function createMinutes(
  minute: Omit<MeetingMinutes, 'id' | 'created_at' | 'updated_at'>
) {
  const { data, error } = await supabase
    .from('meeting_minutes')
    .insert(minute)
    .select()
    .single()

  if (error) throw error
  return data as MeetingMinutes
}

async function updateMinutes(id: string, updates: Partial<MeetingMinutes>) {
  const { data, error } = await supabase
    .from('meeting_minutes')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as MeetingMinutes
}

async function deleteMinutes(id: string) {
  const { error } = await supabase.from('meeting_minutes').delete().eq('id', id)
  if (error) throw error
}

/* ------------------ EVENTS ------------------ */
async function getEvents(): Promise<CMSEvent[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: true })

  if (error) {
    console.error('❌ Error fetching events:', error)
    return []
  }
  return (data ?? []) as CMSEvent[]
}

/* ------------------ EXPORT ------------------ */
export const optimizedApi = {
  // Blog
  getBlogPosts,
  getBlogPost,
  getNews,
  getSnippets,
  getCharity,
  // Members
  getAllMembers,
  updateMemberProfile,
  adminCreateMemberProfile,
  deleteUserAndProfile,
  // Documents
  getLodgeDocuments,
  getLodgeDocumentsPaginated,
  createDocument,
  updateDocument,
  deleteDocument,
  // Minutes
  getMeetingMinutes,
  createMinutes,
  updateMinutes,
  deleteMinutes,
  // Events
  getEvents,
}
