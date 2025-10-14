import React, { useEffect, useState } from "react";
import HeroSection from "../components/HeroSection";
import LoadingSpinner from "../components/LoadingSpinner";
import { optimizedApi } from "../lib/optimizedApi";
import { CMSBlogPost } from "../types";

const BlogPage: React.FC = () => {
  const [blogs, setBlogs] = useState<CMSBlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const data = await optimizedApi.getPublishedNews();
        setBlogs(data.filter((b) => b.category === "blog"));
      } catch (err) {
        console.error("Error fetching blog posts:", err);
      } finally {
        setLoading(false);
      }
    };
    loadBlogs();
  }, []);

  return (
    <main>
      <HeroSection
        title="Insights & Reflections"
        subtitle="Thoughts and perspectives from the brethren of Radlett Lodge"
        backgroundImage="/images/blog-banner.webp"
      />
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-8">
            Masonic Insights
          </h2>

          {loading ? (
            <LoadingSpinner />
          ) : blogs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((post) => (
                <div
                  key={post.id}
                  className="bg-neutral-50 rounded-lg shadow-md p-6 hover:shadow-lg transition"
                >
                  <h3 className="text-xl font-semibold text-primary-700 mb-2">
                    {post.title}
                  </h3>
                  <p
                    className="text-neutral-700 mb-3 line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: post.summary }}
                  />
                  <p className="text-sm text-neutral-500">
                    By {post.author || "Anonymous"} ·{" "}
                    {new Date(post.publish_date).toLocaleDateString("en-GB")}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-neutral-600">
              No blog posts available at this time.
            </p>
          )}
        </div>
      </section>
    </main>
  );
};

export default BlogPage;
