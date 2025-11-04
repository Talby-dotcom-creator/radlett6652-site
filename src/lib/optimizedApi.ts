// src/lib/optimizedApi.ts
import { supabase } from "./supabase";
import type { Database } from "../types/supabase";
import {
  CMSBlogPost,
  LodgeEvent,
  Officer,
  Testimonial,
  LodgeDocument,
  MeetingMinutes,
  MemberProfile,
  PageContent,
  FAQItem,
  SiteSetting,
} from "../types";

/* ------------------------------------------------------
 * Error handling helper
 * ---------------------------------------------------- */
const handleError = (error: any, context: string) => {
  console.error(`❌ ${context}:`, error.message || error);
  throw new Error(`${context} failed: ${error.message || "Unknown error"}`);
};

/* ------------------------------------------------------
 * Unified Optimized API Layer
 * ---------------------------------------------------- */
export const optimizedApi: any = {
  /* ---------------- CONNECTION TEST ---------------- */
  async checkConnection() {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id")
        .limit(1);
      if (error) throw error;
      console.log("✅ Supabase connected successfully");
      return true;
    } catch (err) {
      console.error("❌ Supabase connection failed:", err);
      return false;
    }
  },

  /* ---------------- BLOG POSTS ---------------- */
  async getBlogPosts(
    category: "blog" | "news" | "snippet" | null = null
  ): Promise<CMSBlogPost[]> {
    let query = supabase
      .from("blog_posts")
      .select("*")
      .eq("is_published", true)
      .order("publish_date", { ascending: false });

    if (category) query = query.eq("category", category);

    const { data, error } = await query;

    if (error) {
      console.error("❌ getBlogPosts error:", error);
      return [];
    }

    console.log("✅ getBlogPosts fetched:", data?.length, "posts");
    return (data ?? []) as CMSBlogPost[];
  },
  async getBlogPostBySlug(slug: string): Promise<CMSBlogPost | null> {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) handleError(error, "getBlogPostBySlug");
      if (!data) return null;

      // Map to the CMSBlogPost shape used by the app
      const d: any = data;
      const post = {
        ...d,
        title: d.title ?? "Untitled Post",
        summary: d.summary ?? d.excerpt ?? "",
        publish_date: d.publish_date ?? d.published_at ?? d.created_at,
        image_url: d.image_url ?? d.featured_image_url ?? null,
        featured_image_url: d.featured_image_url ?? null,
        reading_time_minutes: d.reading_time_minutes ?? null,
        author_name: d.author_name ?? d.author ?? null,
        categories: d.categories ?? null,
      } as CMSBlogPost;

      return post;
    } catch (err: any) {
      handleError(err, "getBlogPostBySlug");
      return null;
    }
  },

  /* ---------------- LATEST SNIPPET ---------------- */
  async getLatestSnippet(): Promise<{
    id: string;
    title: string;
    subtitle: string;
    content: string;
    publish_date: string | null;
  }> {
    try {
      const { data, error } = await supabase
        .from("snippets" as any) // table not present in typed Database; cast to any for flexibility
        .select("id, title, subtitle, content, publish_date, is_active")
        .eq("is_active", true)
        .order("publish_date", { ascending: false })
        .limit(1);

      if (error) handleError(error, "getLatestSnippet");

      if (!data || data.length === 0) {
        console.warn("⚠️ No active snippets found.");
        return {
          id: "",
          title: "No snippet found",
          subtitle: "Please check back after Monday 9pm",
          content: "There are currently no active reflections available.",
          publish_date: null,
        };
      }

      // Grab the first row
      const rows = (data ?? []) as any[];
      const row = rows[0] || null;
      return {
        id: row.id,
        title: row.title ?? "Untitled Snippet",
        subtitle: row.subtitle ?? "",
        content: row.content ?? "",
        publish_date: row.publish_date ?? null,
      };
    } catch (err: any) {
      handleError(err, "getLatestSnippet");
      return {
        id: "",
        title: "Error loading snippet",
        subtitle: "",
        content: "There was a problem fetching the latest reflection.",
        publish_date: null,
      };
    }
  },

  // Raw fetch (no mapping) — useful when you need the original DB row
  async getRawBlogPostBySlug(slug: string): Promise<any | null> {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) handleError(error, "getRawBlogPostBySlug");
      return data ?? null;
    } catch (err: any) {
      handleError(err, "getRawBlogPostBySlug");
      return null;
    }
  },

  /* ---------------- EVENTS ---------------- */
  async getEvents(): Promise<LodgeEvent[]> {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_date");
    if (error) handleError(error, "getEvents");
    return (data ?? []).map((event: any) => ({
      ...event,
      is_members_only: event.is_members_only ?? undefined,
      is_past_event: event.is_past_event ?? undefined,
    }));
  },

  async getNextUpcomingEvent(): Promise<LodgeEvent | null> {
    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .gt("event_date", now)
        .order("event_date", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (error) handleError(error, "getNextUpcomingEvent");
      if (!data) return null;
      return {
        ...data,
        is_members_only: data.is_members_only ?? undefined,
        is_past_event: data.is_past_event ?? undefined,
      };
    } catch (err: any) {
      handleError(err, "getNextUpcomingEvent");
      return null;
    }
  },

  /* ---------------- OFFICERS ---------------- */
  async getOfficers(): Promise<Officer[]> {
    const { data, error } = await supabase
      .from("officers")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) handleError(error, "getOfficers");

    return (data ?? []).map((officer: any) => ({
      ...officer,
      name: officer.name ?? officer.full_name ?? "",
      image_url: officer.image_url ?? "",
      position: officer.position ?? "",
    }));
  },

  /* ---------------- TESTIMONIALS ---------------- */
  async getTestimonials(): Promise<Testimonial[]> {
    try {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_published", true)
        .order("sort_order", { ascending: true });

      if (error) handleError(error, "getTestimonials");

      return (data ?? []).map((t: any) => ({
        id: t.id,
        name: t.name ?? t.member_name ?? "Anonymous",
        content: t.content ?? "",
        image_url: t.image_url ?? "",
        sort_order: t.sort_order ?? 0,
        quote: t.quote ?? undefined,
        role: t.role ?? undefined,
      }));
    } catch (err: any) {
      handleError(err, "getTestimonials");
      return [];
    }
  },

  /* ---------------- MEMBER PROFILE (Single) ---------------- */
  async getMemberProfile(userId: string): Promise<MemberProfile | null> {
    try {
      const { data, error } = await supabase
        .from("member_profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("❌ getMemberProfile failed:", error.message);
        return null;
      }

      if (!data) {
        console.warn("⚠️ No member profile found for user:", userId);
        return null;
      }

      console.log(
        "🧭 profile status returned:",
        data?.status,
        "role:",
        data?.role
      );

      return {
        ...data,
        status: data.status ?? "pending",
        role: data.role ?? "member",
      } as MemberProfile;
    } catch (err: any) {
      console.error("💥 getMemberProfile exception:", err.message);
      return null;
    }
  },

  /* ---------------- PAGE CONTENT ---------------- */
  async getPageContent(pageName: string): Promise<PageContent[] | null> {
    try {
      const { data, error } = await supabase
        .from("page_content")
        .select("*")
        .eq("page_name", pageName)
        .order("updated_at", { ascending: false });

      if (error) handleError(error, "getPageContent");
      return data ?? null;
    } catch (err: any) {
      handleError(err, "getPageContent");
      return null;
    }
  },

  /* ---------------- SINGLE PAGE SECTION ---------------- */
  async getPageSection(
    pageName: string,
    sectionName: string
  ): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from("page_content")
        .select("content")
        .eq("page_name", pageName)
        .eq("section_name", sectionName)
        .maybeSingle();

      if (error) handleError(error, "getPageSection");
      return data?.content ?? null;
    } catch (err: any) {
      handleError(err, "getPageSection");
      return null;
    }
  },

  /* ---------------- FAQ ITEMS ---------------- */
  async getFAQItems(): Promise<FAQItem[]> {
    const { data, error } = await supabase
      .from("faq_items")
      .select("*")
      .order("sort_order");
    if (error) handleError(error, "getFAQItems");
    return data ?? [];
  },

  /* ---------------- DOCUMENTS ---------------- */
  async getLodgeDocuments(): Promise<LodgeDocument[]> {
    const { data, error } = await supabase
      .from("lodge_documents")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) handleError(error, "getLodgeDocuments");
    return (data ?? []).map((doc: any) => ({
      ...doc,
      file_url: doc.file_url ?? doc.url ?? "",
    }));
  },

  async getMeetingMinutes(): Promise<MeetingMinutes[]> {
    const { data, error } = await supabase
      .from("meeting_minutes")
      .select("*")
      .order("meeting_date", { ascending: false });
    if (error) handleError(error, "getMeetingMinutes");
    return (data ?? []).map((m: any) => ({
      ...m,
      file_url: m.file_url ?? m.document_url ?? "",
    }));
  },

  /* ---------------- SITE SETTINGS ---------------- */
  async getSiteSettings(): Promise<SiteSetting[]> {
    const { data, error } = await supabase.from("site_settings").select("*");
    if (error) handleError(error, "getSiteSettings");
    return data ?? [];
  },

  async updateSiteSetting(key: string, value: string) {
    const { data, error } = await supabase
      .from("site_settings")
      .update({ setting_value: value })
      .eq("setting_key", key)
      .select()
      .single();
    if (error) handleError(error, "updateSiteSetting");
    return data;
  },
};

