// src/pages/NewsPostPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import optimizedApi from "../lib/optimizedApi";
import { CMSBlogPost } from "../types";
import LoadingSpinner from "../components/LoadingSpinner";

const NewsPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<CMSBlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const posts = await optimizedApi.getBlogPosts("news");
        const found = posts.find((p) => p.slug === slug);
        setPost(found ?? null);
      } catch (error) {
        console.error("Error loading news post:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) return <LoadingSpinner />;

  if (!post)
    return (
      <main className="py-20 text-center">
        <h1 className="text-3xl font-heading font-bold text-primary-800 mb-4">
          Article not found
        </h1>
        <Link to="/news" className="text-secondary-600 hover:underline">
          ← Back to News
        </Link>
      </main>
    );

  const formattedDate = post.publish_date
    ? format(new Date(post.publish_date), "dd MMM yyyy")
    : "Date TBA";

  return (
    <main className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link
          to="/news"
          className="text-secondary-600 hover:underline text-sm mb-6 inline-block"
        >
          ← Back to News
        </Link>

        <h1 className="text-4xl font-heading font-bold text-primary-800 mb-2">
          {post.title}
        </h1>

        <p className="text-neutral-500 mb-6">{formattedDate}</p>

        {post.image_url && (
          <img
            src={post.image_url}
            alt={post.title}
            className="rounded-lg mb-6 w-full h-auto"
          />
        )}

        <div
          className="prose prose-lg max-w-none text-neutral-800"
          dangerouslySetInnerHTML={{ __html: post.content ?? post.summary }}
        />
      </div>
    </main>
  );
};

export default NewsPostPage;
