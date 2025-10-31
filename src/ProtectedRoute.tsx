// src/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, profile, loading } = useAuth();

  // 🕒 Show spinner only while loading initial auth/profile
  if (loading) {
    console.log("⏳ Waiting for auth to finish loading...");
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
        <div className="ml-3 text-neutral-600">
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  // 🚫 No user session -> login
  if (!user) {
    console.warn("🔒 No user session, redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  // ⚠️ Logged in but no profile or not active -> pending
  if (!profile || profile.status !== "active") {
    console.warn(
      `🚫 Profile pending/inactive (${profile?.status}) — redirecting to /pending`
    );
    return <Navigate to="/pending" replace />;
  }

  // ✅ Authenticated & active
  console.log(`✅ Access granted for ${profile.full_name} (${profile.role})`);

  return (
    <>
      {children}

      {/* 🧩 DEV MODE DEBUG BANNER */}
      {import.meta.env.DEV && (
        <div className="fixed bottom-0 left-0 right-0 bg-neutral-900 text-neutral-100 text-sm py-2 px-4 opacity-80">
          <div className="flex justify-between items-center">
            <span>
              🧠 <strong>Debug:</strong> {profile.full_name} ({profile.role})
            </span>
            <span>
              Status:{" "}
              <strong
                className={
                  profile.status === "active"
                    ? "text-green-400"
                    : profile.status === "pending"
                    ? "text-yellow-400"
                    : "text-red-400"
                }
              >
                {profile.status}
              </strong>
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default ProtectedRoute;
