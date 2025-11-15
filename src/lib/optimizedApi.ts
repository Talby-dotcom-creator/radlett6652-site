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
  console.error(`��� ${context}:`, error.message || error);
  throw new Error(`${context} failed: ${error.message || "Unknown error"}`);
};

/**
 * Resolve whether the DB uses the table name `snippets` or `snippet`.
 * This is defensive: some environments or older migrations may have the
 * singular table name. We try the plural first then fall back to singular.
 */
async function resolveSnippetsTable(): Promise<"snippets" | "snippet"> {
  try {
    // cast to any to avoid strict typed .from() overloads at compile-time
    const { error } = await supabase
      .from("snippets" as any)
      .select("id")
      .limit(1);
    if (!error) return "snippets";
  } catch (e) {
    // ignore and try singular
  }

  try {
    const { error } = await supabase
      .from("snippet" as any)
      .select("id")
      .limit(1);
    if (!error) return "snippet";
  } catch (e) {
    // ignore and fall through
  }

  // default to plural (this matches the generated types and most code)
  return "snippets";
}

/* ------------------------------------------------------
 * Unified Optimized API Layer (Cleaned & Consolidated)
 * ---------------------------------------------------- */
export const optimizedApi: any = {
  /* ---------------- RESOURCES ---------------- */
  async createResource(resource: {
    title: string;
    category?: string;
    description?: string;
    file_url: string;
    publish_date?: string;
    content?: string;
  }) {
    try {
      const payload = {
        title: resource.title,
        category: resource.category || "",
        description: resource.description || "",
        file_url: resource.file_url,
        publish_date: resource.publish_date || new Date().toISOString(),
        content: resource.content || "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const { data, error } = await supabase
        .from("member_resources")
        .insert(payload)
        .select()
        .single();
      if (error) handleError(error, "createResource");
      return data;
    } catch (err) {
      handleError(err, "createResource");
      return null;
    }
  },
  /* ---------------- MEMBER RESOURCES (correct) ---------------- */
  async getMemberResources() {
    try {
      const { data, error } = await supabase
        .from("member_resources")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) handleError(error, "getMemberResources");
      return data ?? [];
    } catch (err) {
      handleError(err, "getMemberResources");
      return [];
    }
  },
  /* ---------------- CONNECTION TEST ---------------- */
  async checkConnection() {
    try {
      const { error } = await supabase.from("blog_posts").select("id").limit(1);

      if (error) throw error;
      console.log("ԣ� Supabase connected successfully");
      return true;
    } catch (err) {
      console.error("��� Supabase connection failed:", err);
      return false;
    }
  },

  /* ---------------- BLOG POSTS ---------------- */
  async getBlogPosts(
    category: "blog" | "news" | "snippet" | null = null
  ): Promise<CMSBlogPost[]> {
    try {
      const baseQuery = supabase
        .from("blog_posts")
        // tell TS to stop being clever about columns here
        .select(
          "id, title, content, excerpt, seo_description, created_at, category, is_published, slug, image_url, summary, publish_date, author, subcategory, reading_time_minutes, featured"
        )
        .eq("is_published", true)
        .order("publish_date", { ascending: false });

      const query = category ? baseQuery.eq("category", category) : baseQuery;

      // cast the result of the query to 'any' so TS ignores SelectQueryError
      const { data, error } = (await query) as any;

      if (error) handleError(error, "getBlogPosts");

      return ((data ?? []) as any[]).map((d) => ({
        ...d,
        summary: d.summary ?? d.excerpt ?? "",
        image_url: d.image_url ?? d.featured_image ?? null,
        seo_description: d.seo_description ?? d.summary ?? d.excerpt ?? "",
      })) as CMSBlogPost[];
    } catch (err) {
      handleError(err, "getBlogPosts");
      return [];
    }
  },

  async getBlogPostBySlug(slug: string): Promise<CMSBlogPost | null> {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select(
          `
        id,
        title,
        summary,
        content,
        image_url,
        publish_date,
        author,
        subcategory,
        reading_time_minutes,
        featured,
        is_published,
        slug,
        seo_description
      `
        )
        .eq("slug", slug)
        .maybeSingle();

      if (error) handleError(error, "getBlogPostBySlug");
      if (!data) return null;

      const d: any = data;

      return {
        ...d,
        title: d.title ?? "Untitled Post",
        summary: d.summary ?? "",
        content: d.content ?? "",
        publish_date: d.publish_date ?? d.created_at ?? null,
        image_url: d.image_url ?? null,
        reading_time_minutes: d.reading_time_minutes ?? null,
      } as CMSBlogPost;
    } catch (err) {
      handleError(err, "getBlogPostBySlug");
      return null;
    }
  },

  /* ---------------- SNIPPETS ---------------- */
  async getSnippets(): Promise<CMSBlogPost[]> {
    try {
      const { data, error } = await supabase
        .from("snippets")
        .select("*")
        .order("publish_date", { ascending: false });

      if (error) handleError(error, "getSnippets");

      return (data ?? []).map((snippet: any) => ({
        id: snippet.id,
        title: snippet.title ?? "Untitled Snippet",
        content: snippet.content ?? "",
        summary: snippet.summary ?? "",
        author: snippet.author ?? "",
        publish_date: snippet.publish_date ?? null,
        is_published: snippet.is_active ?? false, // Map is_active to is_published
        image_url: snippet.image_url ?? null,
        created_at: snippet.created_at,
        updated_at: snippet.updated_at,
        category: "snippet",
      }));
    } catch (err) {
      handleError(err, "getSnippets");
      return [];
    }
  },

  async getLatestSnippet() {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("snippets")
      .select("*")
      .eq("is_active", true)
      .lte("publish_date", now) // ensures future snippets don't appear early
      .order("publish_date", { ascending: false })
      .limit(1);

    if (error) {
      console.error("getLatestSnippet error:", error);
      return null;
    }

    return data?.[0] || null;
  },

  async createSnippet(
    snippet: Omit<CMSBlogPost, "id" | "created_at" | "updated_at">
  ) {
    try {
      const insertData: any = {
        title: snippet.title || "Untitled",
        content: snippet.content || "",
        publish_date: snippet.publish_date || new Date().toISOString(),
        is_active: snippet.is_published ?? false,
      };

      // Add optional fields only if they exist in your table and have values
      if ((snippet as any).subtitle)
        insertData.subtitle = (snippet as any).subtitle;
      if (snippet.author) insertData.author = snippet.author;
      // Note: image_url doesn't exist in your snippets table

      console.log("Creating snippet with data:", insertData);

      const { data, error } = await supabase
        .from("snippets")
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error("Supabase error creating snippet:", error);
        handleError(error, "createSnippet");
      }

      console.log("Snippet created successfully:", data);
      return data;
    } catch (err) {
      console.error("Exception creating snippet:", err);
      handleError(err, "createSnippet");
      return null;
    }
  },

  async updateSnippet(id: string, updates: Partial<CMSBlogPost>) {
    try {
      const updateData: any = {};

      // Only include fields that exist in your snippets table
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.content !== undefined) updateData.content = updates.content;
      if ((updates as any).subtitle !== undefined)
        updateData.subtitle = (updates as any).subtitle;
      if (updates.author !== undefined) updateData.author = updates.author;
      if (updates.publish_date !== undefined)
        updateData.publish_date = updates.publish_date;
      // Note: image_url doesn't exist in your snippets table

      // Map is_published to is_active
      if (updates.is_published !== undefined) {
        updateData.is_active = updates.is_published;
      }

      console.log("Updating snippet with data:", updateData);

      const { data, error } = await supabase
        .from("snippets")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Supabase error updating snippet:", error);
        handleError(error, "updateSnippet");
      }

      console.log("Snippet updated successfully:", data);
      return data;
    } catch (err) {
      console.error("Exception updating snippet:", err);
      handleError(err, "updateSnippet");
      return null;
    }
  },

  async deleteSnippet(id: string) {
    try {
      const { error } = await supabase.from("snippets").delete().eq("id", id);
      if (error) handleError(error, "deleteSnippet");
    } catch (err) {
      handleError(err, "deleteSnippet");
    }
  },

  /* ---------------- EVENTS ---------------- */
  async getEvents(): Promise<LodgeEvent[]> {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date");

      if (error) handleError(error, "getEvents");

      return (data ?? []).map((event: any) => ({
        ...event,
        is_members_only: !!event.is_members_only,
        is_past_event: event.is_past_event ?? undefined,
        description: event.description ?? "",
        image_url: event.image_url ?? undefined,
        created_at: event.created_at ?? undefined,
        updated_at: event.updated_at ?? undefined,
      }));
    } catch (err) {
      handleError(err, "getEvents");
      return [];
    }
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
        is_members_only: !!data.is_members_only,
        is_past_event: data.is_past_event ?? undefined,
        description: data.description ?? "",
        image_url: data.image_url ?? undefined,
        created_at: data.created_at ?? undefined,
        updated_at: data.updated_at ?? undefined,
      };
    } catch (err) {
      handleError(err, "getNextUpcomingEvent");
      return null;
    }
  },

  /* ---------------- EVENTS CRUD ---------------- */
  async createEvent(payload: Partial<LodgeEvent>) {
    try {
      const { data, error } = await supabase
        .from("events")
        .insert(payload as any)
        .select()
        .single();

      if (error) handleError(error, "createEvent");
      return data;
    } catch (err) {
      handleError(err, "createEvent");
    }
  },

  async updateEvent(id: string, payload: Partial<LodgeEvent>) {
    try {
      const { data, error } = await supabase
        .from("events")
        .update(payload as any)
        .eq("id", id)
        .select()
        .single();

      if (error) handleError(error, "updateEvent");
      return data;
    } catch (err) {
      handleError(err, "updateEvent");
    }
  },

  async deleteEvent(id: string) {
    try {
      const { error } = await supabase.from("events").delete().eq("id", id);

      if (error) handleError(error, "deleteEvent");
      return true;
    } catch (err) {
      handleError(err, "deleteEvent");
      return false;
    }
  },

  /* ---------------- OFFICERS ---------------- */
  async getOfficers(): Promise<Officer[]> {
    try {
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
    } catch (err) {
      handleError(err, "getOfficers");
      return [];
    }
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
        quote: t.quote ?? undefined,
        role: t.role ?? undefined,
      }));
    } catch (err) {
      handleError(err, "getTestimonials");
      return [];
    }
  },

  /* ---------------- MEMBER PROFILE ---------------- */
  async getMemberProfile(userId: string): Promise<MemberProfile | null> {
    try {
      const { data, error } = await supabase
        .from("member_profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("��� getMemberProfile failed:", error);
        return null;
      }

      return data
        ? {
            ...data,
            // ensure status and role match the narrower app-level unions
            status:
              data.status === "active" ||
              data.status === "pending" ||
              data.status === "inactive"
                ? (data.status as "active" | "pending" | "inactive")
                : "pending",
            role:
              data.role === "admin" ? ("admin" as const) : ("member" as const),
          }
        : null;
    } catch (err) {
      console.error("���� getMemberProfile exception:", err);
      return null;
    }
  },

  async getAllMembers(): Promise<MemberProfile[]> {
    try {
      const { data, error } = await supabase
        .from("member_profiles")
        .select("*")
        .order("full_name", { ascending: true });

      if (error) {
        console.error("��� getAllMembers failed:", error);
        handleError(error, "getAllMembers");
        return [];
      }

      return (data ?? []).map((profile) => ({
        id: profile.id,
        user_id: profile.user_id,
        full_name: profile.full_name,
        contact_email: profile.contact_email ?? null,
        contact_phone: profile.contact_phone ?? null,
        join_date: profile.join_date ?? null,
        position: profile.position ?? null,
        role:
          profile.role === "admin" ? ("admin" as const) : ("member" as const),
        status:
          (profile.status as "active" | "pending" | "inactive" | undefined) ??
          "pending",
        notes: profile.notes ?? null,
        email_verified: profile.email_verified ?? null,
        grand_lodge_rank: profile.grand_lodge_rank ?? null,
        created_at: profile.created_at,
        updated_at: profile.updated_at,
        share_contact_info: profile.share_contact_info ?? null,
        needs_password_reset: profile.needs_password_reset ?? null,
      }));
    } catch (err) {
      console.error("���� getAllMembers exception:", err);
      return [];
    }
  },

  /* ---------------- PAGE CONTENT (CMS version) ---------------- */
  async getPageContent(pageName: string): Promise<PageContent[]> {
    try {
      const { data, error } = await supabase
        .from("page_content")
        .select("*")
        .eq("page_name", pageName)
        .order("updated_at", { ascending: false });

      if (error) handleError(error, "getPageContent");
      return data ?? [];
    } catch (err) {
      handleError(err, "getPageContent");
      return [];
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
    } catch (err) {
      handleError(err, "getPageSection");
      return null;
    }
  },

  /* ---------------- DOCUMENTS ---------------- */
  // Normalise lodge_documents.category into clean, predictable keys
  normalizeDocCategory(category: string | null | undefined): string {
    const raw = (category || "").toLowerCase().trim();

    if (!raw) return "other";

    // Minutes
    if (
      raw === "meeting minutes" ||
      raw === "meeting_minutes" ||
      raw === "minutes"
    ) {
      return "minutes";
    }

    // GPC Minutes
    if (raw === "gpc minutes" || raw === "gpc_minutes") {
      return "gpc_minutes";
    }

    // Grand Lodge
    if (raw === "grand lodge" || raw === "grand_lodge") {
      return "grand_lodge";
    }

    // Provincial
    if (raw === "provincial" || raw === "provincial communications") {
      return "provincial";
    }

    // Summons
    if (raw === "summons" || raw === "summon") {
      return "summons";
    }

    // Lodge of Instruction
    if (raw === "lodge of instruction" || raw === "lodge_instruction") {
      return "lodge_instruction";
    }

    // Bylaws / Byelaws
    if (raw === "bylaws" || raw === "byelaws") {
      return "bylaws";
    }

    // Forms
    if (raw === "forms" || raw === "form") {
      return "forms";
    }

    // Ritual
    if (raw === "ritual") {
      return "ritual";
    }

    // Resources
    if (raw === "resources" || raw === "resource") {
      return "resources";
    }

    // Solomon
    if (raw === "solomon") {
      return "solomon";
    }

    // Fallback: convert spaces/dashes to underscores
    return raw.replace(/[\s-]+/g, "_");
  },

  /* ---------------- LODGE DOCUMENTS ---------------- */
  async getLodgeDocuments(): Promise<LodgeDocument[]> {
    try {
      const { data, error } = await supabase
        .from("lodge_documents")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) handleError(error, "getLodgeDocuments");

      return (data ?? []).map((doc: any) => ({
        ...doc,
        file_url: doc.file_url ?? doc.url ?? "",
        category: this.normalizeDocCategory(doc.category),
      }));
    } catch (err) {
      handleError(err, "getLodgeDocuments");
      return [];
    }
  },

  async getMeetingMinutes(): Promise<MeetingMinutes[]> {
    try {
      const { data, error } = await supabase
        .from("meeting_minutes")
        .select("*")
        .order("meeting_date", { ascending: false });

      if (error) handleError(error, "getMeetingMinutes");

      return (data ?? []).map((m: any) => ({
        ...m,
        file_url: m.file_url ?? m.document_url ?? "",
      }));
    } catch (err) {
      handleError(err, "getMeetingMinutes");
      return [];
    }
  },

  /* ---------------- SITE SETTINGS ---------------- */
  async getSiteSettings(): Promise<SiteSetting[]> {
    try {
      const { data, error } = await supabase.from("site_settings").select("*");

      if (error) handleError(error, "getSiteSettings");
      return data ?? [];
    } catch (err) {
      handleError(err, "getSiteSettings");
      return [];
    }
  },

  async updateSiteSetting(key: string, value: string) {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .update({ setting_value: value })
        .eq("setting_key", key)
        .select()
        .single();

      if (error) handleError(error, "updateSiteSetting");
      return data;
    } catch (err) {
      handleError(err, "updateSiteSetting");
      return null;
    }
  },
};

