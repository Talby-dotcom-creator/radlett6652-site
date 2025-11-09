// src/ProtectedRoute.tsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "member";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  // 🕒 Wait for authentication and profile load
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
        <div className="ml-3 text-neutral-600">
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  // 🚫 No user session
  if (!user) {
    console.warn("🔒 No user session — redirecting to /login");
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // ⚠️ Profile missing or inactive
  if (!profile || profile.status !== "active") {
    console.warn(
      `⚠️ Inactive profile (${profile?.status}) — redirecting to /pending`
    );
    return <Navigate to="/pending" replace />;
  }

  // 🚫 Role mismatch, but admins can access member routes
  if (requiredRole && profile.role !== requiredRole) {
    if (requiredRole === "member" && profile.role === "admin") {
      console.log("👑 Admin override: accessing member route");
    } else {
      console.warn(
        `🚫 Access denied — required: ${requiredRole}, user: ${profile.role}`
      );
      return <Navigate to="/members" replace />;
    }
  }

  // ✅ Access granted
  console.log(`✅ Access granted for ${profile.full_name} (${profile.role})`);

  return (
    <>
      {children}
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
