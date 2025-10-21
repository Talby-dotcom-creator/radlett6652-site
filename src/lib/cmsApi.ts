// src/lib/cmsApi.ts
import { supabase } from "./supabase";
import {
  LodgeDocument,
  MeetingMinutes,
  Testimonial,
  LodgeEvent,
  Officer,
  FAQItem,
  SiteSetting,
  PageContent,
  CMSBlogPost,
} from "../types";

/* ------------------------------------------------------
 * Utility helpers
 * ---------------------------------------------------- */
const handleError = (error: any, context: string) => {
  console.error(`❌ ${context}:`, error.message || error);
  throw new Error(`${context} failed: ${error.message || "Unknown error"}`);
};

/* ------------------------------------------------------
 * CMS API — Full CRUD for CMS admin panel
 * ---------------------------------------------------- */
export const cmsApi = {
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
        summary: post.summary ?? "", // ✅ always return a string
        category: post.category ?? "news",
        publish_date: post.publish_date ?? new Date().toISOString(),
        is_published:
          typeof post.is_published === "boolean"
            ? post.is_published
            : String(post.is_published).toLowerCase() === "true",
        is_members_only:
          typeof post.is_members_only === "boolean"
            ? post.is_members_only
            : String(post.is_members_only).toLowerCase() === "true",
      }));
    } catch (err: any) {
      handleError(err, "getBlogPosts");
      return [];
    }
  },

  async createBlogPost(
    post: Omit<CMSBlogPost, "id" | "created_at" | "updated_at">
  ) {
    if (!post.content || !post.title || !post.category) {
      throw new Error("Missing required blog post fields");
    }
    const payload = {
      ...post,
      publish_date: post.publish_date ?? new Date().toISOString(),
    };
    const { data, error } = await supabase
      .from("blog_posts")
      .insert(payload as any)
      .select()
      .single();
    if (error) handleError(error, "createBlogPost");
    return data;
  },

  async updateBlogPost(id: string, updates: Partial<CMSBlogPost>) {
    const { publish_date, ...rest } = updates;
    const payload =
      typeof publish_date === "string"
        ? { ...rest, publish_date }
        : { ...rest };
    const { data, error } = await supabase
      .from("blog_posts")
      .update(payload as any)
      .eq("id", id)
      .select()
      .single();
    if (error) handleError(error, "updateBlogPost");
    return data;
  },

  async deleteBlogPost(id: string) {
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) handleError(error, "deleteBlogPost");
  },

  /* ---------------- EVENTS ---------------- */
  async getEvents(): Promise<LodgeEvent[]> {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_date");
    if (error) handleError(error, "getEvents");
    return (data ?? []).map((row: any) => ({
      id: row.id,
      title: row.title,
      description: row.description ?? "",
      event_date: row.event_date,
      location: row.location ?? "",
      image_url: row.image_url ?? null,
      created_at: row.created_at ?? null,
      updated_at: row.updated_at ?? null,
      is_members_only:
        typeof row.is_members_only === "boolean"
          ? row.is_members_only
          : Boolean(row.is_members_only),
    }));
  },

  async createEvent(event: Omit<LodgeEvent, "id" | "created_at">) {
    if (!event.title || !event.description || !event.event_date) {
      throw new Error("Missing required event fields");
    }
    const { data, error } = await supabase
      .from("events")
      .insert(event as any)
      .select()
      .single();
    if (error) handleError(error, "createEvent");
    return data;
  },

  async updateEvent(id: string, updates: Partial<LodgeEvent>) {
    const { data, error } = await supabase
      .from("events")
      .update(updates as any)
      .eq("id", id)
      .select()
      .single();
    if (error) handleError(error, "updateEvent");
    return data;
  },

  async deleteEvent(id: string) {
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) handleError(error, "deleteEvent");
  },

  /* ---------------- OFFICERS ---------------- */
  async getOfficers(): Promise<Officer[]> {
    const { data, error } = await supabase
      .from("officers")
      .select("*")
      .order("sort_order");
    if (error) handleError(error, "getOfficers");
    return (data ?? []).map((row: any) => ({
      id: row.id,
      position: row.position,
      name: row.name ?? row.full_name ?? "",
      image_url: row.image_url ?? null,
      sort_order: row.sort_order ?? null,
    }));
  },

  /* ---------------- TESTIMONIALS ---------------- */
  async getTestimonials(): Promise<Testimonial[]> {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("sort_order");
    if (error) handleError(error, "getTestimonials");
    return (data ?? []).map((row: any) => ({
      id: row.id,
      name: row.name ?? row.member_name ?? "",
      content: row.content ?? "",
      image_url: row.image_url ?? null,
      sort_order: row.sort_order ?? null,
      quote: row.quote ?? undefined,
      role: row.role ?? undefined,
      is_published:
        typeof row.is_published === "boolean"
          ? row.is_published
          : String(row.is_published).toLowerCase() === "true",
      created_at: row.created_at ?? null,
      updated_at: row.updated_at ?? null,
    }));
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

  /* ---------------- PAGE CONTENT ---------------- */
  async getPageContent(pageName: string): Promise<PageContent[]> {
    const { data, error } = await supabase
      .from("page_content")
      .select("*")
      .eq("page_name", pageName)
      .order("section_name", { ascending: true });
    if (error) handleError(error, "getPageContent");
    return data ?? [];
  },

  async updatePageContent(id: string, updates: Partial<PageContent>) {
    const { data, error } = await supabase
      .from("page_content")
      .update(updates as any)
      .eq("id", id)
      .select()
      .single();
    if (error) handleError(error, "updatePageContent");
    return data;
  },

  async getPageSummaries(): Promise<
    {
      page_name: string;
      section_count: number;
      sections: string[];
    }[]
  > {
    try {
      const { data, error } = await supabase
        .from("page_content")
        .select("page_name, section_name")
        .order("page_name", { ascending: true });
      if (error) handleError(error, "getPageSummaries");

      const grouped: Record<string, string[]> = {};
      (data ?? []).forEach((row: any) => {
        const page = row.page_name || "";
        grouped[page] = grouped[page] || [];
        if (row.section_name && !grouped[page].includes(row.section_name)) {
          grouped[page].push(row.section_name);
        }
      });

      return Object.keys(grouped).map((page) => ({
        page_name: page,
        section_count: grouped[page].length,
        sections: grouped[page],
      }));
    } catch (err: any) {
      handleError(err, "getPageSummaries");
      return [];
    }
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

/* ------------------------------------------------------
 * Compatibility shim — maps old imports to optimizedApi
 * ---------------------------------------------------- */
export const optimizedApi = cmsApi;
export default cmsApi;
