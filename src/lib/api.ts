// src/lib/api.ts
import { supabase } from "./supabase";
import {
  MemberProfile,
  LodgeDocument,
  MeetingMinutes,
  CMSBlogPost,
  Event,
} from "../types";
import type { PostgrestResponse } from "@supabase/supabase-js";

/* ------------------------------------------------------
 * Utility helpers
 * ---------------------------------------------------- */
const withTimeout = async <T>(
  task: Promise<T> | { then?: unknown },
  timeoutMs: number = 15000
): Promise<T> => {
  const promise: Promise<T> =
    typeof (task as any).then === "function"
      ? (task as Promise<T>)
      : Promise.resolve(task as T);

  return (await Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error(`Request timeout after ${timeoutMs}ms`)),
        timeoutMs
      )
    ),
  ])) as T;
};

const checkConnection = async (): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("member_profiles")
      .select("id")
      .limit(1);
    if (error) {
      console.warn("⚠️ Supabase connection failed:", error.message);
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

/* ------------------------------------------------------
 * Main API — Safe Supabase access layer
 * ---------------------------------------------------- */
export const api = {
  /* ---------------- Member Profiles ---------------- */
  async getMemberProfile(userId: string): Promise<MemberProfile | null> {
    if (!(await checkConnection())) throw new Error("Database unavailable");

    const { data, error } = (await withTimeout(
      supabase
        .from("member_profiles")
        .select("*")
        .eq("user_id", userId)
        .limit(1),
      10000
    )) as PostgrestResponse<MemberProfile>;

    if (error) throw new Error(error.message);
    if (!data || !data.length) return null;
    return { ...data[0], status: data[0].status ?? "active" };
  },

  async createMemberProfile(
    userId: string,
    fullName: string
  ): Promise<MemberProfile> {
    const insertObj: Omit<MemberProfile, "id"> = {
      user_id: userId,
      full_name: fullName,
      status: "active",
      join_date: new Date().toISOString() || undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      role: "member" as "member" | "admin",
      contact_email: null,
      contact_phone: null,
      email_verified: null,
    };

    // Ensure join_date is string or undefined, never null
    const safeInsertObj = {
      ...insertObj,
      join_date:
        typeof insertObj.join_date === "string"
          ? insertObj.join_date
          : undefined,
      role: insertObj.role === "admin" ? "admin" : "member",
    };
    const { data, error } = await supabase
      .from("member_profiles")
      .insert([safeInsertObj])
      .select();
    if (error) throw new Error(error.message);
    return (
      data?.[0] ?? {
        id: "",
        user_id: userId,
        full_name: fullName,
        contact_email: null,
        contact_phone: null,
        address: null,
        join_date:
          typeof insertObj.join_date === "string"
            ? insertObj.join_date
            : undefined,
        position: null,
        role: "member",
        status: "active",
        notes: null,
        email_verified: null,
        grand_lodge_rank: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    );
  },

  async updateMemberProfile(
    userId: string,
    updates: Partial<MemberProfile>
  ): Promise<MemberProfile> {
    // Prepare updates, ensuring join_date is never null and role is correct
    const updateObj: Partial<MemberProfile> = { ...updates };
    // Remove join_date if not a string or is null
    if (
      typeof updateObj.join_date !== "string" ||
      updateObj.join_date === null
    ) {
      delete updateObj.join_date;
    }
    // Ensure role is only 'member' or 'admin'
    if (updateObj.role !== "member" && updateObj.role !== "admin") {
      updateObj.role = "member";
    }
    const { data, error } = await supabase
      .from("member_profiles")
      .update(updateObj)
      .eq("user_id", userId)
      .select();
    if (error) throw new Error(error.message);

    return (
      data?.[0] ?? {
        id: "",
        user_id: userId,
        full_name:
          typeof updateObj.full_name === "string" ? updateObj.full_name : "",
        contact_email:
          typeof updateObj.contact_email === "string"
            ? updateObj.contact_email
            : null,
        contact_phone:
          typeof updateObj.contact_phone === "string"
            ? updateObj.contact_phone
            : null,
        address:
          typeof updateObj.address === "string" ? updateObj.address : null,
        join_date:
          typeof updateObj.join_date === "string"
            ? updateObj.join_date
            : undefined,
        position:
          typeof updateObj.position === "string" ? updateObj.position : null,
        role: updateObj.role === "admin" ? "admin" : "member",
        status:
          updateObj.status === "pending" || updateObj.status === "inactive"
            ? updateObj.status
            : "active",
        notes: typeof updateObj.notes === "string" ? updateObj.notes : null,
        email_verified:
          typeof updateObj.email_verified === "boolean"
            ? updateObj.email_verified
            : null,
        grand_lodge_rank:
          typeof updateObj.grand_lodge_rank === "string"
            ? updateObj.grand_lodge_rank
            : null,
        created_at:
          typeof updateObj.created_at === "string"
            ? updateObj.created_at
            : new Date().toISOString(),
        updated_at:
          typeof updateObj.updated_at === "string"
            ? updateObj.updated_at
            : new Date().toISOString(),
      }
    );
  },

  /* ---------------- Site Settings ---------------- */
  async getSiteSettings(): Promise<Record<string, string>> {
    const { data, error } = (await withTimeout(
      supabase.from("site_settings").select("setting_key, setting_value"),
      10000
    )) as PostgrestResponse<{ setting_key: string; setting_value: string }>;
    if (error) throw new Error(error.message);
    const map: Record<string, string> = {};
    (data ?? []).forEach((row) => {
      map[row.setting_key] = row.setting_value;
    });
    return map;
  },

  /* ---------------- Testimonials ---------------- */
  async getTestimonials() {
    const { data, error } = (await withTimeout(
      supabase
        .from("testimonials")
        .select("*")
        .eq("is_published", true)
        .order("sort_order"),
      10000
    )) as PostgrestResponse<any>;

    if (error) throw new Error(error.message);
    return (data ?? []).map((t: any) => ({
      ...t,
      is_published: !!t.is_published,
    }));
  },

  /* ---------------- Events ---------------- */
  async getEvents(): Promise<Event[]> {
    const { data, error } = (await withTimeout(
      supabase.from("events").select("*").order("event_date"),
      10000
    )) as PostgrestResponse<Event>;

    if (error) throw new Error(error.message);
    return data ?? [];
  },

  async getNextUpcomingEvent(): Promise<Event | null> {
    const now = new Date().toISOString();
    const { data, error } = (await withTimeout(
      supabase
        .from("events")
        .select("*")
        .gt("event_date", now)
        .order("event_date")
        .limit(1),
      10000
    )) as PostgrestResponse<Event>;

    if (error) throw new Error(error.message);
    return data?.[0] ?? null;
  },

  /* ---------------- Blog / News ---------------- */
  async getBlogPosts(category?: string): Promise<CMSBlogPost[]> {
    const { data, error } = (await withTimeout(
      supabase
        .from("blog_posts")
        .select("*")
        .eq("is_published", true)
        .order("publish_date", { ascending: false }),
      10000
    )) as PostgrestResponse<CMSBlogPost>;

    if (error) throw new Error(error.message);

    const filtered = category
      ? data?.filter((p: any) => p.category === category)
      : data;

    return filtered ?? [];
  },

  /* ---------------- Documents ---------------- */
  async getLodgeDocuments(): Promise<LodgeDocument[]> {
    const { data, error } = (await withTimeout(
      supabase
        .from("lodge_documents")
        .select("*")
        .order("created_at", { ascending: false }),
      10000
    )) as PostgrestResponse<LodgeDocument>;

    if (error) throw new Error(error.message);
    return data ?? [];
  },

  /* ---------------- Meeting Minutes ---------------- */
  async getMeetingMinutes(): Promise<MeetingMinutes[]> {
    const { data, error } = (await withTimeout(
      supabase
        .from("meeting_minutes")
        .select("*")
        .order("meeting_date", { ascending: false }),
      10000
    )) as PostgrestResponse<MeetingMinutes>;

    if (error) throw new Error(error.message);
    return data ?? [];
  },
};

export default api;
