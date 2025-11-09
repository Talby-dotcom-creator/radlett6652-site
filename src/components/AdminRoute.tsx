import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface AdminRouteProps {
  children?: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, profile, loading } = useAuth();

  // While checking session, show loading state
  if (loading) {
    return <p>Loading...</p>;
  }

  // If no user logged in → send to login
  if (!user) {
    console.warn("🚫 AdminRoute: No user logged in");
    return <Navigate to="/login" replace />;
  }

  // If not an active admin → send back to members dashboard
  if (profile?.role !== "admin" || profile?.status !== "active") {
    console.warn("🚫 AdminRoute: User not an active admin");
    return <Navigate to="/members" replace />;
  }

  // Otherwise, render the protected content
  return <>{children}</>;
};

export default AdminRoute;
