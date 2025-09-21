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
