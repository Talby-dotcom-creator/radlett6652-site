// supabase/functions/send-contact-email/index.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  interested: boolean;
}

interface ResendResponse {
  id?: string;
  error?: string;
  [key: string]: unknown; // catch-all for other fields Resend might return
}

Deno.serve(async (req: Request): Promise<Response> => {
  try {
    const rawBody = await req.text();
    console.log("📨 Contact form raw body:", rawBody);

    let payload: ContactPayload;
    try {
      payload = JSON.parse(rawBody) as ContactPayload;
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { name, email, phone, subject, message, interested } = payload;

    // --- Environment variables ---
    const resendKey = Deno.env.get("RESEND_API_KEY") || "";
    const sender =
      Deno.env.get("EMAIL_SENDER_ADDRESS") ?? "contact@radlettfreemasons.org.uk";
    const recipient =
      Deno.env.get("EMAIL_RECIPIENT_ADDRESS") ?? "radlettlodge6652@gmail.com";

    // --- Build HTML email ---
    const html = `
      <h2>📩 New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || "N/A"}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong><br/>${message}</p>
      <p><strong>Interested in Membership:</strong> ${interested ? "Yes" : "No"}</p>
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

    const result = (await resp.json()) as ResendResponse;
    console.log("📤 Resend response:", result);

    if (!resp.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to send email", details: result }),
        { status: resp.status, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, id: result.id }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("❌ Function error:", err);
    return new Response(
      JSON.stringify({ error: "Unexpected server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
