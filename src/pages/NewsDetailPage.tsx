// src/pages/NewsDetailPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { optimizedApi } from "../lib/optimizedApi"; // ✅ fixed import
import type { CMSBlogPost } from "../types";
import LoadingSpinner from "../components/LoadingSpinner";

const NewsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<CMSBlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticle() {
      try {
        setLoading(true);
        setError(null);

        if (id) {
          // ✅ getBlogPosts returns all posts, so we filter by ID manually
          const data = await optimizedApi.getBlogPosts();
          const found =
            Array.isArray(data) && data.length > 0
              ? data.find((p) => p.id === id)
              : null;
          setArticle(found ?? null);
        }
      } catch (err) {
        console.error("❌ Failed to load news article:", err);
        setError("Could not load this article. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [id]);

  if (loading) return <LoadingSpinner subtle={true} className="py-10" />;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!article) return <p>Article not found.</p>;

  const publishDate = article.publish_date
    ? new Date(article.publish_date).toLocaleDateString("en-GB")
    : article.created_at
    ? new Date(article.created_at).toLocaleDateString("en-GB")
    : "Unknown date";

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      {/* Back link */}
      <div className="mb-6">
        <Link
          to="/news"
          className="inline-flex items-center text-secondary-600 hover:text-secondary-800 font-medium"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to News
        </Link>
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold text-primary-700 mb-4">
        {article.title}
      </h1>

      {/* Date + Members-only badge */}
      <p className="text-sm text-gray-500 mb-6">
        Published: {publishDate}
        {article.is_members_only && (
          <span className="ml-3 px-2 py-0.5 text-xs rounded-full bg-indigo-100 text-indigo-600">
            Members Only
          </span>
        )}
      </p>

      {/* Image */}
      {article.image_url && (
        <div className="mb-8">
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full max-h-[500px] object-cover rounded-lg shadow-md"
          />
        </div>
      )}

      {/* Content */}
      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: article.content ?? "" }}
      />
    </div>
  );
};

export default NewsDetailPage;