/* ---------------------------------------------------------
 * Utility: Get Public URL for Supabase Storage Media
 * --------------------------------------------------------- */
export const getPublicUrl = (path: string | null): string | null => {
  if (!path) return null;
  const { data } = supabase.storage.from("cms-media").getPublicUrl(path);
  return data?.publicUrl || null;
};

/* ---------------- RESOURCES (Legacy CMS Support) ---------------- */
export const getResources = async () => {
  try {
    // List all files in the `cms-media` bucket (flat list)
    const { data, error } = await supabase.storage.from("cms-media").list("", {
      limit: 2000,
    });

    if (error) handleError(error, "getResources");

    return (data ?? []).map((item: any) => ({
      name: item.name,
      type: item.name.match(/\.(pdf)$/i) ? "pdf" : "image",
      url: supabase.storage.from("cms-media").getPublicUrl(item.name).data
        .publicUrl,
    }));
  } catch (err) {
    handleError(err, "getResources");
    return [];
  }
};

// Fetch resources from member_resources table
export const getMemberResources = async () => {
  try {
    const { data, error } = await supabase
      .from("member_resources")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) handleError(error, "getMemberResources");
    return data ?? [];
  } catch (err) {
    handleError(err, "getMemberResources");
    return [];
  }
};

export const uploadResource = async (file: File, folder = "") => {
  try {
    const fileName = `${Date.now()}_${file.name}`;
    const fullPath = folder ? `${folder}/${fileName}` : fileName;

    const { error: uploadError } = await supabase.storage
      .from("cms-media")
      .upload(fullPath, file);

    if (uploadError) handleError(uploadError, "uploadResource");

    const { data } = supabase.storage.from("cms-media").getPublicUrl(fullPath);

    return data.publicUrl;
  } catch (err) {
    handleError(err, "uploadResource");
    return null;
  }
};

export const deleteResource = async (path: string) => {
  try {
    const clean = path.replace(/^.*cms-media\//, "");
    const { error } = await supabase.storage.from("cms-media").remove([clean]);

    if (error) handleError(error, "deleteResource");
    return true;
  } catch (err) {
    handleError(err, "deleteResource");
    return false;
  }
};

/* ---------------------------------------------------------
 * Attach helpers to the unified API object
 * --------------------------------------------------------- */
Object.assign(optimizedApi, {
  getPublicUrl,
  getResources,
  uploadResource,
  deleteResource,
});