/* ---------------------------------------------------------
 * 🧩 Helper: Build a public URL for media stored in Supabase
 * --------------------------------------------------------- */
export const getPublicUrl = (path: string | null): string | null => {
  if (!path) return null;
  const { data } = supabase.storage.from("cms-media").getPublicUrl(path);
  return data?.publicUrl || null;
};

// ---------------------------------------------------------
// ✅ Supabase Optimized API – unified export for your app
// ---------------------------------------------------------

/**
 * 📰 Get all published blog posts or news/snippet content.
 * You can pass a category filter such as "blog", "news", or "snippet".
 */
export const getBlogPosts = async (
  category: "blog" | "news" | "snippet" | null = null
) => {
  let query = supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("publish_date", { ascending: false });

  if (category) query = query.eq("category", category);

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

/**
 * 🎉 Get lodge events.
 */
export const getEvents = async () => {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: true });
  if (error) throw error;
  return data;
};

/**
 * 💬 Get testimonials.
 */
export const getTestimonials = async () => {
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
};

/**
 * 📄 Get static page content (About, Join, etc.)
 */
export const getPageContent = async (pageName: string) => {
  const { data, error } = await supabase
    .from("page_content")
    .select("content")
    .eq("page_name", pageName)
    .single();
  if (error) throw error;
  return data?.content ?? "";
};

