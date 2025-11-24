import fetch from "node-fetch";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const FUNCTION_PATH = "/functions/v1/send-contact-email";
const SUPABASE_ANON_KEY =
  process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY; // supply via env when testing

async function test() {
  try {
    const response = await fetch(`${SUPABASE_URL}${FUNCTION_PATH}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        name: "Test User",
        email: "test@example.com",
        phone: "07700 900123",
        subject: "Membership Inquiry",
        message: "Hello, I am testing the contact form.",
        interested: true,
      }),
    });

    const data = await response.json();
    console.log("✅ Response:", data);
  } catch (err) {
    console.error("❌ Error running test:", err);
  }
}

test();

