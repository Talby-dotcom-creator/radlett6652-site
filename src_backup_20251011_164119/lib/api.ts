// src/lib/api.ts
import { supabase } from "./supabase";
import { MemberProfile, LodgeDocument, MeetingMinutes } from "../types";
import type { PostgrestResponse } from "@supabase/supabase-js";

/* ------------------------------------------------------
 * Utility helpers
 * ---------------------------------------------------- */
// supabase client is now a singleton imported above

// Properly typed timeout handler that safely accepts any Promise-like value
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
 *  API: Read-only data fetchers
 * ---------------------------------------------------- */

export const api = {
  /* ---------------- Member Profile ---------------- */
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
    // All required fields, defaulting to null for optional ones
    const insertObj = {
      user_id: userId,
      full_name: fullName,
      status: "active",
      join_date: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      needs_password_reset: false,
      role: "member",
      contact_email: null,
      contact_phone: null,
      email_verified: null,
      masonic_rank: null,
      grand_lodge_rank: null,
      provincial_rank: null,
      occupation: null,
      profile_photo_url: null,
    };
    const { data, error } = await supabase
      .from("member_profiles")
      .insert([insertObj])
      .select();
    if (error) throw new Error(error.message);
    return data && data[0]
      ? (data[0] as unknown as MemberProfile)
      : (insertObj as MemberProfile);
  },

  async updateMemberProfile(
    userId: string,
    updates: Partial<MemberProfile>
  ): Promise<MemberProfile> {
    // Ensure join_date is always a string, never null or undefined
    // Omit join_date from payload unless it is a valid string
    const safeUpdates: Partial<MemberProfile> = { ...updates };
    if (
      "join_date" in safeUpdates &&
      typeof safeUpdates.join_date !== "string"
    ) {
      delete safeUpdates.join_date;
    }
    const { data, error } = await supabase
      .from("member_profiles")
      .update(safeUpdates)
      .eq("user_id", userId)
      .select();
    if (error) throw new Error(error.message);
    // Fill missing fields with nulls for type safety
    const fallback: MemberProfile = {
      id: "",
      user_id: userId,
      full_name: safeUpdates.full_name ?? "",
      contact_email: safeUpdates.contact_email ?? null,
      contact_phone: safeUpdates.contact_phone ?? null,
      email_verified: safeUpdates.email_verified ?? null,
      status: safeUpdates.status ?? "active",
      masonic_rank: safeUpdates.masonic_rank ?? null,
      grand_lodge_rank: safeUpdates.grand_lodge_rank ?? null,
      provincial_rank: safeUpdates.provincial_rank ?? null,
      occupation: safeUpdates.occupation ?? null,
      profile_photo_url: safeUpdates.profile_photo_url ?? null,
      join_date:
        typeof safeUpdates.join_date === "string"
          ? safeUpdates.join_date
          : new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      role: safeUpdates.role ?? "member",
      needs_password_reset: safeUpdates.needs_password_reset ?? false,
    };
    return data && data[0] ? (data[0] as unknown as MemberProfile) : fallback;
  },

  async adminCreateMemberProfile(
    profile: Partial<MemberProfile>
  ): Promise<MemberProfile> {
    // Require user_id and full_name for admin creation
    if (!profile.user_id || !profile.full_name) {
      throw new Error("user_id and full_name are required");
    }
    // All required fields, defaulting to null for optional ones
    const insertObj = {
      user_id: profile.user_id,
      full_name: profile.full_name,
      status: profile.status ?? "active",
      join_date:
        typeof profile.join_date === "string"
          ? profile.join_date
          : new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      needs_password_reset: profile.needs_password_reset ?? false,
      role: profile.role ?? "member",
      contact_email: profile.contact_email ?? null,
      contact_phone: profile.contact_phone ?? null,
      email_verified: profile.email_verified ?? null,
      masonic_rank: profile.masonic_rank ?? null,
      grand_lodge_rank: profile.grand_lodge_rank ?? null,
      provincial_rank: profile.provincial_rank ?? null,
      occupation: profile.occupation ?? null,
      profile_photo_url: profile.profile_photo_url ?? null,
    };
    const { data, error } = await supabase
      .from("member_profiles")
      .insert([insertObj])
      .select();
    if (error) throw new Error(error.message);
    return data && data[0]
      ? (data[0] as unknown as MemberProfile)
      : (insertObj as MemberProfile);
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

  /* ---------------- Events ---------------------- */
  async getEvents() {
    const { data, error } = (await withTimeout(
      supabase.from("events").select("*").order("event_date"),
      10000
    )) as PostgrestResponse<any>;

    if (error) throw new Error(error.message);
    return (data ?? []).map((e: any) => ({
      ...e,
      is_members_only: !!e.is_members_only,
    }));
  },

  async getNextUpcomingEvent() {
    const now = new Date().toISOString();
    const { data, error } = (await withTimeout(
      supabase
        .from("events")
        .select("*")
        .gt("event_date", now)
        .order("event_date")
        .limit(1),
      10000
    )) as PostgrestResponse<any>;

    if (error) throw new Error(error.message);
    return data?.[0] ?? null;
  },

  /* ---------------- News / Blog ------------------ */
  async getPublishedNews() {
    const { data, error } = (await withTimeout(
      supabase
        .from("blog_posts")
        .select("*")
        .eq("is_published", true)
        .order("publish_date", { ascending: false }),
      10000
    )) as PostgrestResponse<any>;

    if (error) throw new Error(error.message);
    return (data ?? []).map((post: any) => ({
      ...post,
      is_published: !!post.is_published,
    }));
  },

  /* ---------------- Documents ------------------- */
  async getLodgeDocuments() {
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

  /* ---------------- Meeting Minutes ------------- */
  async getMeetingMinutes() {
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