/**
 * 🧑‍🤝‍🧑 Get lodge members (admin-only table)
 */
export const getMembers = async () => {
  const { data, error } = await supabase
    .from("member_profiles")
    .select("*")
    .order("full_name");
  if (error) throw error;
  return data;
};

/**
 * 📚 Get lodge documents
 */
export const getDocuments = async () => {
  const { data, error } = await supabase
    .from("lodge_documents")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
};

/**
 * 🗓️ Get meeting minutes
 */
export const getMeetingMinutes = async () => {
  const { data, error } = await supabase
    .from("meeting_minutes")
    .select("*")
    .order("meeting_date", { ascending: false });
  if (error) throw error;
  return data;
};

/**
 * ⚙️ Get site-wide settings (for footer, SEO, etc.)
 */
export const getSiteSettings = async () => {
  const { data, error } = await supabase.from("site_settings").select("*");
  if (error) throw error;
  return data;
};
/**
 * 🕯️ Get a single blog post by its slug
 */
export const getBlogPostBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error) throw error;
  return data;
};

// ---------------------------------------------------------
// ✅ Central Export Object
// ---------------------------------------------------------
// Merge these helpers into the existing `optimizedApi` object so callers can
// use either the named exports or the central `optimizedApi` export.
Object.assign(optimizedApi, {
  getPublicUrl,
  getBlogPostBySlug,
  getBlogPosts,
  getEvents,
  getTestimonials,
  getPageContent,
  getMembers,
  // alias for historical callers
  getAllMembers: getMembers,
  getDocuments,
  getMeetingMinutes,
  getSiteSettings,
});
