// src/types/index.ts

export interface MemberProfile {
  user_id: string;
  full_name: string;
  email: string;
  status?: string;
  created_at?: string;
}

export interface LodgeDocument {
  id: string;
  title: string;
  category: string;
  description?: string | null;
  file_url: string;
  created_at?: string;
  updated_at?: string;
}

export interface MeetingMinutes {
  id: string;
  title: string;
  meeting_date: string;
  file_url: string;
  created_at?: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  event_date: string;
  is_members_only?: boolean;
  is_past_event?: boolean;
  created_at?: string;
}

export interface CMSBlogPost {
  id: string;
  title: string;
  summary?: string;
  content: string;
  publish_date: string;
  category: "news" | "blog" | "snippet";
  tags?: string[];
  is_published: boolean;
  is_members_only?: boolean;
  image_url?: string | null;
  // Additional optional fields used across the UI
  featured_image_url?: string | null;
  reading_time_minutes?: number | null;
  author_name?: string | null;
  excerpt?: string | null;
  published_at?: string | null;
  // categories may be an object in some CMS exports
  categories?: { name?: string } | string[] | null;
  created_at?: string;
  updated_at?: string;
}
