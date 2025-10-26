// src/types.ts

/* ------------------------------------------------------------------
 * 🔷 CMS Core Types — unified model for blog, events, officers, etc.
 * ------------------------------------------------------------------ */

export interface CMSBlogPost {
  id: string;
  title: string;
  content?: string | null; // ✅ optional field
  summary?: string | null;
  excerpt?: string | null;
  author?: string | null;
  author_name?: string | null;
  category?: "news" | "blog" | "snippet" | string | null;
  image_url?: string | null;
  featured_image_url?: string | null;
  image?: string | null; // ✅ alias for convenience
  publish_date?: string | null;
  published_at?: string | null;
  reading_time_minutes?: number | null;
  categories?: { name?: string } | string[] | null;
  date?: Date; // ✅ added earlier
  featured?: boolean | null;
  is_published?: boolean | null;
  is_members_only?: boolean | null;
  isMembers?: boolean | null; // ✅ add this camelCase alias
  view_count?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
  slug?: string | null;
}

/* ------------------------------------------------------------------
 * 🔷 Events
 * ------------------------------------------------------------------ */
export interface LodgeEvent {
  id: string;
  title: string;
  description?: string | null;
  event_date: string;
  location?: string | null;
  image_url?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  is_members_only?: boolean;
  // legacy alias used across older code/backups
  date?: string | null;
}

/* ------------------------------------------------------------------
 * 🔷 Officers
 * ------------------------------------------------------------------ */
export interface Officer {
  id: string;
  position: string;
  name: string;
  // older backups used full_name and different image fields
  full_name?: string;
  image_url?: string | null;
  image?: string | null;
  photo_path?: string | null;
  is_active?: boolean | null;
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
  is_published?: boolean | null;
  quote?: string;
  role?: string;
  // older forms stored member_name instead of name
  member_name?: string | null;
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
  // some components reference `url`
  url?: string | null;
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
  // legacy alias
  document_url?: string | null;
  created_at?: string | null;
  // Allow minutes to include text content in the CMS
  content?: string | null;
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
  // allow other role strings coming from DB migrations
  role: "member" | "admin" | string;
  status?: "active" | "pending" | "inactive";
  notes?: string | null;
  email_verified?: boolean | null;
  grand_lodge_rank?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  // optional legacy flags
  share_contact_info?: boolean | null;
  needs_password_reset?: boolean | null;
}

/* ------------------------------------------------------------------
 * 🔷 Page Content
 * ------------------------------------------------------------------ */
export interface PageContent {
  id: string;
  page_name: string;
  content: string;
  section_name: string;
  content_type?: string | null;
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
  // older UI expects these optional fields
  setting_type?: string | null;
  description?: string | null;
}

/* ------------------------------------------------------------------
 * 🔷 Generic Utilities
 * ------------------------------------------------------------------ */
export type Nullable<T> = T | null;
export type Maybe<T> = T | null | undefined;

/* ------------------------------------------------------------------
 * 🔷 Re-export groups
 * ------------------------------------------------------------------ */
export interface CMSEvent {
  id: string;
  title: string;
  date: string;
  description?: string;
  image_url?: string;
  is_members_only?: boolean;
}

// Alias for the CMS blog post shape when used as a news article in the UI
export type NewsArticle = CMSBlogPost;

// Backwards compatibility: older files import `Event` instead of `LodgeEvent`
export type Event = LodgeEvent;
