// src/pages/PrivacyPage.tsx
import React, { useState, useEffect } from "react";
import { cmsApi } from "../lib/cmsApi";
import LoadingSpinner from "../components/LoadingSpinner";
import SEOHead from "../components/SEOHead";
import { sanitizeHtml } from "../utils/sanitizeHtml";

const fallbackContent = `
  <p><strong>Last updated: 21 August 2026</strong></p>
  <p>Radlett Lodge No. 6652 respects your privacy. This notice explains how we handle personal information submitted through this website.</p>
  <h2>Information we collect</h2>
  <p>When you contact us, we may collect your name, email address, telephone number, the subject of your enquiry, and the contents of your message. We may also receive limited technical information needed to operate and protect the website.</p>
  <h2>How we use your information</h2>
  <p>We use your information to respond to enquiries, provide information about Freemasonry or Lodge activities, administer membership enquiries, protect the website from misuse, and meet legal obligations.</p>
  <h2>Legal basis</h2>
  <p>We process enquiries because it is in our legitimate interests to communicate with visitors and administer Lodge activities. Where you ask us to take steps connected with membership or an event, processing may also be necessary to respond to that request.</p>
  <h2>Sharing and storage</h2>
  <p>Information is available only to authorised Lodge officers and service providers needed to operate the website and deliver messages. We do not sell personal information. Some service providers may process information outside the United Kingdom using appropriate safeguards.</p>
  <h2>Retention</h2>
  <p>We retain enquiries only for as long as reasonably necessary to respond, maintain appropriate Lodge records, and meet legal or administrative requirements.</p>
  <h2>Your rights</h2>
  <p>You may ask for access to, correction of, or deletion of your personal information, or object to or restrict certain processing. You may also complain to the UK Information Commissioner’s Office.</p>
  <h2>Contact us</h2>
  <p>For privacy questions or requests, please use the website contact form and select “General Enquiry”.</p>
  <p>This notice should be reviewed whenever the website’s forms, analytics, cookies, or service providers change.</p>
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
        const fullContent = data.map((item) => item.content).join("\n").trim();
        setContent(fullContent || fallbackContent);
      } catch (err) {
        console.error("Error loading privacy policy:", err);
        setContent(fallbackContent);
        setError("The latest saved policy could not be loaded. The standard privacy notice is shown below.");
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  return (
    <>
      <SEOHead
        title="Privacy Policy | Radlett Lodge No. 6652"
        description="How Radlett Lodge No. 6652 collects, uses, stores, and protects information submitted through this website."
      />
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
      </div>
      </div>
    </>
  );
};

export default PrivacyPage;
