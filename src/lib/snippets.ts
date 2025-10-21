// src/lib/snippets.ts
import { supabase } from "./supabase";
import type { CMSBlogPost } from "../types";

export async function fetchLatestSnippet(): Promise<CMSBlogPost | null> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("category", "snippet") // IMPORTANT: singular "snippet"
    .eq("is_published", true)
    .order("publish_date", { ascending: false })
    .limit(1);

  if (error) {
    console.error("fetchLatestSnippet error:", error.message);
    return null;
  }
  if (!data || !data.length) return null;
  const row = data[0] as any;
  return {
    ...row,
    slug: row.slug ?? row.id,
  } as CMSBlogPost;
}
