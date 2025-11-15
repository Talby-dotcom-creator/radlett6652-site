// src/types.ts
// Lightweight, central project types used across the app.
// This file intentionally exports the CMS-friendly interfaces (blog, events,
// officers, documents, members, etc.) and re-exports the generated
// Supabase Database type for places that need it.

export interface CMSBlogPost {
  id: string;
  title: string;
  content: string;
  summary?: string | null;

  // 👇 restored legacy compatibility fields
  excerpt?: string | null; // used in PillarsPage & older blog posts
  slug?: string | null; // used for route paths (/pillars/:slug)

  author?: string | null;
  category?: "news" | "blog" | "snippet";
  image_url?: string | null;
  featured_image_url?: string | null;
  seo_description?: string | null;
  // optional subcategory name used in the Pillars UI
  subcategory_name?: string | null;
  publish_date?: string | null;
  featured?: boolean | null;
  is_published?: boolean | null;
  author_name?: string | null;
  reading_time_minutes?: number | null;
  is_members_only?: boolean | null;
  view_count?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  is_members_only: boolean;
  is_past_event?: boolean;
  image_url?: string; // ✅ REQUIRED
  is_public?: boolean; // ✅ in your DB row
  event_time?: string | null; // ✅ your UI reads this
  created_at?: string;
  updated_at?: string;
}

export interface Officer {
  id: string;
  position: string;
  name: string;
  image_url?: string | null;
  sort_order?: number | null;
  // legacy/alternate fields
  full_name?: string;
  is_active?: boolean;
  image?: string;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface Testimonial {
  id: string;
  name: string;
  content: string;
  image_url?: string | null;
  sort_order?: number | null;
  // legacy/alternate fields used in some places
  member_name?: string | null;
  is_published?: boolean | null;
  quote?: string | null;
  role?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface LodgeDocument {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  file_url: string;
  document_date?: string | null; // The actual date of the document (for sorting)
  publish_date?: string | null; // Added for compatibility with CMSAdminPage
  created_at?: string | null;
  updated_at?: string | null;
  // alternate/legacy field name seen across the codebase
  url?: string | null;
}

export interface MeetingMinutes {
  id: string;
  title: string;
  meeting_date: string;
  file_url: string;
  created_at?: string | null;
  // some places use `content` or `document_url`
  content?: string | null;
  document_url?: string | null;
}

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
  // additional optional flags used in UI/forms
  share_contact_info?: boolean | null;
  needs_password_reset?: boolean | null;
}

export interface PageContent {
  id: string;
  page_name: string;
  content: string;
  updated_at?: string | null;
  // fields used by admin UI and forms
  section_name?: string | null;
  content_type?: string | null;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  sort_order?: number | null;
  is_published?: boolean | null;
  is_visible?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface SiteSetting {
  id: string;
  setting_key: string;
  setting_value: string;
  updated_at?: string | null;
  // optional metadata used by the CMS UI
  setting_type?: string | null;
  description?: string | null;
}

// Small aliases and re-exports for backwards compatibility with older code.
export type { CMSBlogPost as CMSNewsArticle, CMSBlogPost as CMSSnippet };
export type { Event as CMSEvent, Officer as CMSOfficer };
export type { FAQItem as CMSFAQItem, PageContent as CMSPageContent };
export type { SiteSetting as CMSSiteSetting };

// Backwards-compatible alias used in several places
export type LodgeEvent = Event;

// Re-export the generated Supabase Database type so modules can import it
// from `src/types` (convenience only).
export type { Database } from "./types/supabase";
