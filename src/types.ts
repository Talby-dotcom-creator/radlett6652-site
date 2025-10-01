// src/types.ts

// ✅ Shared type for CMS blog posts, news, snippets, charity
export interface CMSBlogPost {
  id: string
  title: string
  summary?: string | null
  content: string
  created_at: string | null
  publish_date?: string | null
  category?: string | null        // "news" | "blog" | "charity" | "snippets"
  tags?: string[] | null
  image_url?: string | null       // ✅ added to fix NewsPage
  is_members_only?: boolean | null
  is_published?: boolean | null   // published/draft flag
  author?: string | null
  featured?: boolean | null
  view_count?: number | null
}

// ✅ Lodge documents (e.g., summons, minutes, resources)
export interface LodgeDocument {
  id: string
  title: string
  description?: string
  url: string
  category: string // e.g., "grand_lodge" | "provincial" | "summons" | "minutes" | "resources" | "gpc_minutes"
  created_at: string
  updated_at: string
}

// ✅ Meeting minutes (specialised document type)
export interface MeetingMinutes {
  id: string
  meeting_date: string
  title: string
  content: string
  created_at: string
  updated_at: string
  document_url?: string | null
}

// ✅ Lodge member profile (for Admin dashboard)
export interface MemberProfile {
  id: string
  user_id: string
  full_name: string
  position?: string | null
  role: "member" | "admin"
  join_date: string
  status?: "active" | "inactive" | "pending"
  contact_email?: string | null
  contact_phone?: string | null
  share_contact_info?: boolean
  created_at: string
  updated_at: string
  last_login?: string | null
}

// ✅ Events (for CMS + public pages)
export interface CMSEvent {
  id: string
  title: string
  description: string
  event_date: string
  location?: string | null
  is_members_only?: boolean
  created_at: string
}
