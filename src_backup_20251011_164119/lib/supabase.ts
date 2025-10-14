// supabase.ts

import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";
import { getSupabaseEnv } from "./getSupabaseEnv";

const { url, anonKey } = getSupabaseEnv();
const supabase = createClient<Database>(url ?? "", anonKey ?? "");

export { supabase };
