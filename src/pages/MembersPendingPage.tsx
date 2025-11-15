import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { cmsApi } from "../lib/cmsApi";
import LoadingSpinner from "../components/LoadingSpinner";
import { Clock, AlertTriangle, Mail } from "lucide-react";

const MembersPendingPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [pageContent, setPageContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPageContent = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get page content for the members page
        const content = await cmsApi.getPageContent("members");

        // Convert to a key-value map for easier access
        const contentMap: Record<string, string> = {};
        if (Array.isArray(content)) {
          content.forEach((row) => {
            if (row && (row as any).section_name) {
              contentMap[(row as any).section_name] =
                (row as any).content ?? "";
            }
          });
        }

        setPageContent(contentMap);
      } catch (err) {
        console.error("Error loading members page content:", err);
        setError("Failed to load page content");
      } finally {
        setLoading(false);
      }
    };

    loadPageContent();
  }, []);

  // If user is not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user is active, redirect to members area
  if (profile && profile.status === "active") {
    return <Navigate to="/members" replace />;
  }

  // Show different content based on status
  const isInactive = profile?.status === "inactive";
  const isPending = profile?.status === "pending" || !profile?.status;

  // Get content from CMS or use defaults
  const pendingTitle = isInactive
    ? "Account Inactive"
    : pageContent.pending_title || "Your Membership is Pending";

  const pendingText = isInactive
    ? "<p>Your account has been deactivated by an administrator.</p><p>If you believe this is an error, please contact the Lodge Secretary for assistance.</p>"
    : pageContent.pending_text ||
      "<p>Thank you for registering. Your membership is currently pending verification by an administrator.</p><p>Once approved, you will have full access to all member resources. This typically takes 1-2 business days.</p><p>If you have any questions, please contact the Lodge Secretary.</p>";

  return (
    <div className="min-h-screen pb-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
          {loading ? (
            <LoadingSpinner subtle={true} className="py-8" />
          ) : (
            <>
              <div className="text-center mb-8">
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                    isInactive ? "bg-red-100" : "bg-yellow-100"
                  }`}
                >
                  {isInactive ? (
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                  ) : (
                    <Clock className="w-8 h-8 text-yellow-600" />
                  )}
                </div>
                <h1 className="text-3xl font-heading font-bold text-primary-600 mb-4">
                  {pendingTitle}
                </h1>

                {/* Welcome message for new users */}
                {isPending && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-center mb-2">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-lg">✓</span>
                      </div>
                      <h2 className="text-lg font-semibold text-green-800">
                        Welcome to Radlett Lodge!
                      </h2>
                    </div>
                    <p className="text-green-700 text-sm">
                      Your account has been successfully created. We're excited
                      to have you join our Lodge community!
                    </p>
                  </div>
                )}

                <div
                  className="prose max-w-none text-neutral-600"
                  dangerouslySetInnerHTML={{ __html: pendingText }}
                />
              </div>

              <div
                className={`border rounded-lg p-6 mb-8 ${
                  isInactive
                    ? "bg-red-50 border-red-200"
                    : "bg-blue-50 border-blue-200"
                }`}
              >
                <div className="flex items-start">
                  <AlertTriangle
                    className={`w-5 h-5 mr-2 mt-0.5 flex-shrink-0 ${
                      isInactive ? "text-red-500" : "text-blue-500"
                    }`}
                  />
                  <div className="text-sm">
                    <h3
                      className={`font-medium mb-1 ${
                        isInactive ? "text-red-800" : "text-blue-800"
                      }`}
                    >
                      {isInactive ? "Account Status" : "What happens next?"}
                    </h3>
                    <p
                      className={isInactive ? "text-red-700" : "text-blue-700"}
                    >
                      {isInactive
                        ? "Your account access has been restricted. Please contact the Lodge Secretary to resolve this issue."
                        : "An administrator will review your registration and approve your membership. You'll receive an email notification when your account is activated."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-soft p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary-100 mb-4">
                  <Mail className="w-6 h-6 text-secondary-600" />
                </div>
                <h2 className="text-xl font-heading font-semibold text-primary-600 mb-2">
                  Need Assistance?
                </h2>
                <p className="text-neutral-600 mb-6">
                  Our Lodge Secretary is happy to help. Use the contact form and
                  we&rsquo;ll reply as soon as possible.
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 bg-secondary-600 text-white rounded-lg shadow hover:bg-secondary-700 transition-colors"
                >
                  Contact the Secretary
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MembersPendingPage;
