// src/ProtectedRoute.tsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import LoadingSpinner from "./LoadingSpinner";
import { getProtectedRouteRedirect } from "./utils/protectedRouteAccess";

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

  const redirectTo = getProtectedRouteRedirect(user, profile, requiredRole);

  // 🚫 No user session
  if (redirectTo === "/login") {
    if (import.meta.env.DEV) console.warn("No user session; redirecting to login");
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // ⚠️ Profile missing or inactive
  if (redirectTo === "/pending") {
    if (import.meta.env.DEV) console.warn("Inactive profile; redirecting to pending");
    return <Navigate to="/pending" replace />;
  }

  // 🚫 Role mismatch
  if (redirectTo === "/members") {
    if (import.meta.env.DEV) console.warn("Role check denied route access");
    return <Navigate to="/members" replace />;
  }

  // ✅ Access granted
  if (import.meta.env.DEV) console.log("Protected route access granted");
  const activeProfile = profile as NonNullable<typeof profile>;

  return (
    <>
      {children}
      {import.meta.env.DEV && (
        <div className="fixed bottom-0 left-0 right-0 bg-neutral-900 text-neutral-100 text-sm py-2 px-4 opacity-80">
          <div className="flex justify-between items-center">
            <span>
              🧠 <strong>Debug:</strong> {activeProfile.full_name} ({activeProfile.role})
            </span>
            <span>
              Status:{" "}
              <strong
                className={
                  activeProfile.status === "active"
                    ? "text-green-400"
                    : activeProfile.status === "pending"
                    ? "text-yellow-400"
                    : "text-red-400"
                }
              >
                {activeProfile.status}
              </strong>
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default ProtectedRoute;
