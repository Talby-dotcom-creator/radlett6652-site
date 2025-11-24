import type { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

type Action = "listUsers" | "invite" | "resetPassword";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
const ANON_KEY =
  process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

// Fail fast if critical env vars are missing
if (!SUPABASE_URL) {
  console.warn("[admin-members] Missing SUPABASE_URL");
}
if (!SERVICE_KEY) {
  console.warn("[admin-members] Missing SUPABASE_SERVICE_ROLE_KEY");
}
if (!ANON_KEY) {
  console.warn("[admin-members] Missing SUPABASE_ANON_KEY");
}

const handler: Handler = async (event) => {
  try {
    if (!SUPABASE_URL || !SERVICE_KEY || !ANON_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error:
            "Server misconfigured: missing Supabase URL, anon key, or service role key.",
        }),
      };
    }

    // Require a bearer token so we can check the caller is an admin
    const authHeader = event.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice("Bearer ".length)
      : null;

    if (!token) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Missing bearer token" }),
      };
    }

    // Use anon client with caller token to verify admin status
    const callerClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: {
        headers: { Authorization: `Bearer ${token}` },
      },
      auth: { persistSession: false },
    });

    const {
      data: { user },
      error: userError,
    } = await callerClient.auth.getUser();

    if (userError || !user) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Invalid session" }),
      };
    }

    // Check the caller is an admin via member_profiles
    const { data: profile, error: profileError } = await callerClient
      .from("member_profiles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();

    if (profileError || profile?.role !== "admin") {
      return {
        statusCode: 403,
        body: JSON.stringify({ error: "Admin access required" }),
      };
    }

    // Service-role client for privileged actions
    const adminClient = createClient(SUPABASE_URL, SERVICE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const body = event.body ? JSON.parse(event.body) : {};
    const action: Action | undefined = body.action;

    if (!action) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing action" }),
      };
    }

    if (action === "listUsers") {
      const { data, error } = await adminClient.auth.admin.listUsers();
      if (error) throw error;
      return { statusCode: 200, body: JSON.stringify({ users: data.users }) };
    }

    if (action === "invite") {
      const email = (body.email as string | undefined)?.trim().toLowerCase();
      const fullName =
        (body.full_name as string | undefined)?.trim() ||
        (body.name as string | undefined)?.trim() ||
        "";

      if (!email) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Email is required" }),
        };
      }

      const redirectTo =
        body.redirectTo ||
        `${event.headers.origin || ""}/login?mode=signin&from=invite`;

      const { data, error } = await adminClient.auth.admin.inviteUserByEmail(
        email,
        { redirectTo }
      );
      if (error) throw error;

      // Upsert an active member profile immediately so invited users skip "pending"
      const userId = data?.user?.id;
      if (userId) {
        const safeName =
          fullName ||
          email.replace(/@.*/, "").replace(/[._-]+/g, " ").trim() ||
          "Member";
        await adminClient
          .from("member_profiles")
          .upsert({
            user_id: userId,
            full_name: safeName,
            role: "member",
            status: "active",
            contact_email: email,
          });
      }

      return { statusCode: 200, body: JSON.stringify({ user: data.user }) };
    }

    if (action === "resetPassword") {
      const email = body.email as string | undefined;
      if (!email) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Email is required" }),
        };
      }
      const redirectTo =
        body.redirectTo ||
        `${event.headers.origin || ""}/reset-password?from=admin`;
      const { data, error } = await adminClient.auth.resetPasswordForEmail(
        email,
        { redirectTo }
      );
      if (error) throw error;
      return { statusCode: 200, body: JSON.stringify({ data }) };
    }

    return {
      statusCode: 400,
      body: JSON.stringify({ error: `Unknown action: ${action}` }),
    };
  } catch (err: any) {
    console.error("[admin-members] error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err?.message || "Unexpected error",
      }),
    };
  }
};

export { handler };
