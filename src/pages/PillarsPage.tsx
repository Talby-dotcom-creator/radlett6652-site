import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { supabase } from "../lib/supabase";
import {
  Calendar,
  Clock,
  ArrowRight,
  Columns3,
  Search,
  Archive,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { getPublicUrl } from "../lib/optimizedApi";
import { useNavigate } from "react-router-dom";
import SEOHead from "../components/SEOHead"; // ✅ Added SEO component

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
  featured?: boolean | null;
  is_featured?: boolean | null; // legacy
  slug?: string | null;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: any }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-2xl text-center">
            <h2 className="text-2xl font-semibold mb-4">
              Something went wrong
            </h2>
            <p className="text-sm text-stone-600 mb-4">
              An unexpected error occurred while rendering this page. Check the
              browser console for details.
            </p>
            <button
              className="px-4 py-2 bg-amber-600 text-white rounded"
              onClick={() => location.reload()}
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children as any;
  }
}

function PillarsPageInner() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();

  const RECENT_POSTS_LIMIT = 7; // Show only 7 most recent posts

  useEffect(() => {
    fetchPosts();
  }, [searchQuery, selectedCategory]);

  async function fetchPosts() {
    setLoading(true);

    // First, get total count
    const { count } = await supabase
      .from("blog_posts")
      .select("*", { count: "exact", head: true })
      .eq("category", "blog")
      .eq("is_published", true);

    if (count) setTotalCount(count);

    let query = supabase
      .from("blog_posts")
      .select("*")
      .eq("category", "blog")
      .eq("is_published", true)
      .order("publish_date", { ascending: false });

    // If no filters are applied, limit to recent posts
    if (!selectedCategory && !searchQuery) {
      query = query.limit(RECENT_POSTS_LIMIT);
    }

    if (selectedCategory) query = query.eq("subcategory", selectedCategory);

    if (searchQuery) {
      query = query.or(
        `title.ilike.%${searchQuery}%,summary.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`
      );
    }

    const { data, error } = await query;
    if (error) console.error("Error fetching blog posts:", error);
    if (data) {
      console.log(
        "📸 Blog posts with images:",
        data.map((p) => ({ title: p.title, image_url: p.image_url }))
      );
      const featured = data.find(
        (p: any) => (p.featured ?? p.is_featured) === true
      ) as BlogPost | undefined;
      setFeaturedPost((featured as BlogPost) || null);
      setPosts(
        (featured
          ? data.filter((p: any) => p.id !== featured.id)
          : data) as BlogPost[]
      );
    }
    setLoading(false);
  }

  const subcategories = Array.from(
    new Set(posts.map((p) => p.subcategory).filter(Boolean))
  ) as string[];

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
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
      {/* ✅ SEO Meta Block */}
      <SEOHead
        title="The Pillars – Radlett Lodge No. 6652"
        description="Insights, reflections, and stories from members of Radlett Lodge No. 6652, exploring the values, history, and community of Freemasonry."
      />

      {/* Animated Background */}
      <div className="relative min-h-screen overflow-hidden">
        {/* Premium Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900" />

        {/* Faded Columns/Pillars Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <Columns3 className="w-[600px] h-[600px] text-amber-400" />
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-amber-400/40 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Content Container */}
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* 🕯️ Epic Header */}
            <div className="text-center mb-16 relative">
              {/* Glowing Pillar Icon Background */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.05, 0.1, 0.05],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Columns3 className="w-96 h-96 text-amber-500" />
              </motion.div>

              <div className="relative">
                {/* Subtitle Badge */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="inline-flex items-center gap-2 px-6 py-2 mb-6 bg-amber-500/10 border border-amber-500/30 rounded-full backdrop-blur-sm"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-300 text-sm font-medium tracking-wider uppercase">
                    Illuminating Wisdom
                  </span>
                </motion.div>

                {/* Main Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="text-7xl md:text-8xl lg:text-9xl font-serif font-bold text-center tracking-[0.15em] select-none relative mb-6"
                >
                  <span className="text-white drop-shadow-2xl">The </span>
                  <motion.span
                    className="relative inline-block"
                    animate={{
                      textShadow: [
                        "0 0 20px rgba(255, 215, 0, 0.5)",
                        "0 0 40px rgba(255, 215, 0, 0.8)",
                        "0 0 20px rgba(255, 215, 0, 0.5)",
                      ],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <span
                      className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 text-transparent bg-clip-text"
                      style={{ backgroundSize: "200% auto" }}
                    >
                      Pillars
                    </span>
                  </motion.span>

                  {/* Shimmer Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ["-200%", "200%"] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatDelay: 2,
                      ease: "easeInOut",
                    }}
                    style={{ mixBlendMode: "overlay" }}
                  />
                </motion.h1>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.4 }}
                  className="text-amber-100/80 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed font-light"
                >
                  Wisdom, knowledge, and insights on the journey from darkness
                  to light
                </motion.p>

                {/* Decorative Lines */}
                <div className="flex items-center justify-center gap-4 mt-8">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="h-px w-24 bg-gradient-to-r from-transparent to-amber-500"
                  />
                  <BookOpen className="w-6 h-6 text-amber-400" />
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="h-px w-24 bg-gradient-to-l from-transparent to-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* 🔍 Premium Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="max-w-2xl mx-auto mb-10"
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                <div className="relative flex items-center">
                  <Search className="absolute left-6 w-5 h-5 text-amber-400" />
                  <input
                    type="text"
                    placeholder="Search for wisdom..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-white/10 backdrop-blur-md border border-amber-500/30 rounded-full 
                    text-white placeholder-amber-200/50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent 
                    transition-all shadow-xl"
                  />
                </div>
              </div>
            </motion.div>

            {/* Archive Button - Premium Style */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="flex justify-center mb-12"
            >
              <motion.button
                onClick={() => navigate("/pillars/archive")}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-yellow-600 rounded-full blur-lg group-hover:blur-xl transition-all opacity-75" />
                <div className="relative flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full font-bold text-slate-900 shadow-2xl">
                  <Archive className="w-5 h-5" />
                  <span>Explore Full Archive</span>
                  <span className="px-3 py-1 bg-slate-900/20 rounded-full text-sm">
                    {totalCount}
                  </span>
                </div>
              </motion.button>
            </motion.div>

            {/* 🏷️ Premium Category Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="flex flex-wrap justify-center gap-3 mb-16"
            >
              <motion.button
                onClick={() => setSelectedCategory(null)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                  selectedCategory === null
                    ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 shadow-lg shadow-amber-500/50"
                    : "bg-white/10 text-amber-100 hover:bg-white/20 border border-amber-500/30 backdrop-blur-sm"
                }`}
              >
                All Posts
              </motion.button>
              {subcategories.map((sub, i) => (
                <motion.button
                  key={sub}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 1.3 + i * 0.1 }}
                  onClick={() => setSelectedCategory(sub)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                    selectedCategory === sub
                      ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 shadow-lg shadow-amber-500/50"
                      : "bg-white/10 text-amber-100 hover:bg-white/20 border border-amber-500/30 backdrop-blur-sm"
                  }`}
                >
                  {sub}
                </motion.button>
              ))}
            </motion.div>

            {/* 🌟 Premium Featured Post */}
            {featuredPost && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.4 }}
                className="mb-20 relative group"
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all" />

                <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-amber-500/20 rounded-3xl shadow-2xl overflow-hidden">
                  <div className="grid md:grid-cols-2">
                    {/* Image Section */}
                    <div className="relative h-96 md:h-auto overflow-hidden">
                      {featuredPost.image_url ? (
                        <motion.img
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                          src={featuredPost.image_url}
                          alt={featuredPost.title ?? ""}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error(
                              "Failed to load featured image:",
                              featuredPost.image_url
                            );
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800">
                          <Columns3 className="w-32 h-32 text-amber-500/20" />
                        </div>
                      )}

                      {/* Featured Badge */}
                      <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 1.6 }}
                        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 rounded-full text-sm font-bold shadow-lg"
                      >
                        <Sparkles className="w-4 h-4" />
                        Featured
                      </motion.span>

                      {/* Overlay Gradient - Lightened to show image */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent md:bg-gradient-to-r" />
                    </div>

                    {/* Content Section */}
                    <div className="p-10 flex flex-col justify-center">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 1.7 }}
                        className="text-amber-400 font-bold text-sm uppercase tracking-widest mb-3 flex items-center gap-2"
                      >
                        <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                        {featuredPost.subcategory}
                      </motion.div>

                      <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 1.8 }}
                        className="text-4xl md:text-5xl font-serif font-bold text-white mb-4 leading-tight"
                      >
                        {featuredPost.title}
                      </motion.h2>

                      <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 1.9 }}
                        className="text-amber-100/70 text-lg mb-6 leading-relaxed"
                      >
                        {featuredPost.summary}
                      </motion.p>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 2 }}
                        className="flex items-center gap-6 text-sm text-amber-200/60 mb-6"
                      >
                        <span className="flex items-center gap-2">
                          <Calendar size={16} className="text-amber-400" />
                          {formatDate(featuredPost.publish_date)}
                        </span>
                        {featuredPost.reading_time_minutes && (
                          <span className="flex items-center gap-2">
                            <Clock size={16} className="text-amber-400" />
                            {featuredPost.reading_time_minutes} min read
                          </span>
                        )}
                      </motion.div>

                      <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 2.1 }}
                        onClick={() =>
                          navigate(
                            `/blog/${featuredPost.slug || featuredPost.id}`
                          )
                        }
                        whileHover={{ x: 5 }}
                        className="inline-flex items-center gap-3 text-amber-400 font-bold text-lg group/btn"
                      >
                        Read Article
                        <ArrowRight
                          size={20}
                          className="group-hover/btn:translate-x-2 transition-transform"
                        />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 🧱 Premium Posts Grid */}
            {posts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((p, index) => (
                  <motion.article
                    key={p.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 2.2 + index * 0.1 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    onClick={() => navigate(`/blog/${p.slug || p.id}`)}
                    className="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-md border border-amber-500/20 rounded-2xl shadow-xl overflow-hidden cursor-pointer"
                  >
                    {/* Glow on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-yellow-500/0 group-hover:from-amber-500/10 group-hover:to-yellow-500/10 transition-all duration-500 rounded-2xl" />

                    {/* Image */}
                    <div className="relative h-56 overflow-hidden">
                      {p.image_url ? (
                        <motion.img
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                          src={p.image_url}
                          alt={p.title ?? ""}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error("Failed to load image:", p.image_url);
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                          <Columns3 className="w-16 h-16 text-amber-500/20" />
                        </div>
                      )}
                      {/* Gradient Overlay - Lightened to show image */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="relative p-6">
                      <p className="text-amber-400 text-xs uppercase mb-2 font-bold tracking-widest flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                        {p.subcategory}
                      </p>

                      <h3 className="text-2xl font-serif font-bold text-white mb-3 leading-tight group-hover:text-amber-300 transition-colors">
                        {p.title}
                      </h3>

                      <p className="text-amber-100/60 text-sm mb-4 line-clamp-3 leading-relaxed">
                        {p.summary}
                      </p>

                      <div className="flex items-center justify-between text-xs text-amber-200/50 border-t border-amber-500/20 pt-4">
                        <span className="flex items-center gap-2">
                          <Calendar size={14} className="text-amber-400" />
                          {formatDate(p.publish_date)}
                        </span>
                        <motion.div
                          whileHover={{ x: 5 }}
                          className="flex items-center gap-2 text-amber-400 font-semibold"
                        >
                          Read More
                          <ArrowRight
                            size={14}
                            className="group-hover:translate-x-1 transition-transform"
                          />
                        </motion.div>
                      </div>
                    </div>

                    {/* Corner Accent */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-500/20 to-transparent rounded-bl-full" />
                  </motion.article>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 text-amber-200/60"
              >
                <Columns3 className="w-16 h-16 text-amber-500/30 mx-auto mb-4" />
                <p className="text-xl">No articles found.</p>
              </motion.div>
            )}

            {/* ✨ Premium CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
              className="mt-24 relative group"
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all" />

              <div className="relative bg-gradient-to-br from-slate-800/90 to-blue-950/90 backdrop-blur-xl border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden text-center py-20 px-8">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute"
                      style={{
                        left: `${20 + i * 15}%`,
                        top: `${10 + (i % 2) * 40}%`,
                      }}
                    >
                      <Columns3 className="w-24 h-24 text-amber-500" />
                    </div>
                  ))}
                </div>

                <div className="relative z-10">
                  {/* Badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 px-6 py-2 mb-6 bg-amber-500/10 border border-amber-500/30 rounded-full backdrop-blur-sm"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="text-amber-300 text-sm font-medium tracking-wider uppercase">
                      Join Our Brotherhood
                    </span>
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="text-5xl md:text-6xl font-serif font-bold text-white mb-6"
                  >
                    Begin Your Journey
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="text-amber-100/80 text-xl mb-12 max-w-3xl mx-auto leading-relaxed"
                  >
                    Discover the timeless values of Freemasonry. Join a
                    community dedicated to personal growth, shared purpose, and
                    service.
                  </motion.p>

                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                    onClick={() => navigate("/contact")}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative group/cta"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-yellow-600 rounded-full blur-lg group-hover/cta:blur-xl transition-all" />
                    <div className="relative flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full font-bold text-lg text-slate-900 shadow-2xl">
                      <span>Learn More</span>
                      <ArrowRight className="w-5 h-5 group-hover/cta:translate-x-2 transition-transform" />
                    </div>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function PillarsPage() {
  return (
    <ErrorBoundary>
      <PillarsPageInner />
    </ErrorBoundary>
  );
}
