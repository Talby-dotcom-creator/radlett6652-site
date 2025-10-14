// src/lib/optimizedApi.ts
import { supabase } from "./supabase";
import {
  CMSBlogPost,
  Event,
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
 * Utility helper
 * ---------------------------------------------------- */
const handleError = (error: any, context: string) => {
  console.error(`❌ ${context}:`, error.message || error);
  throw new Error(`${context} failed: ${error.message || "Unknown error"}`);
};

/* ------------------------------------------------------
 * Optimized API — unified public + admin data layer
 * ---------------------------------------------------- */
export const optimizedApi = {
  /* ---------------- BLOG POSTS ---------------- */
  async getBlogPosts(category?: string): Promise<CMSBlogPost[]> {
    try {
      let query = supabase
        .from("blog_posts")
        .select("*")
        .order("publish_date", { ascending: false });

      if (category) query = query.eq("category", category);

      const { data, error } = await query;
      if (error) handleError(error, "getBlogPosts");

      return (data ?? []).map((post: any) => ({
        ...post,
        summary: post.summary ?? "",
        category: post.category ?? "news",
        publish_date: post.publish_date ?? new Date().toISOString(),
        is_published: !!post.is_published,
        is_members_only: !!post.is_members_only,
      }));
    } catch (err: any) {
      handleError(err, "getBlogPosts");
      return [];
    }
  },

  async getNewsArticles(): Promise<CMSBlogPost[]> {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("category", "news")
        .order("publish_date", { ascending: false });
      if (error) handleError(error, "getNewsArticles");
      return (data ?? []).map((post: any) => ({
        ...post,
        summary: post.summary ?? "",
        category: post.category ?? "news",
        publish_date: post.publish_date ?? new Date().toISOString(),
        is_published: !!post.is_published,
        is_members_only: !!post.is_members_only,
      }));
    } catch (err: any) {
      handleError(err, "getNewsArticles");
      return [];
    }
  },

  async updateBlogPost(id: string, updates: Partial<CMSBlogPost>) {
    const { publish_date, summary, ...rest } = updates;

    const payload = {
      ...rest,
      publish_date:
        typeof publish_date === "string"
          ? publish_date
          : new Date().toISOString(),
      summary: summary ?? "", // ✅ ensure string
    };

    const { data, error } = await supabase
      .from("blog_posts")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) handleError(error, "updateBlogPost");
    return data;
  },

  /* ---------------- EVENTS ---------------- */
  async getEvents(): Promise<Event[]> {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_date");
    if (error) handleError(error, "getEvents");
    return data ?? [];
  },

  async getNextUpcomingEvent(): Promise<Event | null> {
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
      return data ?? null;
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
      .order("sort_order");
    if (error) handleError(error, "getOfficers");
    return data ?? [];
  },

  /* ---------------- TESTIMONIALS ---------------- */
  async getTestimonials(): Promise<Testimonial[]> {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("sort_order");
    if (error) handleError(error, "getTestimonials");
    return data ?? [];
  },

  /* ---------------- LODGE DOCUMENTS ---------------- */
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

  /* ---------------- MEMBER PROFILES ---------------- */
  async getAllMembers(): Promise<MemberProfile[]> {
    const { data, error } = await supabase
      .from("member_profiles")
      .select("*")
      .order("full_name");
    if (error) handleError(error, "getAllMembers");

    return (data ?? []).map((m: any) => ({
      ...m,
      status: m.status ?? "active",
    }));
  },

  /* ---------------- PAGE CONTENT ---------------- */
  async getPageContent(pageName: string): Promise<PageContent | null> {
    const { data, error } = await supabase
      .from("page_content")
      .select("*")
      .eq("page_name", pageName)
      .maybeSingle();
    if (error) handleError(error, "getPageContent");
    return data ?? null;
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

export default optimizedApi;
