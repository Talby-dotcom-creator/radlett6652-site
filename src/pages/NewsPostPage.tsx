// src/pages/NewsPostPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, ArrowLeft } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import HeroSection from "../components/HeroSection";
import { CMSBlogPost } from "../types";
import { optimizedApi } from "../lib/optimizedApi"; // ✅ must have braces

const NewsPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<CMSBlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await optimizedApi.getBlogPosts("news");
        const found = data.find((p: CMSBlogPost) => p.slug === slug); // ✅ typed p
        if (!found) throw new Error("Post not found");
        setPost(found);
      } catch (err: any) {
        console.error("Error loading post:", err.message || err);
        setError("This article could not be found.");
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  if (loading) return <LoadingSpinner />;
  if (error || !post)
    return (
      <main className="py-20 text-center">
        <p className="text-lg text-neutral-600">{error}</p>
        <Link
          to="/news"
          className="mt-4 inline-block text-secondary-600 hover:text-secondary-800"
        >
          ← Back to News
        </Link>
      </main>
    );

  return (
    <main>
      <HeroSection
        title={post.title}
        subtitle="Lodge News"
        backgroundImage={post.image_url || "/images/news-banner.webp"}
      />

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-8 max-w-3xl">
          {/* Back link */}
          <Link
            to="/news"
            className="flex items-center text-secondary-600 hover:text-secondary-800 mb-6"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to News
          </Link>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-primary-800 mb-4">
            {post.title}
          </h1>

          {/* Date */}
          <p className="text-sm text-neutral-500 flex items-center gap-2 mb-6">
            <span className="text-secondary-500">🗓️</span>
            {post.publish_date
              ? new Date(post.publish_date).toLocaleDateString("en-GB")
              : "Date TBA"}
          </p>

          {/* Image */}
          {post.image_url && (
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full rounded-lg shadow-md mb-8"
            />
          )}

          {/* Content */}
          <article
            className="prose prose-lg max-w-none text-neutral-800"
            dangerouslySetInnerHTML={{
              __html: post.content ?? post.summary ?? "",
            }}
          />
        </div>
      </section>
    </main>
  );
};

export default NewsPostPage;
