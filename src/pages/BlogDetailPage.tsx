// src/pages/BlogDetailPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import optimizedApi from "../lib/optimizedApi";
import type { CMSBlogPost } from "../types";
import LoadingSpinner from "../components/LoadingSpinner";

const BlogDetailPage: React.FC = () => {
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
          const data = await optimizedApi.getBlogPosts(id);
          setArticle(data);
        }
      } catch (err) {
        console.error("❌ Failed to load blog article:", err);
        setError("Could not load this blog post.");
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [id]);

  if (loading) return <LoadingSpinner subtle={true} className="py-10" />;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!article) return <p>Blog post not found.</p>;

  const publishDate = article.publish_date
    ? new Date(article.publish_date).toLocaleDateString("en-GB")
    : "Unknown date";

  return (
    <div className="container mx-auto px-4 md:px-6 py-10">
      {/* Back link */}
      <div className="mb-6">
        <Link
          to="/blog"
          className="inline-flex items-center text-secondary-600 hover:text-secondary-800 font-medium"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Blog
        </Link>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>

      {/* Date */}
      <p className="text-sm text-gray-500 mb-6">
        Published: {publishDate}
        {article.is_members_only && (
          <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-indigo-100 text-indigo-600">
            Members Only
          </span>
        )}
      </p>

      {/* Image */}
      {article.image_url && (
        <div className="mb-6">
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full max-h-[400px] object-cover rounded-lg shadow"
          />
        </div>
      )}

      {/* Content */}
      <div className="prose prose-lg max-w-none">{article.content}</div>
    </div>
  );
};

export default BlogDetailPage;
