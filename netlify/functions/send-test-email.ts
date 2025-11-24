import type { Handler } from "@netlify/functions";

/**
 * Lightweight test email sender using Resend.
 * POST JSON: { to?: string, subject?: string, text?: string }
 * Falls back to EMAIL_RECIPIENT_ADDRESS / EMAIL_SENDER_ADDRESS env vars.
 */
export const handler: Handler = async (event) => {
  try {
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_SENDER_ADDRESS;
    const fallbackTo = process.env.EMAIL_RECIPIENT_ADDRESS;

    if (!RESEND_API_KEY || !from) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error:
            "Missing RESEND_API_KEY or EMAIL_SENDER_ADDRESS in environment",
        }),
      };
    }

    const body = event.body ? JSON.parse(event.body) : {};
    const to = (body.to as string | undefined) || fallbackTo;
    const subject =
      (body.subject as string | undefined) || "Test email from Netlify function";
    const text =
      (body.text as string | undefined) ||
      "Hello from the send-test-email Netlify function.";

    if (!to) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Missing recipient. Provide `to` or set EMAIL_RECIPIENT_ADDRESS",
        }),
      };
    }

    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, text }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return {
        statusCode: resp.status,
        body: JSON.stringify({ error: "Resend API error", details: errText }),
      };
    }

    const data = await resp.json();
    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, data }),
    };
  } catch (error: any) {
    console.error("send-test-email error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Unexpected error",
        details: error?.message || String(error),
      }),
    };
  }
};
