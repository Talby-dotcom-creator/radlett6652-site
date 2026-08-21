import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/supabase";
import { getSupabaseEnv } from "./getSupabaseEnv";

// 👇 Attach our Database type definition
const { url, anonKey } = getSupabaseEnv();

export const supabase = createClient<Database>(
  url!,
  anonKey!
);
