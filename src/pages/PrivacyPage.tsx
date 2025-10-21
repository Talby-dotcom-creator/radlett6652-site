// src/pages/PrivacyPage.tsx
import React, { useState, useEffect } from "react";
import { cmsApi } from "../lib/cmsApi";
import LoadingSpinner from "../components/LoadingSpinner";

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
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>
    </div>
  );
};

export default PrivacyPage;
