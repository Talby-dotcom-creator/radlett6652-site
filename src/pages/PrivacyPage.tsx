// src/pages/PrivacyPage.tsx
import React, { useState, useEffect } from "react";
import { cmsApi } from "../lib/cmsApi";
import LoadingSpinner from "../components/LoadingSpinner";
import { sanitizeHtml } from "../utils/sanitizeHtml";

const fallbackPrivacyHtml = `
  <h2>Who we are</h2>
  <p>Radlett Lodge No. 6652 (“we”, “us”) operates this website for members, prospective members, and visitors.</p>

  <h2>Personal data we collect</h2>
  <ul>
    <li>Contact details you submit via forms (name, email, phone, message).</li>
    <li>Membership-related details you provide in join/registration forms.</li>
    <li>Website usage data (analytics/telemetry) and technical data (IP, browser).</li>
    <li>Uploaded files/media provided via admin/member tools.</li>
  </ul>

  <h2>How we use your data</h2>
  <ul>
    <li>To respond to enquiries and manage membership applications.</li>
    <li>To administer member and admin areas, events, and content.</li>
    <li>To maintain site security and performance (logs/analytics).</li>
    <li>To meet legal and governance obligations.</li>
  </ul>

  <h2>Legal bases (GDPR)</h2>
  <ul>
    <li>Legitimate interests (running the Lodge, responding to enquiries).</li>
    <li>Contractual necessity (membership administration where applicable).</li>
    <li>Consent (where explicitly requested, e.g., certain cookies/marketing).</li>
    <li>Legal obligation (where required by law or regulators).</li>
  </ul>

  <h2>Sharing and storage</h2>
  <ul>
    <li>We use vetted service providers (e.g., hosting/Supabase/Netlify) under appropriate security terms.</li>
    <li>We do not sell your data. Data may be shared with provincial or national bodies where required for Masonic governance.</li>
  </ul>

  <h2>Retention</h2>
  <p>We keep personal data only as long as needed for the purposes above and applicable governance or legal requirements.</p>

  <h2>Your rights</h2>
  <ul>
    <li>Access, rectification, erasure, restriction, objection, and portability where applicable.</li>
    <li>You may withdraw consent where processing is based on consent.</li>
  </ul>

  <h2>Contact</h2>
  <p>For privacy requests, contact the Lodge Secretary via the contact form or the email published on the Contact page. We will respond in line with GDPR timelines.</p>

  <h2>Cookies/analytics</h2>
  <p>We use analytics (e.g., Google Analytics/Tag Manager) to understand site usage. You can control cookies via your browser settings.</p>
`;

const PrivacyPage: React.FC = () => {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await cmsApi.getPageContent("privacy");
        // Combine all sections into one string, preserving HTML structure
        const fullContent = data.map((item) => item.content).join("\n");
        setContent(fullContent);
      } catch (err) {
        console.error("Error loading privacy policy:", err);
        setError("Failed to load privacy policy content");
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
          Privacy Policy
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
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(fallbackPrivacyHtml) }}
          />
        )}
      </div>
    </div>
  );
};

export default PrivacyPage;
