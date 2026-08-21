// supabase/functions/send-contact-email/index.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

declare const Deno: {
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
  env: {
    get: (key: string) => string | undefined;
  };
};

// Rate limiting: Track IP addresses and submission times
const submissions = new Map<string, number>();
const ALLOWED_ORIGINS = new Set([
  "https://radlettfreemasons.org.uk",
  "https://www.radlettfreemasons.org.uk",
]);
const MAX_BODY_BYTES = 20_000;

const corsHeaders = (req: Request) => {
  const origin = req.headers.get("origin") ?? "";
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.has(origin)
      ? origin
      : "https://radlettfreemasons.org.uk",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    Vary: "Origin",
  };
};

const escapeHtml = (value: unknown) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      }[character] ?? character)
  );

// Clean up old entries every hour
setInterval(() => {
  const now = Date.now();
  for (const [ip, timestamp] of submissions.entries()) {
    if (now - timestamp > 3600000) {
      // 1 hour
      submissions.delete(ip);
    }
  }
}, 3600000);

Deno.serve(async (req: Request) => {
  // ✅ Handle preflight CORS request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders(req),
    });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders(req), "Content-Type": "application/json" },
      });
    }

    // Get client IP for rate limiting
    const clientIP =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    // Rate limiting: Block if submitted within last 60 seconds
    const now = Date.now();
    const lastSubmission = submissions.get(clientIP);

    if (lastSubmission && now - lastSubmission < 60000) {
      return new Response(
        JSON.stringify({
          error:
            "Too many requests. Please wait 1 minute before submitting again.",
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders(req),
          },
        }
      );
    }
    submissions.set(clientIP, now);

    const rawBody = await req.text();
    if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
      return new Response(JSON.stringify({ error: "Request too large" }), {
        status: 413,
        headers: { ...corsHeaders(req), "Content-Type": "application/json" },
      });
    }

    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders(req),
        },
      });
    }

    const { name, email, phone, subject, message, interested, recaptchaToken } =
      payload;

    if (!name || !email || !subject || !message || !recaptchaToken) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders(req), "Content-Type": "application/json" },
      });
    }
    if (
      String(name).length > 150 ||
      String(email).length > 320 ||
      String(phone ?? "").length > 50 ||
      String(subject).length > 100 ||
      String(message).length > 10_000 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))
    ) {
      return new Response(JSON.stringify({ error: "Invalid field values" }), {
        status: 400,
        headers: { ...corsHeaders(req), "Content-Type": "application/json" },
      });
    }

    // Fail closed: every submission must pass server-side reCAPTCHA verification.
    const recaptchaSecret = Deno.env.get("RECAPTCHA_SECRET_KEY");
    if (!recaptchaSecret) {
      console.error("Contact form security is not configured");
      return new Response(JSON.stringify({ error: "Security verification unavailable" }), {
        status: 503,
        headers: { ...corsHeaders(req), "Content-Type": "application/json" },
      });
    }

    try {
          const recaptchaResponse = await fetch(
            `https://www.google.com/recaptcha/api/siteverify`,
            {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: new URLSearchParams({
                secret: recaptchaSecret,
                response: recaptchaToken,
              }),
            }
          );

          const recaptchaData = (await recaptchaResponse.json()) as {
            success?: boolean;
            score?: number;
            action?: string;
          };
          // Block if score too low (0.5 = likely bot)
          if (
            !recaptchaData.success ||
            (recaptchaData.score ?? 0) < 0.5 ||
            recaptchaData.action !== "contact_form"
          ) {
            return new Response(
              JSON.stringify({
                error: "Security verification failed. Please try again.",
              }),
              {
                status: 403,
                headers: {
                  "Content-Type": "application/json",
                  ...corsHeaders(req),
                },
              }
            );
          }
    } catch {
      console.error("reCAPTCHA verification failed");
      return new Response(JSON.stringify({ error: "Security verification unavailable" }), {
        status: 503,
        headers: { ...corsHeaders(req), "Content-Type": "application/json" },
      });
    }

    // --- Environment variables ---
    const resendKey = Deno.env.get("RESEND_API_KEY") || "";
    if (!resendKey) {
      console.error("Contact email provider is not configured");
      return new Response(JSON.stringify({ error: "Email service unavailable" }), {
        status: 503,
        headers: { ...corsHeaders(req), "Content-Type": "application/json" },
      });
    }
    const sender =
      Deno.env.get("EMAIL_SENDER_ADDRESS") ?? "onboarding@resend.dev";
    const recipient =
      Deno.env.get("EMAIL_RECIPIENT_ADDRESS") ?? "radlettlodge6652@gmail.com";

    // --- Build HTML email ---
    const html = `
      <h2>📩 New Contact Form Submission - Radlett Lodge 6652</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone || "N/A")}</p>
      <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
      <p><strong>Message:</strong><br/>${escapeHtml(message).replace(/\r?\n/g, "<br>")}</p>
      <p><strong>Interested in Membership:</strong> ${
        interested ? "Yes" : "No"
      }</p>
      <hr>
      <p style="color: #666; font-size: 12px;">Reply to: ${escapeHtml(email)}</p>
    `;

    // --- Send with Resend ---
    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: sender,
        to: [recipient],
        subject: `Lodge Contact Form: ${String(subject).replace(/[\r\n]/g, " ").slice(0, 100)}`,
        html,
      }),
    });

    const result = await resp.json();
    if (!resp.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to send email" }),
        {
          status: resp.status,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders(req),
          },
        }
      );
    }

    return new Response(JSON.stringify({ success: true, id: result.id }), {
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders(req),
      },
    });
  } catch (err) {
    console.error("❌ Function error:", err);
    return new Response(JSON.stringify({ error: "Unexpected server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders(req),
      },
    });
  }
});
