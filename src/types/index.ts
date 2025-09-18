// src/types/index.ts

// -----------------------------
// MEMBER PROFILES
// -----------------------------
export interface MemberProfile {
  id: string;
  user_id: string;
  full_name: string;
  email?: string;
  phone?: string;
  role?: string;         // e.g. "admin", "member"
  /** Supabase may return null, we coerce to undefined */
  status?: string;       // e.g. "active", "inactive"
  bio?: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

// -----------------------------
// DOCUMENTS
// -----------------------------
export interface LodgeDocument {
  id: string;
  title: string;
  category: string;
  /** Maps from Supabase `url` column */
  file_url: string;
  /** Raw field direct from Supabase, optional */
  url?: string;
  description?: string;
  created_at: string;
  updated_at?: string;
}

// -----------------------------
// MEETING MINUTES
// -----------------------------
export interface MeetingMinutes {
  id: string;
  title: string;
  meeting_date: string;
  /** Maps from Supabase `url` column */
  file_url: string;
  created_at: string;
  updated_at?: string;
}

// -----------------------------
// EVENTS
// -----------------------------
export interface CMSEvent {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location?: string;
  /** Supabase may return null, we coerce to boolean */
  is_members_only?: boolean;
  is_past_event?: boolean;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

// -----------------------------
// BLOG / NEWS / SNIPPETS
// -----------------------------
export interface CMSBlogPost {
  id: string;
  title: string;
  summary?: string;
  content: string;
  publish_date: string;
  /** Union narrowed with fallback in API */
  category: 'news' | 'blog' | 'snippet';
  tags?: string[];
  is_published: boolean;
  is_members_only?: boolean;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

// -----------------------------
// OFFICERS
// -----------------------------
export interface CMSOfficer {
  id: string;
  full_name: string;
  position: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

// -----------------------------
// TESTIMONIALS
// -----------------------------
export interface CMSTestimonial {
  id: string;
  member_name: string;
  content: string;
  image_url?: string;
  is_published: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

// -----------------------------
// FAQ
// -----------------------------
export interface CMSFAQItem {
  id: string;
  question: string;
  answer: string;
  is_published: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

// -----------------------------
// SITE SETTINGS
// -----------------------------
export interface CMSSiteSetting {
  id: string;
  key: string;
  value: string;
  created_at?: string;
  updated_at?: string;
}

// -----------------------------
// PAGE CONTENT
// -----------------------------
export interface CMSPageContent {
  id: string;
  page_name: string;
  section_name: string;
  content_type: 'html' | 'json' | 'text';
  content: string;
  created_at?: string;
  updated_at?: string;
}
