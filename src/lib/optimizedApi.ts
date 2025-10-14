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
 * Error handling helper
 * ---------------------------------------------------- */
const handleError = (error: any, context: string) => {
  console.error(`❌ ${context}:`, error.message || error);
  throw new Error(`${context} failed: ${error.message || "Unknown error"}`);
};

/* ------------------------------------------------------
 * Unified Optimized API Layer
 * ---------------------------------------------------- */
export const optimizedApi = {
  /* ---------------- BLOG POSTS ---------------- */
  async getBlogPosts(category?: string): Promise<CMSBlogPost[]> {
    try {
      let query = supabase
        .from("blog_posts")
        .select("*")
        .eq("is_published", true)
        .order("publish_date", { ascending: false });

      // only filter if a category is provided
      if (category) query = query.eq("category", category);

      const { data, error } = await query;
      if (error) handleError(error, "getBlogPosts");

      return (data ?? []).map((post: any) => ({
        ...post,
        title: post.title ?? "Untitled Post",
        summary: post.summary ?? "",
        category: post.category ?? "news",
        publish_date: post.publish_date ?? new Date().toISOString(),
        is_published: Boolean(post.is_published),
        is_members_only: Boolean(post.is_members_only),
        slug: post.slug ?? post.id,
      }));
    } catch (err: any) {
      handleError(err, "getBlogPosts");
      return [];
    }
  },

  /* ---------------- EVENTS ---------------- */
  async getEvents(): Promise<Event[]> {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_date");
    if (error) handleError(error, "getEvents");
    return (data ?? []).map((event: any) => ({
      ...event,
      is_members_only: event.is_members_only ?? undefined,
    }));
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
      if (!data) return null;
      return {
        ...data,
        is_members_only: data.is_members_only ?? undefined,
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
      .order("sort_order");
    if (error) handleError(error, "getOfficers");
    return (data ?? []).map((officer: any) => ({
      ...officer,
      name: officer.name ?? officer.full_name ?? "",
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
      contact_email: m.contact_email ?? "",
      contact_phone: m.contact_phone ?? "",
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
