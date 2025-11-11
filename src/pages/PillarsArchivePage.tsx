import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabase";
import {
  Calendar,
  Clock,
  ArrowRight,
  Columns3,
  Search,
  Archive,
  Filter,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import SEOHead from "../components/SEOHead";

interface BlogPost {
  id: string;
  title?: string | null;
  summary?: string | null;
  excerpt?: string | null;
  image_url?: string | null;
  publish_date?: string | null;
  reading_time_minutes?: number | null;
  author?: string | null;
  subcategory?: string | null;
  category?: string | null;
  is_published?: boolean | null;
  slug?: string | null;
}

export default function PillarsArchivePage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [searchQuery, selectedCategory, selectedYear, posts]);

  async function fetchPosts() {
    setLoading(true);
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("category", "blog")
      .eq("is_published", true)
      .order("publish_date", { ascending: false });

    if (error) console.error("Error fetching blog posts:", error);
    if (data) {
      setPosts(data as BlogPost[]);
    }
    setLoading(false);
  }

  function filterPosts() {
    let filtered = [...posts];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title?.toLowerCase().includes(query) ||
          p.summary?.toLowerCase().includes(query) ||
          p.subcategory?.toLowerCase().includes(query)
      );
    }

    // Filter by subcategory
    if (selectedCategory) {
      filtered = filtered.filter((p) => p.subcategory === selectedCategory);
    }

    // Filter by year
    if (selectedYear) {
      filtered = filtered.filter((p) => {
        if (!p.publish_date) return false;
        const year = new Date(p.publish_date).getFullYear().toString();
        return year === selectedYear;
      });
    }

    setFilteredPosts(filtered);
  }

  const subcategories = Array.from(
    new Set(posts.map((p) => p.subcategory).filter(Boolean))
  ) as string[];

  const years = Array.from(
    new Set(
      posts
        .map((p) => {
          if (!p.publish_date) return null;
          return new Date(p.publish_date).getFullYear().toString();
        })
        .filter(Boolean)
    )
  ).sort((a, b) => Number(b) - Number(a)) as string[];

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatMonthYear = (dateString?: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-GB", {
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="relative"
        >
          <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full"></div>
          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-amber-400" />
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="Pillars Archive – Radlett Lodge No. 6652"
        description="Browse the complete archive of articles, insights, and reflections from Radlett Lodge No. 6652."
      />

      {/* Premium Dark Background */}
      <div className="relative min-h-screen overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900" />

        {/* Faded Columns/Pillars Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <Columns3 className="w-[600px] h-[600px] text-amber-400" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* Premium Header */}
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                {/* Back Button */}
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => navigate("/pillars")}
                  whileHover={{ x: -5 }}
                  className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-medium mb-6"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to Pillars
                </motion.button>

                {/* Archive Icon + Title */}
                <div className="inline-flex items-center gap-4 mb-4">
                  <motion.div
                    animate={{ rotateY: [0, 360] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Archive className="w-12 h-12 text-amber-400" />
                  </motion.div>
                  <h1 className="text-6xl md:text-7xl font-serif font-bold text-white">
                    Archive
                  </h1>
                </div>

                <p className="text-amber-100/70 text-xl max-w-2xl mx-auto leading-relaxed">
                  Explore our complete collection of wisdom and insights
                </p>

                {/* Decorative Line */}
                <div className="flex items-center justify-center gap-4 mt-6">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1 }}
                    className="h-px w-32 bg-gradient-to-r from-transparent to-amber-500"
                  />
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1 }}
                    className="h-px w-32 bg-gradient-to-l from-transparent to-amber-500"
                  />
                </div>
              </motion.div>
            </div>

            {/* Search and Filters Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="max-w-5xl mx-auto mb-12 space-y-8"
            >
              {/* Premium Search Bar */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                <div className="relative flex items-center">
                  <Search className="absolute left-6 w-5 h-5 text-amber-400" />
                  <input
                    type="text"
                    placeholder="Search by title, category, or content..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-white/10 backdrop-blur-md border border-amber-500/30 rounded-full 
                    text-white placeholder-amber-200/50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent 
                    transition-all shadow-xl"
                  />
                </div>
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap justify-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(null)}
                  className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                    selectedCategory === null
                      ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 shadow-lg shadow-amber-500/50"
                      : "bg-white/10 text-amber-100 hover:bg-white/20 border border-amber-500/30 backdrop-blur-sm"
                  }`}
                >
                  All Categories
                </motion.button>
                {subcategories.map((sub) => (
                  <motion.button
                    key={sub}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(sub)}
                    className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                      selectedCategory === sub
                        ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 shadow-lg shadow-amber-500/50"
                        : "bg-white/10 text-amber-100 hover:bg-white/20 border border-amber-500/30 backdrop-blur-sm"
                    }`}
                  >
                    {sub}
                  </motion.button>
                ))}
              </div>

              {/* Year Filters */}
              {years.length > 1 && (
                <div className="flex flex-wrap justify-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedYear(null)}
                    className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                      selectedYear === null
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50"
                        : "bg-white/10 text-amber-100 hover:bg-white/20 border border-amber-500/30 backdrop-blur-sm"
                    }`}
                  >
                    All Years
                  </motion.button>
                  {years.map((year) => (
                    <motion.button
                      key={year}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedYear(year)}
                      className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                        selectedYear === year
                          ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50"
                          : "bg-white/10 text-amber-100 hover:bg-white/20 border border-amber-500/30 backdrop-blur-sm"
                      }`}
                    >
                      {year}
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Results Count */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="max-w-5xl mx-auto mb-8"
            >
              <div className="flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-sm border border-amber-500/20 rounded-full w-fit mx-auto">
                <Filter className="w-4 h-4 text-amber-400" />
                <p className="text-amber-200/80 text-sm font-medium">
                  Showing{" "}
                  <span className="text-amber-400 font-bold">
                    {filteredPosts.length}
                  </span>{" "}
                  of{" "}
                  <span className="text-amber-400 font-bold">
                    {posts.length}
                  </span>{" "}
                  articles
                </p>
              </div>
            </motion.div>

            {/* Premium Archive List */}
            {filteredPosts.length > 0 ? (
              <div className="max-w-5xl mx-auto space-y-4">
                {filteredPosts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.03 }}
                    whileHover={{ x: 8, scale: 1.01 }}
                    onClick={() => navigate(`/blog/${post.slug || post.id}`)}
                    className="group relative bg-gradient-to-r from-slate-800/70 to-slate-900/70 backdrop-blur-md border border-amber-500/20 rounded-2xl p-8 hover:border-amber-500/40 transition-all cursor-pointer overflow-hidden"
                  >
                    {/* Glow Effect on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 to-yellow-500/0 group-hover:from-amber-500/10 group-hover:to-yellow-500/10 transition-all duration-500" />

                    <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                      <div className="flex-1">
                        {/* Meta Info */}
                        <div className="flex items-center gap-4 mb-3">
                          {post.subcategory && (
                            <span className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full">
                              <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
                              {post.subcategory}
                            </span>
                          )}
                          <span className="text-sm text-amber-200/60 flex items-center gap-2">
                            <Calendar size={14} className="text-amber-400" />
                            {formatDate(post.publish_date)}
                          </span>
                          {post.reading_time_minutes && (
                            <span className="text-sm text-amber-200/60 flex items-center gap-2">
                              <Clock size={14} className="text-amber-400" />
                              {post.reading_time_minutes} min
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-3 group-hover:text-amber-300 transition-colors leading-tight">
                          {post.title}
                        </h3>

                        {/* Summary */}
                        {post.summary && (
                          <p className="text-amber-100/60 text-base line-clamp-2 leading-relaxed">
                            {post.summary}
                          </p>
                        )}
                      </div>

                      {/* Arrow */}
                      <motion.div
                        whileHover={{ x: 5 }}
                        className="flex items-center justify-center w-12 h-12 bg-amber-500/10 rounded-full border border-amber-500/30"
                      >
                        <ArrowRight className="w-6 h-6 text-amber-400 group-hover:text-amber-300 transition-colors" />
                      </motion.div>
                    </div>

                    {/* Corner Accent */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.article>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <Archive className="w-16 h-16 text-amber-500/30 mx-auto mb-4" />
                <p className="text-amber-200/60 text-xl mb-6">
                  No articles found matching your search criteria.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory(null);
                    setSelectedYear(null);
                  }}
                  className="px-8 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 font-semibold rounded-full shadow-lg"
                >
                  Clear all filters
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
