import React, { useEffect, useState } from "react";
import HeroSection from "../components/HeroSection";
import LoadingSpinner from "../components/LoadingSpinner";
import { optimizedApi } from "../lib/optimizedApi";
import { CMSBlogPost } from "../types";

const NewsPage: React.FC = () => {
  const [news, setNews] = useState<CMSBlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const data = await optimizedApi.getPublishedNews();
        setNews(data.filter((n) => n.category === "news"));
      } catch (err) {
        console.error("Error fetching news:", err);
      } finally {
        setLoading(false);
      }
    };
    loadNews();
  }, []);

  return (
    <main>
      <HeroSection
        title="Lodge News"
        subtitle="The latest updates and announcements from Radlett Lodge"
        backgroundImage="/images/news-banner.webp"
      />
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-8">
            Latest News
          </h2>

          {loading ? (
            <LoadingSpinner />
          ) : news.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
                >
                  {post.image_url && (
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                  )}
                  <h3 className="text-xl font-semibold text-primary-700 mb-2">
                    {post.title}
                  </h3>
                  <p
                    className="text-neutral-700 mb-3 line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: post.summary }}
                  />
                  <p className="text-sm text-neutral-500">
                    {new Date(post.publish_date).toLocaleDateString("en-GB")}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-neutral-600">
              No news articles published yet.
            </p>
          )}
        </div>
      </section>
    </main>
  );
};

export default NewsPage;
