// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const RESEND_API_KEY     = Deno.env.get("RESEND_API_KEY") || Deno.env.get("EMAIL_SERVICE_API_KEY");
const FROM_EMAIL         = Deno.env.get("EMAIL_SENDER_ADDRESS") || "contact@radlettfreemasons.org.uk";
const TO_EMAIL           = Deno.env.get("EMAIL_RECIPIENT_ADDRESS") || "radlettlodge6652@gmail.com";

async function sendEmail(subject: string, html: string) {
  if (!RESEND_API_KEY) {
    console.error("Missing RESEND_API_KEY/EMAIL_SERVICE_API_KEY secret");
    return new Response("Missing API key", { status: 500 });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `Radlett Lodge <${FROM_EMAIL}>`,
      to: [TO_EMAIL],
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Resend error:", text);
    return new Response(`Email send failed: ${text}`, { status: 502 });
  }

  return new Response("OK", { status: 200 });
}

serve(async (req) => {
  try {
    const payload = await req.json();

    const user_id      = payload?.user_id ?? "";
    const email        = payload?.contact_email ?? "(no email)"; // ✅ FIXED
    const full_name    = payload?.full_name || "";
    const created      = payload?.created_at || new Date().toISOString();

    const subject = "New member sign-up awaiting approval";
    const html = `
      <div style="font-family:system-ui,Segoe UI,Arial,sans-serif;">
        <h2>New pending member</h2>
        <p><strong>Name:</strong> ${full_name || "—"}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>User ID:</strong> ${user_id}</p>
        <p><strong>Submitted:</strong> ${created}</p>
        <hr/>
        <p>Approve in your admin dashboard by setting <code>status = 'approved'</code>.</p>
      </div>
    `;

    return await sendEmail(subject, html);
  } catch (e) {
    console.error("Function error:", e);
    return new Response("Bad Request", { status: 400 });
  }
});
