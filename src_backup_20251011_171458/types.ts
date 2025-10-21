// src/types.ts

/* ------------------------------------------------------------------
 * 🔷 CMS Core Types — unified model for blog, events, officers, etc.
 * ------------------------------------------------------------------ */

export interface CMSBlogPost {
  id: string;
  title: string;
  content: string;
  summary?: string | null;
  author?: string | null;
  category: "news" | "blog" | "snippet";
  image_url?: string | null;
  publish_date?: string | null;
  featured?: boolean | null;
  is_published?: boolean | null;
  is_members_only?: boolean | null;
  view_count?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
}

/* ------------------------------------------------------------------
 * 🔷 Events
 * ------------------------------------------------------------------ */
export interface Event {
  id: string;
  title: string;
  description?: string | null;
  event_date: string;
  location?: string | null;
  image_url?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

/* ------------------------------------------------------------------
 * 🔷 Officers
 * ------------------------------------------------------------------ */
export interface Officer {
  id: string;
  position: string;
  name: string;
  image_url?: string | null;
  sort_order?: number | null;
}

/* ------------------------------------------------------------------
 * 🔷 Testimonials
 * ------------------------------------------------------------------ */
export interface Testimonial {
  id: string;
  name: string;
  content: string;
  image_url?: string | null;
  sort_order?: number | null;
}

/* ------------------------------------------------------------------
 * 🔷 Lodge Documents
 * ------------------------------------------------------------------ */
export interface LodgeDocument {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  file_url: string;
  created_at?: string | null;
  updated_at?: string | null;
}

/* ------------------------------------------------------------------
 * 🔷 Meeting Minutes
 * ------------------------------------------------------------------ */
export interface MeetingMinutes {
  id: string;
  title: string;
  meeting_date: string;
  file_url: string;
  created_at?: string | null;
}

/* ------------------------------------------------------------------
 * 🔷 Member Profiles
 * ------------------------------------------------------------------ */
export interface MemberProfile {
  id: string;
  user_id: string;
  full_name: string;
  contact_email?: string | null;
  contact_phone?: string | null;
  address?: string | null;
  join_date?: string | null;
  position?: string | null;
  role: "member" | "admin";
  status?: "active" | "pending" | "inactive";
  notes?: string | null;
  email_verified?: boolean | null;
  grand_lodge_rank?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

/* ------------------------------------------------------------------
 * 🔷 Page Content
 * ------------------------------------------------------------------ */
export interface PageContent {
  id: string;
  page_name: string;
  content: string;
  updated_at?: string | null;
}

/* ------------------------------------------------------------------
 * 🔷 FAQ Items
 * ------------------------------------------------------------------ */
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  sort_order?: number | null;
  is_published?: boolean | null;
}

/* ------------------------------------------------------------------
 * 🔷 Site Settings
 * ------------------------------------------------------------------ */
export interface SiteSetting {
  id: string;
  setting_key: string;
  setting_value: string;
  updated_at?: string | null;
}

/* ------------------------------------------------------------------
 * 🔷 Generic Utilities
 * ------------------------------------------------------------------ */
export type Nullable<T> = T | null;
export type Maybe<T> = T | null | undefined;

/* ------------------------------------------------------------------
 * 🔷 Re-export groups
 * ------------------------------------------------------------------ */
export type {
  CMSBlogPost as CMSNewsArticle,
  CMSBlogPost as CMSSnippet,
  Event as CMSEvent,
  Officer as CMSOfficer,
  FAQItem as CMSFAQItem,
  PageContent as CMSPageContent,
  SiteSetting as CMSSiteSetting,
};

// Backwards-compatible alias used in newer code
export type LodgeEvent = Event;
