import type { Handler } from "@netlify/functions";
import { OpenAI } from "openai";
import { createClient } from "@supabase/supabase-js";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const PROMPTS = {
  alt: `
    Generate a single alt text sentence (14-18 words).
    Do NOT say "Image of".
    Describe the subject, mood, setting, colours and key detail.
  `,
  caption: `
    Write a 1-sentence caption suitable for a blog article.
    Must be human-sounding, warm, descriptive, and under 20 words.
  `,
  ocr: `
    Extract ALL text that is visible inside the image.
    Return ONLY the detected words.
  `,
} as const;

type PromptMode = keyof typeof PROMPTS;
const requests = new Map<string, { count: number; resetAt: number }>();
const MAX_REQUESTS_PER_MINUTE = 10;

const json = (statusCode: number, body: Record<string, unknown>) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  },
  body: JSON.stringify(body),
});

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return json(405, { error: "Method not allowed" });
    }

    const authorization = event.headers.authorization;
    if (!authorization?.startsWith("Bearer ")) {
      return json(401, { error: "Authentication required" });
    }

    const supabaseUrl =
      process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
    const supabaseAnonKey =
      process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Supabase authentication environment is unavailable");
      return json(503, { error: "Authentication unavailable" });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authorization } },
      auth: { persistSession: false },
    });
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      return json(401, { error: "Invalid session" });
    }
    const { data: profile } = await supabase
      .from("member_profiles")
      .select("role,status")
      .eq("user_id", userData.user.id)
      .single();
    if (profile?.role !== "admin" || profile?.status !== "active") {
      return json(403, { error: "Administrator access required" });
    }

    const now = Date.now();
    const existing = requests.get(userData.user.id);
    const rate = !existing || existing.resetAt <= now
      ? { count: 0, resetAt: now + 60_000 }
      : existing;
    if (rate.count >= MAX_REQUESTS_PER_MINUTE) {
      return json(429, { error: "Rate limit exceeded" });
    }
    rate.count += 1;
    requests.set(userData.user.id, rate);

    if ((event.body?.length ?? 0) > 20_000) {
      return json(413, { error: "Request too large" });
    }
    const body = JSON.parse(event.body || "{}");
    const { image_url, mode } = body as {
      image_url?: string;
      mode?: string;
    };

    if (!image_url) {
      return json(400, { error: "Missing image_url" });
    }
    const imageUrl = new URL(image_url);
    if (imageUrl.protocol !== "https:") {
      return json(400, { error: "Only HTTPS image URLs are supported" });
    }

    const promptKey: PromptMode =
      mode && (mode as PromptMode) in PROMPTS
        ? (mode as PromptMode)
        : "alt";
    const prompt = PROMPTS[promptKey].trim();

    const result = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: [{ type: "input_text", text: prompt }],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: "Please analyse the attached image and respond accordingly.",
            },
            { type: "input_image", image_url, detail: "auto" },
          ],
        },
      ],
    });

    return json(200, { alt: result.output_text, mode: promptKey });
  } catch (error) {
    console.error("Error generating alt text:", error);
    return json(500, { error: "Failed to generate alt text" });
  }
};
