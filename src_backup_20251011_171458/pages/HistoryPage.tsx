import React, { useEffect, useState } from "react";
import { optimizedApi } from "../lib/optimizedApi";
import LoadingSpinner from "../components/LoadingSpinner";

const HistoryPage: React.FC = () => {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const pageData = await optimizedApi.getPageContent("our-history");
        setContent(pageData);
      } catch (err: any) {
        console.error("Error loading History page:", err);
        setError("Could not load page content. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error)
    return <div className="text-center text-red-600 py-20">{error}</div>;

  return (
    <main className="container mx-auto px-4 md:px-8 py-16">
      <h1 className="text-3xl md:text-4xl font-heading font-bold text-neutral-900 mb-8 text-center">
        Our History
      </h1>

      {content ? (
        <article
          className="prose lg:prose-lg mx-auto text-neutral-800 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : (
        <p className="text-center text-neutral-600">No content available.</p>
      )}
    </main>
  );
};

export default HistoryPage;
