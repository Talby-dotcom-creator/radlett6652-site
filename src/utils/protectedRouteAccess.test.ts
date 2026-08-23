import { getProtectedRouteRedirect } from "./protectedRouteAccess";

describe("protected member document access", () => {
  it("redirects signed-out visitors to login", () => {
    expect(getProtectedRouteRedirect(null, null, "member")).toBe("/login");
  });

  it("allows active members and administrators into member routes", () => {
    expect(
      getProtectedRouteRedirect(
        { id: "member-1" },
        { role: "member", status: "active" },
        "member"
      )
    ).toBeNull();
    expect(
      getProtectedRouteRedirect(
        { id: "admin-1" },
        { role: "admin", status: "active" },
        "member"
      )
    ).toBeNull();
  });

  it("redirects unapproved members to the pending page", () => {
    expect(
      getProtectedRouteRedirect(
        { id: "pending-1" },
        { role: "member", status: "pending" },
        "member"
      )
    ).toBe("/pending");
  });
});
