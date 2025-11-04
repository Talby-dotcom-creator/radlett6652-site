import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabase";
import { Calendar, Clock, ArrowRight, Columns3, Search } from "lucide-react";
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

export default function PillarsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, [searchQuery, selectedCategory]);

  async function fetchPosts() {
    setLoading(true);
    let query = supabase
      .from("blog_posts")
      .select("*")
      .eq("category", "blog")
      .eq("is_published", true)
      .order("publish_date", { ascending: false });

    if (selectedCategory) query = query.eq("subcategory", selectedCategory);

    if (searchQuery) {
      query = query.or(
        `title.ilike.%${searchQuery}%,summary.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`
      );
    }

    const { data, error } = await query;
    if (error) console.error("Error fetching blog posts:", error);
    if (data) {
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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-800"></div>
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

      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* 🕯️ Header */}
          <div className="text-center mb-12 relative">
            <div className="absolute inset-0 flex justify-center opacity-5">
              <Columns3 className="w-64 h-64" />
            </div>
            <div className="relative">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="text-6xl md:text-7xl font-serif font-bold text-center tracking-[0.25em]
               select-none relative overflow-hidden"
              >
                <span className="text-[#0A174E]">The </span>
                <motion.span
                  className="bg-gradient-to-r from-[#b8860b] via-[#ffcc33] to-[#ffd700]
                 text-transparent bg-clip-text relative inline-block"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    backgroundSize: "200% auto",
                  }}
                >
                  Pillars
                </motion.span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "linear",
                  }}
                />
              </motion.h1>
              <p className="text-stone-500 text-lg">
                Wisdom, knowledge, and insights on the journey from darkness to
                light
              </p>
            </div>
          </div>

          {/* 🔍 Search */}
          <div className="max-w-2xl mx-auto mb-10">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-full focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* 🏷️ Subcategory Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === null
                  ? "bg-stone-900 text-white shadow-lg"
                  : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
              }`}
            >
              All Posts
            </button>
            {subcategories.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedCategory(sub)}
                className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === sub
                    ? "bg-stone-900 text-white shadow-lg"
                    : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          {/* 🌟 Featured Post */}
          {featuredPost && (
            <div className="mb-16 bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all">
              <div className="grid md:grid-cols-2">
                <div className="relative bg-stone-800">
                  {featuredPost.image_url ? (
                    <img
                      src={featuredPost.image_url}
                      alt={featuredPost.title ?? ""}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Columns3 className="w-24 h-24 text-white/30" />
                    </div>
                  )}
                  <span className="absolute top-4 left-4 bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Featured
                  </span>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <p className="text-amber-700 font-semibold text-sm uppercase mb-2">
                    {featuredPost.subcategory}
                  </p>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-3">
                    {featuredPost.title}
                  </h2>
                  <p className="text-stone-600 mb-5 leading-relaxed">
                    {featuredPost.summary}
                  </p>
                  <div className="flex items-center gap-5 text-sm text-stone-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar size={16} />
                      {formatDate(featuredPost.publish_date)}
                    </span>
                    {featuredPost.reading_time_minutes && (
                      <span className="flex items-center gap-1">
                        <Clock size={16} />
                        {featuredPost.reading_time_minutes} min read
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() =>
                      navigate(`/blog/${featuredPost.slug || featuredPost.id}`)
                    } // ✅ changed from /pillars/ to /blog/
                    className="inline-flex items-center gap-2 text-amber-700 font-semibold hover:text-amber-900 transition-colors"
                  >
                    Read Article <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 🧱 Posts Grid */}
          {posts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((p) => (
                <article
                  key={p.id}
                  className="bg-white border border-stone-200 rounded-xl shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
                >
                  {p.image_url ? (
                    <img
                      src={p.image_url}
                      alt={p.title ?? ""}
                      className="w-full h-48 object-cover rounded-t-xl"
                    />
                  ) : (
                    <div className="h-48 bg-stone-100 flex items-center justify-center">
                      <Columns3 className="w-12 h-12 text-stone-300" />
                    </div>
                  )}
                  <div className="p-6">
                    <p className="text-amber-700 text-xs uppercase mb-2 font-semibold">
                      {p.subcategory}
                    </p>
                    <h3 className="text-xl font-serif font-bold text-stone-900 mb-3 leading-snug">
                      {p.title}
                    </h3>
                    <p className="text-stone-600 text-sm mb-4 line-clamp-3">
                      {p.summary}
                    </p>
                    <div className="flex items-center justify-between text-xs text-stone-500 border-t pt-3">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} /> {formatDate(p.publish_date)}
                      </span>
                      <button
                        onClick={() => navigate(`/blog/${p.slug || p.id}`)} // ✅ changed from /pillars/ to /blog/
                        className="inline-flex items-center gap-1 text-amber-700 hover:text-amber-900 font-medium"
                      >
                        Read More <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-stone-500">
              <Columns3 className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              No blog posts found.
            </div>
          )}

          {/* ✨ Membership / Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="mt-20 bg-[#0A174E] rounded-2xl shadow-2xl overflow-hidden text-center py-16 px-6"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
              Begin Your Journey
            </h2>
            <p className="text-[#f5d06f] text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              Discover the timeless values of Freemasonry. Join a community
              dedicated to personal growth, shared purpose, and service.
            </p>
            <motion.button
              onClick={() => navigate("/contact")}
              className="px-10 py-4 bg-[#FFD700] text-[#0A174E] font-semibold rounded-full
                 shadow-lg hover:bg-[#f4c430] transition-all duration-300 hover:scale-105"
              animate={{
                boxShadow: [
                  "0 0 0px rgba(255, 215, 0, 0.0)",
                  "0 0 15px rgba(255, 215, 0, 0.5)",
                  "0 0 0px rgba(255, 215, 0, 0.0)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              }}
            >
              Learn More →
            </motion.button>
          </motion.div>
        </div>
      </div>
    </>
  );
}
