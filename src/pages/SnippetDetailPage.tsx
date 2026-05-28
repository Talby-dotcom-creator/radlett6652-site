import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { optimizedApi } from "../lib/optimizedApi";
import type { CMSBlogPost } from "../types";
import { sanitizeHtml } from "../utils/sanitizeHtml";

const SnippetDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<CMSBlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!id) {
          setArticle(null);
          return;
        }

        const data = await optimizedApi.getSnippets();
        const found = Array.isArray(data)
          ? data.find((snippet) => snippet.id === id)
          : null;
        setArticle(found ?? null);
      } catch (err) {
        console.error("Failed to load snippet:", err);
        setError("Could not load snippet.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) return <LoadingSpinner subtle className="py-10" />;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!article) return <div>Snippet not found.</div>;

  return (
    <div className="container mx-auto px-4 md:px-6 py-10">
      <Link
        to="/snippets"
        className="text-secondary-600 hover:text-secondary-800 mb-4 inline-block"
      >
        Back
      </Link>
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>

      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content ?? "") }}
      />
    </div>
  );
};

export default SnippetDetailPage;
