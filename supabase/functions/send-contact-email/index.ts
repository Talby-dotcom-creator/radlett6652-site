// @ts-nocheck
// supabase/functions/send-contact-email/index.ts

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Simple in-memory rate limit (per IP, per function instance)
// Resets on redeploy – good enough for anti-spam throttling.
const requestCounts: Record<string, { count: number; timestamp: number }> = {};
const RATE_LIMIT = 5; // max 5 requests
const WINDOW_MS = 60 * 1000; // per 60 seconds

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 🚨 Rate limiting by IP
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const entry = requestCounts[ip] || { count: 0, timestamp: now };

    if (now - entry.timestamp < WINDOW_MS) {
      if (entry.count >= RATE_LIMIT) {
        return new Response(
          JSON.stringify({ error: "Too many requests, slow down." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      entry.count++;
    } else {
      entry.count = 1;
      entry.timestamp = now;
    }
    requestCounts[ip] = entry;

    // Parse request body
    const formData = await req.json();

    const resendKey = Deno.env.get("EMAIL_SERVICE_API_KEY") || "";
    const sender =
      Deno.env.get("EMAIL_SENDER_ADDRESS") || "onboarding@resend.dev";
    const recipient =
      Deno.env.get("EMAIL_RECIPIENT_ADDRESS") || "ptalbot37@gmail.com";

    // Send email via Resend
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Radlett Lodge Website <${sender}>`,
        to: [recipient],
        reply_to: formData.email,
        subject: `Contact Form: ${formData.subject}`,
        text: `
New contact form submission:

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || "Not provided"}

Message:
${formData.message}

${formData.interested ? "✓ Interested in Freemasonry" : ""}
        `.trim(),
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error("Resend API error:", errorText);
      return new Response(
        JSON.stringify({
          error: "Failed to send email",
          details: errorText,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const result = await emailResponse.json();
    return new Response(JSON.stringify({ success: true, id: result.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: String(error),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
