import fetch from "node-fetch";

const SUPABASE_URL = "https://neoquuejwgcqueqlcbwj.supabase.co";
const FUNCTION_PATH = "/functions/v1/send-contact-email";
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_O-ctKvniQHQpoCrmQqQ4iA_eeAYLszt"; // replace if needed

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

