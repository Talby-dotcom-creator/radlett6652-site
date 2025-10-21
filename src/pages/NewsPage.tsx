import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Newspaper, Calendar, X } from "lucide-react";
import { optimizedApi } from "../lib/optimizedApi";
import type { CMSBlogPost } from "../types";
import LoadingSpinner from "../components/LoadingSpinner";
import HeroSection from "../components/HeroSection";

const NewsPage: React.FC = () => {
  const [articles, setArticles] = useState<CMSBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<CMSBlogPost | null>(
    null
  );

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await optimizedApi.getBlogPosts("news");
        setArticles(data);
      } catch (err: any) {
        console.error("❌ Error loading news:", err.message || err);
        setError("Could not load news articles. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    loadNews();
  }, []);

  if (loading)
    return (
      <main className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </main>
    );

  if (error)
    return (
      <main className="text-center py-20">
        <p className="text-red-600">{error}</p>
      </main>
    );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 🟡 Hero Section */}
      <HeroSection
        title="Lodge News"
        subtitle="Stories, updates, and reflections from Radlett Lodge No. 6652"
        backgroundImage="https://neoquuejwgcqueqlcbwj.supabase.co/storage/v1/object/public/cms-media/Radlett%20news%20and%20events_1753695345519_vp0q3d.webp"
        overlayOpacity={0.25}
        verticalPosition="bottom"
      />

      <main className="flex-grow py-16 px-6 md:px-12 lg:px-20 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-heading font-bold text-center mb-8 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-300 bg-clip-text text-transparent"
          >
            <div className="flex justify-center items-center gap-3">
              <Newspaper size={36} className="text-yellow-500" />
              Latest News
            </div>
          </motion.h2>

          {/* Cards Grid */}
          {articles.length === 0 ? (
            <p className="text-center text-neutral-600">
              No news articles available right now. Please check back soon!
            </p>
          ) : (
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 mt-10">
              {articles.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  className="group bg-white border border-neutral-300 hover:border-yellow-400 rounded-2xl overflow-hidden shadow-sm hover:shadow-[0_0_20px_rgba(255,215,0,0.25)] transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedArticle(post)}
                >
                  {/* Image - supports portrait & landscape */}
                  {post.image_url && (
                    <div className="w-full aspect-[16/9] overflow-hidden bg-neutral-100">
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-primary-700 mb-2 group-hover:text-yellow-600 transition-colors duration-300">
                      {post.title}
                    </h3>
                    <p className="text-neutral-700 line-clamp-3 mb-4">
                      {post.summary || post.content?.slice(0, 140) + "..."}
                    </p>
                    <div className="flex items-center text-sm text-neutral-500">
                      <Calendar size={16} className="mr-2" />
                      {post.publish_date
                        ? new Date(post.publish_date).toLocaleDateString(
                            "en-GB"
                          )
                        : "Undated"}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* 🟦 Tip Box */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-16 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 text-center shadow-sm"
          >
            <p className="text-neutral-700 text-lg font-medium">
              💡 Tip: Click any news card to read the full story in a popup
              window.
            </p>
          </motion.div>

          {/* ✨ Call-to-Action: Reflections */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-10 bg-gradient-to-r from-yellow-100 to-yellow-200 border border-yellow-300 rounded-xl p-6 text-center shadow-md hover:shadow-lg transition"
          >
            <h3 className="text-xl font-heading font-bold text-yellow-800 mb-2">
              Reflections & Thought-Provoking Words
            </h3>
            <p className="text-neutral-700 mb-3">
              Visit our <span className="font-semibold">Reflections</span> page
              for short, inspiring thoughts.
            </p>
            <motion.a
              href="/snippets"
              whileHover={{ scale: 1.05 }}
              className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-5 py-2 rounded-lg shadow"
            >
              Read Reflections →
            </motion.a>
          </motion.div>
        </div>
      </main>

      {/* 🔸 Popup Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedArticle(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 bg-black/10 hover:bg-black/20 rounded-full p-2"
                onClick={() => setSelectedArticle(null)}
              >
                <X size={20} />
              </button>

              {/* Modal Image */}
              {selectedArticle.image_url && (
                <div className="w-full bg-neutral-100 flex justify-center">
                  <img
                    src={selectedArticle.image_url}
                    alt={selectedArticle.title}
                    className="max-h-[600px] w-auto object-contain rounded-t-2xl shadow-sm"
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-8">
                <h2 className="text-2xl font-heading font-bold bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-300 bg-clip-text text-transparent mb-4">
                  {selectedArticle.title}
                </h2>
                <p className="text-sm text-neutral-500 mb-6">
                  {selectedArticle.publish_date
                    ? new Date(selectedArticle.publish_date).toLocaleDateString(
                        "en-GB"
                      )
                    : "Undated"}
                </p>
                <div
                  className="prose prose-lg text-neutral-800 prose-img:rounded-lg prose-img:shadow-md"
                  dangerouslySetInnerHTML={{
                    __html:
                      selectedArticle.content ?? selectedArticle.summary ?? "",
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NewsPage;
