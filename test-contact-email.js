// Test Contact Form Email Function
// Run with: node test-contact-email.js

const testContactEmail = async () => {
  const testData = {
    name: "Test User",
    email: "test@example.com",
    phone: "01234567890",
    subject: "Test Contact Form Submission",
    message: "This is a test message from the contact form.",
    interested: false,
  };

  console.log("🧪 Testing contact email function...");
  console.log("📤 Sending test data:", testData);

  try {
    const response = await fetch(
      "https://neoquuejwgcqueqlcbwj.supabase.co/functions/v1/send-contact-email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
      }
    );

    console.log("\n📊 Response Status:", response.status, response.statusText);

    const contentType = response.headers.get("content-type");
    let result;

    if (contentType && contentType.includes("application/json")) {
      result = await response.json();
    } else {
      result = await response.text();
    }

    console.log("📥 Response Body:", result);

    if (response.ok) {
      console.log("\n✅ SUCCESS! Email sent successfully.");
      console.log("Check radlettlodge6652@gmail.com for the test email.");
    } else {
      console.log("\n❌ FAILED! Server returned an error.");
      console.log("Check deployment and environment variables.");
    }
  } catch (error) {
    console.error("\n❌ ERROR:", error.message);
    console.log("\nPossible issues:");
    console.log("1. Function not deployed yet");
    console.log("2. CORS issue (shouldn't happen with current setup)");
    console.log("3. Network connectivity problem");
  }
};

testContactEmail();
