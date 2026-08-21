// src/pages/TermsPage.tsx
import React, { useState, useEffect } from "react";
import { cmsApi } from "../lib/cmsApi";
import LoadingSpinner from "../components/LoadingSpinner";
import SEOHead from "../components/SEOHead";
import { sanitizeHtml } from "../utils/sanitizeHtml";

const fallbackContent = `
  <p><strong>Last updated: 21 August 2026</strong></p>
  <p>By using this website, you agree to these terms. If you do not agree, please stop using the site.</p>
  <h2>About this website</h2>
  <p>This is the official website of Radlett Lodge No. 6652. It provides general information about the Lodge, Freemasonry, events, news, and membership enquiries. It is not an official publication of the United Grand Lodge of England or the Provincial Grand Lodge of Hertfordshire.</p>
  <h2>Accuracy and availability</h2>
  <p>We aim to keep information accurate and current, but we cannot guarantee that every item is complete or free from error. Event details may change, so please confirm arrangements with the Lodge before travelling or incurring expense. We may change, suspend, or withdraw website content without notice.</p>
  <h2>Acceptable use</h2>
  <p>You must not misuse the website, attempt unauthorised access, interfere with its operation, submit unlawful or abusive material, or use automated systems in a way that places an unreasonable load on the service.</p>
  <h2>Copyright</h2>
  <p>Unless stated otherwise, website text, design, and original media belong to Radlett Lodge No. 6652 or are used with permission. You may view and print material for personal, non-commercial use, but may not republish it without permission.</p>
  <h2>External links</h2>
  <p>Links to external websites are provided for convenience. We are not responsible for their content, availability, or privacy practices.</p>
  <h2>Liability</h2>
  <p>Nothing in these terms excludes liability that cannot lawfully be excluded. To the extent permitted by law, we are not responsible for loss arising solely from reliance on general website information or from temporary unavailability of the site.</p>
  <h2>Contact</h2>
  <p>Questions about these terms can be sent through the website contact form.</p>
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
        const fullContent = data.map((item) => item.content).join("\n").trim();
        setContent(fullContent || fallbackContent);
      } catch (err) {
        console.error("Error loading terms page:", err);
        setContent(fallbackContent);
        setError("The latest saved terms could not be loaded. The standard terms are shown below.");
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  return (
    <>
      <SEOHead
        title="Terms of Use | Radlett Lodge No. 6652"
        description="Terms governing use of the Radlett Lodge No. 6652 website."
      />
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
      </div>
      </div>
    </>
  );
};

export default TermsPage;
