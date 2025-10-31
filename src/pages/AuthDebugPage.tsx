import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { api } from "../lib/api";
import LoadingSpinner from "../components/LoadingSpinner";

const AuthDebugPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const s = await supabase.auth.getSession();
        setSession(s?.data ?? null);

        const userId = s?.data?.session?.user?.id;
        if (!userId) {
          setError("No authenticated user found in session");
          setLoading(false);
          return;
        }

        const p = await api.getMemberProfile(userId);
        setProfile(p);
      } catch (err: any) {
        setError(err?.message ?? String(err));
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen pt-28 flex items-start justify-center">
        <LoadingSpinner />
      </div>
    );

  return (
    <div className="min-h-screen pt-28 p-6 bg-neutral-50">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-xl font-semibold mb-4">Auth Debug</h1>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700">
            <strong>Error:</strong> {error}
          </div>
        )}

        <section className="mb-4">
          <h2 className="font-medium">Session</h2>
          <pre className="mt-2 bg-neutral-800 text-green-300 p-3 rounded max-h-64 overflow-auto">
            {JSON.stringify(session, null, 2)}
          </pre>
        </section>

        <section>
          <h2 className="font-medium">Member Profile (api.getMemberProfile)</h2>
          <pre className="mt-2 bg-neutral-800 text-green-300 p-3 rounded max-h-64 overflow-auto">
            {JSON.stringify(profile, null, 2)}
          </pre>
        </section>
      </div>
    </div>
  );
};

export default AuthDebugPage;
