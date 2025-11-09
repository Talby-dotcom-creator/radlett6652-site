// src/pages/SnippetDetailPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { optimizedApi } from "../lib/optimizedApi"; // ✅ fixed import
import type { CMSBlogPost } from "../types";
import LoadingSpinner from "../components/LoadingSpinner";
import SnippetsManager from "../components/admin/SnippetsManager";

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
        if (!id) return;

        // ✅ getBlogPosts fetches all posts — so we filter locally
        const data = await optimizedApi.getBlogPosts();
        const found =
          Array.isArray(data) && data.length > 0
            ? data.find((p) => p.id === id)
            : null;
        setArticle(found ?? null);
      } catch (err) {
        console.error("❌ Failed to load snippet:", err);
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
        ← Back
      </Link>
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>

      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: article.content ?? "" }}
      />
    </div>
  );
};

export default SnippetDetailPage;
