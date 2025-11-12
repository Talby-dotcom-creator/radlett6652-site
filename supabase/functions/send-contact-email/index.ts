// supabase/functions/send-contact-email/index.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// Rate limiting: Track IP addresses and submission times
const submissions = new Map<string, number>();

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

Deno.serve(async (req) => {
  // ✅ Handle preflight CORS request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*", // you can replace * with your domain for tighter security
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers":
          "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    // Get client IP for rate limiting
    const clientIP =
      req.headers.get("x-forwarded-for") ||
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
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    const rawBody = await req.text();
    console.log("📨 Contact form raw body:", rawBody);

    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    const { name, email, phone, subject, message, interested, recaptchaToken } =
      payload;

    // Verify reCAPTCHA token
    if (recaptchaToken) {
      const recaptchaSecret = Deno.env.get("RECAPTCHA_SECRET_KEY");

      if (recaptchaSecret) {
        try {
          const recaptchaResponse = await fetch(
            `https://www.google.com/recaptcha/api/siteverify`,
            {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: `secret=${recaptchaSecret}&response=${recaptchaToken}`,
            }
          );

          const recaptchaData = await recaptchaResponse.json();
          console.log("🔒 reCAPTCHA verification:", recaptchaData);

          // Block if score too low (0.5 = likely bot)
          if (!recaptchaData.success || recaptchaData.score < 0.5) {
            return new Response(
              JSON.stringify({
                error: "Security verification failed. Please try again.",
              }),
              {
                status: 403,
                headers: {
                  "Content-Type": "application/json",
                  "Access-Control-Allow-Origin": "*",
                },
              }
            );
          }
        } catch (err) {
          console.error("❌ reCAPTCHA verification error:", err);
          // Continue anyway - don't block on reCAPTCHA failure
        }
      }
    }

    // --- Environment variables ---
    const resendKey = Deno.env.get("RESEND_API_KEY") || "";
    const sender =
      Deno.env.get("EMAIL_SENDER_ADDRESS") ?? "onboarding@resend.dev";
    const recipient =
      Deno.env.get("EMAIL_RECIPIENT_ADDRESS") ?? "radlettlodge6652@gmail.com";

    // --- Build HTML email ---
    const html = `
      <h2>📩 New Contact Form Submission - Radlett Lodge 6652</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || "N/A"}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong><br/>${message}</p>
      <p><strong>Interested in Membership:</strong> ${
        interested ? "Yes" : "No"
      }</p>
      <hr>
      <p style="color: #666; font-size: 12px;">Reply to: ${email}</p>
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
        subject: `Lodge Contact Form: ${subject}`,
        html,
      }),
    });

    const result = await resp.json();
    console.log("📤 Resend response:", result);

    if (!resp.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to send email", details: result }),
        {
          status: resp.status,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Update rate limit tracker on successful send
    submissions.set(clientIP, now);

    return new Response(JSON.stringify({ success: true, id: result.id }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    console.error("❌ Function error:", err);
    return new Response(JSON.stringify({ error: "Unexpected server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
});
