// src/pages/TermsPage.tsx
import React, { useState, useEffect } from "react";
import { cmsApi } from "../lib/cmsApi";
import LoadingSpinner from "../components/LoadingSpinner";
import { sanitizeHtml } from "../utils/sanitizeHtml";

const fallbackTermsHtml = `
  <h2>Use of the site</h2>
  <p>This site is provided by Radlett Lodge No. 6652 for information, member access, and administration. By using the site you agree to use it lawfully and respectfully.</p>

  <h2>Content and accuracy</h2>
  <p>We aim to keep information accurate but do not provide guarantees. Event, news, and other content may change without notice.</p>

  <h2>Accounts and access</h2>
  <p>Member/admin areas are for authorised users only. Keep credentials secure and notify us of any unauthorised access.</p>

  <h2>Data protection</h2>
  <p>Your use of the site is also governed by our Privacy Policy, which explains how we collect, use, and protect personal data (including enquiries and membership administration).</p>

  <h2>Intellectual property</h2>
  <p>Site content is owned by the Lodge or respective authors. Do not reproduce without permission.</p>

  <h2>Liability</h2>
  <p>We are not liable for losses arising from use of this site except where required by law.</p>

  <h2>Third-party services</h2>
  <p>We use trusted third-party services (hosting/analytics/auth). Their terms may apply where you interact with them (e.g., Google Analytics/Tag Manager).</p>

  <h2>Changes</h2>
  <p>We may update these terms and the Privacy Policy; continued use indicates acceptance of any changes.</p>

  <h2>Contact</h2>
  <p>For questions about these terms or privacy, contact the Lodge Secretary via the contact page.</p>
`;

const TermsPage: React.FC = () => {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await cmsApi.getPageContent("terms");
        const fullContent = data.map((item) => item.content).join("\n");
        setContent(fullContent);
      } catch (err) {
        console.error("Error loading terms page:", err);
        setError("Failed to load terms content");
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  return (
    <div className="min-h-screen pt-28 pb-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-primary-600 mb-8">
          Terms & Conditions
        </h1>

        {loading && (
          <div className="flex justify-center py-10">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {error && <p className="text-red-600 text-center">{error}</p>}

        {content && (
          <div
            className="prose max-w-none text-neutral-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
          />
        )}

        {!content && !loading && !error && (
          <div
            className="prose max-w-none text-neutral-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(fallbackTermsHtml) }}
          />
        )}
      </div>
    </div>
  );
};

export default TermsPage;
