// src/pages/PrivacyPage.tsx
import React, { useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import { cmsApi } from "../lib/cmsApi";
import { sanitizeHtml } from "../utils/sanitizeHtml";

const fallbackPrivacyHtml = `
  <h2>Who we are</h2>
  <p>Radlett Lodge No. 6652 ("we", "us") operates this website for members, prospective members, and visitors.</p>

  <h2>What we collect</h2>
  <ul>
    <li>Contact details you submit (name, email, phone, message).</li>
    <li>Membership-related details you provide in join/registration/admin forms.</li>
    <li>Uploaded files or media provided via admin/member tools.</li>
    <li>Technical data: IP address, browser/device info, pages viewed, timestamps, and similar analytics or telemetry.</li>
    <li>Authentication/account data for member/admin access (emails, roles, activity logs).</li>
  </ul>

  <h2>How we use it</h2>
  <ul>
    <li>Responding to enquiries and managing membership applications.</li>
    <li>Administering member and admin areas, events, news, blog/pillars, and resources.</li>
    <li>Operating, securing, and improving the site (logs, analytics, performance).</li>
    <li>Fulfilling legal, governance, and compliance obligations.</li>
  </ul>

  <h2>Legal bases (GDPR)</h2>
  <ul>
    <li>Legitimate interests (running the Lodge, responding to enquiries, site security).</li>
    <li>Contractual necessity (membership administration where applicable).</li>
    <li>Consent (where explicitly requested, e.g., certain cookies or marketing).</li>
    <li>Legal obligation (where required by law or regulators).</li>
  </ul>

  <h2>Sharing and transfers</h2>
  <ul>
    <li>Service providers under contract (e.g., hosting/CDN: Netlify; database/storage/auth: Supabase; analytics/tagging if enabled).</li>
    <li>Provincial or national Masonic bodies where required for governance.</li>
    <li>We do not sell personal data. Data may be processed outside the UK/EU under appropriate safeguards (e.g., SCCs).</li>
  </ul>

  <h2>Retention</h2>
  <p>We keep personal data only as long as necessary for the purposes above and applicable legal or governance requirements, then delete or anonymise it.</p>

  <h2>Your rights</h2>
  <ul>
    <li>Access, rectification, erasure, restriction, objection, and data portability (where applicable).</li>
    <li>You may withdraw consent where processing relies on consent.</li>
  </ul>

  <h2>Security</h2>
  <p>We use role-based access, authentication, HTTPS, and least-privilege access for admin/member areas. Only authorised personnel can access admin data.</p>

  <h2>Cookies & similar technologies</h2>
  <ul>
    <li><strong>Essential cookies:</strong> required for login, session management, security, and form protection.</li>
    <li><strong>Analytics cookies</strong> (if enabled): used to understand site usage; set only with consent where required.</li>
    <li><strong>Preference storage:</strong> may store basic UI choices (e.g., reduced motion).</li>
  </ul>
  <p>You can manage cookies via your browser settings and, where presented, the site's consent prompt. Blocking essential cookies may prevent login or form use.</p>

  <h2>Contact</h2>
  <p>For privacy or cookie questions, or to exercise your rights, contact the Lodge Secretary via the Contact page or at secretary@example.com.</p>

  <h2>Updates</h2>
  <p>We may update this notice; the latest version is posted here and continued use signifies acceptance of any changes.</p>
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
