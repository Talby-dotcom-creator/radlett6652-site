import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useAnalytics } from "../hooks/useAnalytics";

const PendingApprovalPage: React.FC = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const { trackEvent, trackUserAction } = useAnalytics();

  useEffect(() => {
    // Wait until auth initialization completes before redirecting.
    // Otherwise the auth context may still be loading on initial page load
    // and cause a false-negative redirect back to /login.
    if (loading) {
      console.log("⌛ PendingApprovalPage: waiting for auth to finish loading");
      return;
    }

    // 🧭 Check user and redirect if not pending
    if (!user) {
      console.log("🔐 No session found — redirecting to login");
      navigate("/login", { replace: true });
      return;
    }

    if (profile && profile.status === "active") {
      console.log("✅ User already approved — redirecting to members area");
      navigate("/members", { replace: true });
      return;
    }

    // Analytics tracking
    trackEvent("page_view", { page: "/pending" });
    trackUserAction("view_pending", "auth", "pending_page");
    console.log("📊 Telemetry: PendingApprovalPage viewed");
  }, [user, profile, navigate, trackEvent, trackUserAction]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-6">
      <div className="max-w-2xl bg-white p-8 rounded-lg shadow">
        {/* Banner */}
        <div className="mb-6 p-4 rounded-md bg-yellow-50 border border-yellow-200">
          <h2 className="text-lg font-semibold text-yellow-800">
            Your account is pending approval
          </h2>
          <p className="text-sm text-yellow-700 mt-2">
            Next steps: the Lodge Secretary will review your application. If
            additional information is required, you will receive an email.
          </p>
        </div>

        <h1 className="text-2xl font-heading font-bold text-primary-700 mb-4">
          Membership Pending
        </h1>
        <p className="text-neutral-700 mb-4">
          Thank you for creating an account. Your membership is currently
          pending approval by the Lodge Secretary. You will be notified by email
          once your membership has been approved.
        </p>
        <p className="text-neutral-600 mb-6">
          If you have questions, please contact the lodge administrator or email{" "}
          <a
            href="mailto:admin@radlettlodge6652.org.uk"
            className="text-primary-600 underline"
          >
            radlettlodge6652@gmail.com
          </a>
          .
        </p>

        <div className="flex gap-3 justify-center">
          <Link
            to="/"
            className="inline-block bg-primary-700 text-white px-4 py-2 rounded-lg hover:bg-primary-800"
          >
            Return to Home
          </Link>
          <Link
            to="/contact"
            className="inline-block border border-primary-700 text-primary-700 px-4 py-2 rounded-lg hover:bg-primary-50"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PendingApprovalPage;
