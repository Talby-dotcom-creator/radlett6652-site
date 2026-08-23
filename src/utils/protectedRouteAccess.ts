import type { MemberProfile } from "../types";

type ProtectedRole = "admin" | "member";
type ProtectedRouteRedirect = "/login" | "/pending" | "/members" | null;

export const getProtectedRouteRedirect = (
  user: { id: string } | null,
  profile: Pick<MemberProfile, "role" | "status"> | null,
  requiredRole?: ProtectedRole
): ProtectedRouteRedirect => {
  if (!user) return "/login";
  if (!profile || profile.status !== "active") return "/pending";

  if (
    requiredRole &&
    profile.role !== requiredRole &&
    !(requiredRole === "member" && profile.role === "admin")
  ) {
    return "/members";
  }

  return null;
};
