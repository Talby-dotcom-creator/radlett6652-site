/* Quick Node runner for Supabase connection tests
   This script executes the same checks as src/lib/connectionTest.ts but from Node.
   It requires the VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to be available as env vars.
*/

const { createClient } = require("@supabase/supabase-js");

const url = process.env.VITE_SUPABASE_URL;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;

(async () => {
  if (!url || !anonKey) {
    console.error(
      "Missing env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY"
    );
    process.exit(2);
  }

  const supabase = createClient(url, anonKey);

  try {
    console.log("Running basic count query against member_profiles...");
    const start = Date.now();
    const { data, error, status } = await supabase
      .from("member_profiles")
      .select("count", { count: "exact", head: true });
    const dur = Date.now() - start;
    console.log("Duration:", dur, "ms");
    if (error) {
      console.error("Error:", error);
      process.exit(1);
    }
    console.log("Count query result (head):", data);

    console.log("Testing auth.getUser");
    const authRes = await supabase.auth.getUser();
    console.log("Auth result:", authRes);

    console.log("Testing sample select of member_profiles");
    const res2 = await supabase
      .from("member_profiles")
      .select("id, full_name")
      .limit(5);
    console.log("Sample profiles:", res2);

    console.log("All tests executed successfully");
    process.exit(0);
  } catch (err) {
    console.error("Unexpected error:", err);
    process.exit(1);
  }
})();
