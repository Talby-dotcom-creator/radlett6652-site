import React, { useState, useEffect, useMemo } from "react";
import ErrorBoundary from "../components/ErrorBoundary";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { optimizedApi as api } from "../lib/optimizedApi";
import LoadingSpinner from "../components/LoadingSpinner";
import Button from "../components/Button";

const MembersPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    user,
    profile: userProfile,
    loading: authLoading,
    needsPasswordReset,
    signOut,
  } = useAuth();

  // Debug: Print auth state every render
  console.log("MembersPage: rendering");
  console.log(
    "[DEBUG] Render: authLoading:",
    authLoading,
    "user:",
    user,
    "userProfile:",
    userProfile
  );

  const [dataLoading, setDataLoading] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [debugStage, setDebugStage] = useState("⏳ Initializing...");
  const [documents, setDocuments] = useState<any[]>([]);

  // 🔍 Stage 1 - Mount
  useEffect(() => {
    console.log("✅ MembersPage mounted");
    setDebugStage("✅ Component mounted, waiting for Auth...");
  }, []);

  // 🔍 Stage 2 - Auth Checks
  useEffect(() => {
    console.log(
      "[DEBUG] Auth Check: authLoading:",
      authLoading,
      "user:",
      user,
      "userProfile:",
      userProfile,
      "needsPasswordReset:",
      needsPasswordReset
    );
    if (authLoading) {
      setDebugStage("🔄 Auth still loading...");
      return;
    }

    if (!user) {
      setDebugStage("🚫 No user found — redirecting to login");
      console.warn("Redirecting to /login");
      // Commented out temporarily for testing
      // navigate("/login", { replace: true });
      return;
    }

    if (userProfile?.status === "pending") {
      setDebugStage("⏳ Profile pending — would redirect");
      // navigate("/members/pending", { replace: true });
      return;
    }

    if (userProfile?.status === "inactive") {
      setDebugStage("🚫 Profile inactive — would redirect");
      // navigate("/members/pending", { replace: true });
      return;
    }

    if (needsPasswordReset) {
      setDebugStage("🔑 Password reset required — would redirect");
      // navigate("/password-reset", { replace: true });
      return;
    }

    setDebugStage("✅ Auth complete — ready to fetch data");
  }, [user, userProfile, authLoading, needsPasswordReset, navigate]);

  // 🔍 Stage 3 - Data Load
  useEffect(() => {
    const loadData = async () => {
      if (!user || authLoading) return;
      setDebugStage("📦 Fetching documents from Supabase...");
      console.log("🚀 Starting Supabase data load...");

      try {
        const docs = await api.getLodgeDocuments();
        console.log("✅ Documents fetched:", docs);
        setDocuments(docs || []);
        setDebugStage("✅ Data loaded successfully");
      } catch (err: any) {
        console.error("❌ Error loading data:", err);
        setConnectionError(err.message || "Unknown error");
        setDebugStage("❌ Data load failed");
      } finally {
        setDataLoading(false);
      }
    };

    loadData();
  }, [user, authLoading]);

  // 🔍 Stage 4 - Render logic
  console.log("🎨 Rendering MembersPage", {
    user,
    authLoading,
    dataLoading,
    connectionError,
    documents,
  });

  return (
    <main className="min-h-screen bg-neutral-50 py-20 text-center">
      <h1 className="text-3xl font-heading font-bold mb-6 text-primary-700">
        Members Area Debug Mode
      </h1>

      <p className="text-lg text-neutral-600 mb-10">{debugStage}</p>

      {authLoading && (
        <>
          <LoadingSpinner subtle />
          <p className="text-neutral-500 mt-4">Waiting for authentication...</p>
        </>
      )}

      {!authLoading && !user && (
        <p className="text-red-600 font-medium">
          🚫 No user session detected — check AuthContext
        </p>
      )}

      {connectionError && (
        <div className="max-w-lg mx-auto bg-red-50 border border-red-200 p-4 rounded-lg mt-6">
          <p className="text-red-700">⚠️ {connectionError}</p>
        </div>
      )}

      {!dataLoading && documents.length > 0 && (
        <div className="max-w-3xl mx-auto text-left mt-10 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-primary-700">
            📚 Sample Data Loaded
          </h2>
          <ul className="space-y-2">
            {documents.slice(0, 5).map((doc) => (
              <li key={doc.id} className="border-b border-neutral-200 pb-2">
                <strong>{doc.title}</strong>{" "}
                <span className="text-sm text-neutral-500">
                  ({doc.category})
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!dataLoading && documents.length === 0 && !connectionError && (
        <p className="text-neutral-500 mt-10">
          📭 No documents retrieved from Supabase (check table or RLS)
        </p>
      )}

      <div className="mt-10">
        <Button variant="outline" onClick={() => signOut()}>
          Sign Out
        </Button>

        {/* Fallback message if nothing else is displayed */}
        {!authLoading &&
          !user &&
          !connectionError &&
          documents.length === 0 && (
            <p className="text-red-600 font-bold mt-10">
              Nothing to display. Check authentication and data loading.
            </p>
          )}
      </div>
    </main>
  );
};

export default function MembersPageWithBoundary(props: any) {
  return (
    <ErrorBoundary>
      <MembersPage {...props} />
    </ErrorBoundary>
  );
}
