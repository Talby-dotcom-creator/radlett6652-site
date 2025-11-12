// src/pages/NewsPage.tsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Newspaper,
  Calendar,
  X,
  Sparkles,
  ChevronRight,
  BookOpen,
  User,
  Archive,
} from "lucide-react";
import { Link } from "react-router-dom";
import { optimizedApi } from "../lib/optimizedApi";
import type { CMSBlogPost } from "../types";
import LoadingSpinner from "../components/LoadingSpinner";

const NewsPage: React.FC = () => {
  const [articles, setArticles] = useState<CMSBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<CMSBlogPost | null>(
    null
  );
  const [showArchive, setShowArchive] = useState(false);

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        setError(null);
        // Only fetch items in the "news" category
        const data = await optimizedApi.getBlogPosts("news");
        setArticles(data || []);
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
      <main className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950">
        <LoadingSpinner />
      </main>
    );

  if (error)
    return (
      <main className="text-center py-20 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950">
        <p className="text-red-400">{error}</p>
      </main>
    );

  // Split articles: first 6 visible, rest in archive
  const displayedArticles = articles.slice(0, 6);
  const archivedArticles = articles.slice(6);
  const featuredArticle = displayedArticles[0];
  const regularArticles = displayedArticles.slice(1);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950">
      {/* DARK HERO SECTION */}
      <section className="relative min-h-[60vh] overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Glowing orbs */}
          <motion.div
            className="absolute top-20 right-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 py-24 md:py-32">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 backdrop-blur-sm border border-amber-500/20 mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Newspaper className="w-4 h-4 text-amber-400" />
              <span className="text-amber-300 text-sm font-medium">
                Latest Updates
              </span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Lodge{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300">
                News
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-amber-100/80 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Stories, updates, and reflections from Radlett Lodge No. 6652
            </motion.p>
          </motion.div>
        </div>

        {/* Decorative bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent" />
      </section>

      <main className="flex-grow py-16 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          {/* No Articles State */}
          {articles.length === 0 ? (
            <div className="text-center py-20">
              <Newspaper className="w-16 h-16 mx-auto mb-4 text-amber-400/30" />
              <p className="text-amber-100/60 text-lg">
                No news articles available right now. Please check back soon!
              </p>
            </div>
          ) : (
            <>
              {/* FEATURED ARTICLE */}
              {featuredArticle && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="mb-16"
                >
                  <div
                    className="group relative bg-slate-800/50 backdrop-blur-md border border-amber-500/20 rounded-2xl overflow-hidden shadow-2xl hover:shadow-amber-500/20 transition-all duration-500 cursor-pointer"
                    onClick={() => setSelectedArticle(featuredArticle)}
                  >
                    {/* Featured Badge */}
                    <div className="absolute top-6 left-6 z-20">
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/90 backdrop-blur-sm shadow-lg">
                        <Sparkles className="w-4 h-4 text-slate-900" />
                        <span className="text-slate-900 text-sm font-bold">
                          Featured
                        </span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-0">
                      {/* Image */}
                      {featuredArticle.image_url && (
                        <div className="relative w-full h-[400px] md:h-full overflow-hidden bg-slate-900">
                          <img
                            src={featuredArticle.image_url}
                            alt={featuredArticle.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/50 to-transparent" />
                        </div>
                      )}

                      {/* Content */}
                      <div className="p-8 md:p-12 flex flex-col justify-center">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4 group-hover:text-amber-300 transition-colors duration-300">
                          {featuredArticle.title}
                        </h2>

                        {/* Meta */}
                        <div className="flex items-center gap-4 text-amber-200/70 text-sm mb-6">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {featuredArticle.publish_date
                              ? new Date(
                                  featuredArticle.publish_date
                                ).toLocaleDateString("en-GB")
                              : "Recently"}
                          </div>
                          {featuredArticle.author && (
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              {featuredArticle.author}
                            </div>
                          )}
                        </div>

                        <p className="text-amber-100/80 text-lg leading-relaxed mb-6 line-clamp-4">
                          {featuredArticle.summary ||
                            featuredArticle.content
                              ?.replace(/<[^>]*>/g, "")
                              .slice(0, 200) + "..."}
                        </p>

                        <div className="flex items-center gap-2 text-amber-400 font-semibold group-hover:gap-3 transition-all">
                          Read Full Article
                          <ChevronRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>

                    {/* Glow Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-blue-500/5" />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* REGULAR ARTICLES GRID */}
              {regularArticles.length > 0 && (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {regularArticles.map((post, i) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ y: -4 }}
                      className="group bg-slate-800/50 backdrop-blur-md border border-slate-700/50 hover:border-amber-500/40 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 cursor-pointer"
                      onClick={() => setSelectedArticle(post)}
                    >
                      {/* Image */}
                      {post.image_url && (
                        <div className="w-full h-48 overflow-hidden bg-slate-900">
                          <img
                            src={post.image_url}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                      )}

                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-amber-300 transition-colors duration-300 line-clamp-2">
                          {post.title}
                        </h3>

                        <p className="text-amber-100/70 text-sm line-clamp-3 mb-4">
                          {post.summary ||
                            post.content
                              ?.replace(/<[^>]*>/g, "")
                              .slice(0, 120) + "..."}
                        </p>

                        <div className="flex items-center text-xs text-amber-200/60">
                          <Calendar size={14} className="mr-2" />
                          {post.publish_date
                            ? new Date(post.publish_date).toLocaleDateString(
                                "en-GB"
                              )
                            : "Undated"}
                        </div>
                      </div>

                      {/* Hover Glow */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* � Archive Toggle Button */}
              {archivedArticles.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-12 text-center"
                >
                  <button
                    onClick={() => setShowArchive(!showArchive)}
                    className="group inline-flex items-center gap-3 bg-slate-800/50 hover:bg-slate-700/50 backdrop-blur-md border-2 border-amber-500/30 hover:border-amber-500/50 text-amber-300 hover:text-amber-200 font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300"
                  >
                    <Archive className="w-5 h-5" />
                    {showArchive
                      ? "Hide Archive"
                      : `View Archive (${archivedArticles.length} more articles)`}
                    <ChevronRight
                      className={`w-5 h-5 transition-transform duration-300 ${
                        showArchive ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                </motion.div>
              )}

              {/* 🗄️ Archive Section */}
              <AnimatePresence>
                {showArchive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="overflow-hidden mt-8"
                  >
                    {/* Archive Header */}
                    <div className="mb-8 text-center">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-900/30 backdrop-blur-sm border border-amber-500/20 mb-4">
                        <Archive className="w-4 h-4 text-amber-400" />
                        <span className="text-amber-300 text-sm font-medium">
                          Archive
                        </span>
                      </div>
                      <h3 className="text-2xl font-serif font-bold text-white">
                        Older News Articles
                      </h3>
                    </div>

                    {/* Archive Grid */}
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                      {archivedArticles.map((post, i) => (
                        <motion.div
                          key={post.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          whileHover={{ y: -4 }}
                          className="group bg-slate-800/30 backdrop-blur-md border border-slate-700/30 hover:border-amber-500/30 rounded-xl overflow-hidden shadow-lg hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-300 cursor-pointer opacity-80 hover:opacity-100"
                          onClick={() => setSelectedArticle(post)}
                        >
                          {/* Image */}
                          {post.image_url && (
                            <div className="w-full h-40 overflow-hidden bg-slate-900">
                              <img
                                src={post.image_url}
                                alt={post.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                            </div>
                          )}

                          <div className="p-5">
                            <h3 className="text-lg font-semibold text-white/90 mb-2 group-hover:text-amber-300 transition-colors duration-300 line-clamp-2">
                              {post.title}
                            </h3>

                            <div className="flex items-center text-xs text-amber-200/50">
                              <Calendar size={12} className="mr-2" />
                              {post.publish_date
                                ? new Date(
                                    post.publish_date
                                  ).toLocaleDateString("en-GB")
                                : "Undated"}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* �💡 Tip Box */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-16 bg-slate-800/50 backdrop-blur-md border border-amber-500/20 rounded-xl p-8 text-center shadow-lg"
              >
                <div className="flex items-center justify-center gap-3 mb-3">
                  <Sparkles className="w-6 h-6 text-amber-400" />
                  <h3 className="text-xl font-semibold text-amber-300">
                    Reading Tip
                  </h3>
                </div>
                <p className="text-amber-100/80 text-lg">
                  Click any news card to read the full story in a detailed view
                </p>
              </motion.div>

              {/* ✨ Reflections CTA Section */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-10 relative bg-gradient-to-br from-amber-900/30 via-slate-800/50 to-slate-800/50 backdrop-blur-md border border-amber-500/30 rounded-xl p-10 text-center shadow-xl overflow-hidden"
              >
                {/* Decorative glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />

                <div className="relative z-10">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <BookOpen className="w-8 h-8 text-amber-400" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-3">
                    Reflections & Thought-Provoking Words
                  </h3>
                  <p className="text-amber-100/80 text-lg mb-6 max-w-2xl mx-auto">
                    Visit our{" "}
                    <span className="font-semibold text-amber-300">
                      Reflections
                    </span>{" "}
                    page for short, inspiring thoughts and wisdom from the Craft
                  </p>
                  <Link to="/snippets">
                    <button className="group inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-bold px-8 py-3 rounded-lg shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300">
                      Read Reflections
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </main>

      {/* 🔸 Article Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedArticle(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-800 border border-amber-500/30 rounded-2xl max-w-4xl w-full max-h-[90vh] shadow-2xl overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                className="sticky top-4 right-4 float-right bg-slate-700/80 hover:bg-slate-600 rounded-full p-2 z-20 backdrop-blur-sm transition-colors"
                onClick={() => setSelectedArticle(null)}
              >
                <X size={20} className="text-white" />
              </button>

              {/* Modal Image */}
              {selectedArticle.image_url && (
                <div className="w-full bg-slate-900 flex justify-center">
                  <img
                    src={selectedArticle.image_url}
                    alt={selectedArticle.title}
                    className="max-h-[500px] w-full object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-8 md:p-12">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 mb-4">
                  {selectedArticle.title}
                </h2>

                <div className="flex items-center gap-4 text-amber-200/70 text-sm mb-8 pb-6 border-b border-slate-700">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {selectedArticle.publish_date
                      ? new Date(
                          selectedArticle.publish_date
                        ).toLocaleDateString("en-GB")
                      : "Undated"}
                  </div>
                  {selectedArticle.author && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {selectedArticle.author}
                    </div>
                  )}
                </div>

                <div
                  className="prose prose-lg prose-invert max-w-none prose-headings:text-amber-300 prose-p:text-amber-100/80 prose-a:text-amber-400 prose-strong:text-amber-200 prose-img:rounded-lg prose-img:shadow-md"
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
