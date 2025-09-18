// supabase.ts

// Debug check for environment variables
console.log("🔎 DEBUG ENV CHECK");
console.log("VITE_SUPABASE_URL =", import.meta.env.VITE_SUPABASE_URL);
console.log(
  "VITE_SUPABASE_ANON_KEY =",
  import.meta.env.VITE_SUPABASE_ANON_KEY
    ? import.meta.env.VITE_SUPABASE_ANON_KEY.substring(0, 15) + "..."
    : "❌ MISSING"
);

import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase'; // ✅ bring in generated types

// Read environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Extra debug logs
if (supabaseUrl) {
  console.log("✅ SUPABASE URL loaded:", supabaseUrl);
} else {
  console.log("❌ Supabase URL is missing");
}

if (supabaseAnonKey) {
  console.log("✅ Supabase anon key starts with:", supabaseAnonKey.substring(0, 10));
} else {
  console.log("❌ Supabase anon key is missing");
}

// Throw if missing
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("❌ Missing Supabase environment variables. Please check your .env.local file.");
}

// ✅ Create typed Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
