// src/pages/PillarPostDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { optimizedApi } from "../lib/optimizedApi";
import LoadingSpinner from "../components/LoadingSpinner";

import type { CMSBlogPost } from "../types";

const PillarPostDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<CMSBlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await optimizedApi.getBlogPostBySlug(slug || "");
        setPost(data);
      } catch (err: any) {
        console.error("❌ Error loading post:", err.message || err);
        setError("This article could not be found.");
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [slug]);

  if (loading)
    return (
      <main className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </main>
    );

  if (error || !post)
    return (
      <main className="text-center py-20">
        <p className="text-red-600">{error || "Article not found."}</p>
        <Link
          to="/pillars"
          className="inline-flex items-center gap-2 mt-4 text-amber-700 hover:text-amber-900 font-medium"
        >
          <ArrowLeft size={18} /> Back to The Pillars
        </Link>
      </main>
    );

  return (
    <article className="bg-stone-50 min-h-screen">
      {/* 🟡 Hero Image */}
      {post.featured_image_url && (
        <div className="relative w-full h-[50vh] overflow-hidden">
          <img
            src={post.featured_image_url}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-3">
              {post.title}
            </h1>
            <div className="flex justify-center items-center gap-6 text-sm text-stone-200">
              {post.publish_date && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.publish_date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              )}
              {post.reading_time_minutes && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {post.reading_time_minutes} min read
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 🕯️ Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto py-16 px-6 md:px-10 bg-white mt-[-4rem] relative z-10 rounded-2xl shadow-xl"
      >
        {post.author_name && (
          <p className="text-stone-500 italic mb-6 text-center">
            by {post.author_name}
          </p>
        )}

        <div
          className="prose prose-lg prose-stone max-w-none
                     prose-headings:font-serif
                     prose-h2:text-amber-700 prose-h3:text-stone-800
                     prose-a:text-amber-700 hover:prose-a:text-amber-800
                     prose-blockquote:border-amber-600
                     prose-blockquote:text-stone-700
                     leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: post.content ?? post.summary ?? "",
          }}
        />

        {/* Back link */}
        <div className="mt-12 text-center">
          <Link
            to="/pillars"
            className="inline-flex items-center gap-2 text-amber-700 font-medium hover:text-amber-900 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to The Pillars
          </Link>
        </div>
      </motion.div>
    </article>
  );
};

export default PillarPostDetail;
