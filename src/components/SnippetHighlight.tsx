import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase";
import { BookOpen, Sparkles, X, Calendar, User } from "lucide-react";

interface Snippet {
  id: string;
  title: string;
  content: string;
  subtitle?: string | null;
  author?: string | null;
  publish_date: string | null;
  created_at: string | null;
}

export default function SnippetHighlight() {
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestSnippet();
  }, []);

  async function fetchLatestSnippet() {
    const { data, error } = await supabase
      .from("snippets")
      .select("*")
      .eq("is_active", true)
      .order("publish_date", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error("Error fetching snippet:", error);
    } else {
      setSnippet(data);
    }
    setLoading(false);
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Date not available";
    return new Date(dateString).toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading || !snippet) {
    return null;
  }

  return (
    <div className="relative py-24 overflow-hidden">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900" />

      {/* Floating Book Icons Background */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.05, 0.15, 0.05],
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          >
            <BookOpen className="w-24 h-24 text-amber-400" />
          </motion.div>
        ))}
      </div>

      {/* Golden Dust Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-400/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -120, 0],
              opacity: [0, 1, 0],
              scale: [0, 2, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-6 py-2 mb-6 bg-amber-500/10 border border-amber-500/30 rounded-full backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300 text-sm font-medium tracking-wider uppercase">
              Weekly Wisdom
            </span>
          </motion.div>

          <h2 className="text-5xl md:text-6xl font-serif font-bold mb-4">
            <span className="text-white">Reflections in </span>
            <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 text-transparent bg-clip-text">
              Stone
            </span>
          </h2>

          <p className="text-amber-100/60 text-lg max-w-2xl mx-auto">
            Updates every Monday at 9:00 PM – The Toast to Absent Brethren
          </p>
        </motion.div>

        {/* The Book */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative max-w-4xl mx-auto"
        >
          <AnimatePresence mode="wait">
            {!isOpen ? (
              // Closed Book State
              <motion.div
                key="closed"
                initial={{ opacity: 0, rotateY: -90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: 90 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                onClick={() => setIsOpen(true)}
                className="relative group cursor-pointer"
                style={{ perspective: "2000px" }}
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/30 via-yellow-500/30 to-amber-500/30 rounded-2xl blur-3xl group-hover:blur-[100px] transition-all duration-500" />

                {/* Book Cover */}
                <motion.div
                  whileHover={{ scale: 1.02, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="relative bg-gradient-to-br from-amber-900 via-amber-800 to-yellow-900 rounded-2xl shadow-2xl overflow-hidden"
                  style={{
                    transformStyle: "preserve-3d",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
                  }}
                >
                  {/* Book Texture Overlay */}
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `repeating-linear-gradient(
                        90deg,
                        transparent,
                        transparent 2px,
                        rgba(0,0,0,0.1) 2px,
                        rgba(0,0,0,0.1) 4px
                      )`,
                    }}
                  />

                  {/* Embossed Title Area */}
                  <div className="relative p-12 md:p-16 text-center">
                    {/* Decorative Top Border */}
                    <div className="flex items-center justify-center gap-4 mb-8">
                      <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-300/50" />
                      <Sparkles className="w-6 h-6 text-amber-300/70" />
                      <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-300/50" />
                    </div>

                    {/* Embossed Book Icon */}
                    <motion.div
                      animate={{
                        y: [0, -8, 0],
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="mb-6"
                    >
                      <BookOpen className="w-20 h-20 mx-auto text-amber-200/80 drop-shadow-2xl" />
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-3xl md:text-4xl font-serif font-bold text-amber-100 mb-3 drop-shadow-lg">
                      {snippet.title}
                    </h3>

                    {snippet.subtitle && (
                      <p className="text-amber-200/70 text-lg mb-6 font-light italic">
                        {snippet.subtitle}
                      </p>
                    )}

                    {/* Open Book Prompt */}
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="flex items-center justify-center gap-2 text-amber-300/80 text-sm font-medium mt-8"
                    >
                      <span>Click to open</span>
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        →
                      </motion.div>
                    </motion.div>

                    {/* Decorative Bottom Border */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                      <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-300/50" />
                      <BookOpen className="w-4 h-4 text-amber-300/70" />
                      <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-300/50" />
                    </div>
                  </div>

                  {/* Book Spine Shadow */}
                  <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/30 to-transparent" />

                  {/* Gold Edges */}
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-300 via-yellow-400 to-amber-300" />
                  <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300" />
                  <div className="absolute left-0 right-0 bottom-0 h-1 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300" />

                  {/* Corner Flourishes */}
                  <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-amber-300/30 rounded-tl-lg" />
                  <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-amber-300/30 rounded-tr-lg" />
                  <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-amber-300/30 rounded-bl-lg" />
                  <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-amber-300/30 rounded-br-lg" />
                </motion.div>

                {/* Book Shadow */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-black/40 blur-2xl rounded-full" />

                {/* Golden Bookmark Ribbon */}
                <motion.div
                  animate={{
                    y: [0, 5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-2 right-16 w-8 h-32 bg-gradient-to-b from-amber-400 via-yellow-500 to-amber-600 shadow-lg"
                  style={{
                    clipPath: "polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)",
                  }}
                />
              </motion.div>
            ) : (
              // Open Book State
              <motion.div
                key="open"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                {/* Radial Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 rounded-3xl blur-3xl" />

                {/* Open Book Container */}
                <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-amber-500/20 rounded-3xl shadow-2xl overflow-hidden">
                  {/* Aged Parchment Texture */}
                  <div
                    className="absolute inset-0 opacity-5"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.3'/%3E%3C/svg%3E")`,
                    }}
                  />

                  {/* Close Button */}
                  <motion.button
                    onClick={() => setIsOpen(false)}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute top-6 right-6 z-20 p-2 bg-slate-800/80 hover:bg-slate-700/80 border border-amber-500/30 rounded-full backdrop-blur-sm transition-colors group"
                  >
                    <X className="w-5 h-5 text-amber-300 group-hover:text-amber-200" />
                  </motion.button>

                  <div className="p-8 md:p-12 lg:p-16">
                    {/* Page Header */}
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-center mb-10"
                    >
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full mb-6">
                        <BookOpen className="w-4 h-4 text-amber-400" />
                        <span className="text-amber-300 text-sm font-medium">
                          Weekly Reflection
                        </span>
                      </div>

                      <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4 leading-tight">
                        {snippet.title}
                      </h2>

                      {snippet.subtitle && (
                        <p className="text-amber-200/70 text-xl italic mb-6">
                          {snippet.subtitle}
                        </p>
                      )}

                      <div className="flex items-center justify-center gap-6 text-amber-300/60 text-sm">
                        {snippet.author && (
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>{snippet.author}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(snippet.publish_date)}</span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Decorative Divider */}
                    <div className="flex items-center gap-4 mb-8">
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
                      <Sparkles className="w-5 h-5 text-amber-400/50" />
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
                    </div>

                    {/* Content */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.8 }}
                      className="prose prose-lg prose-invert prose-amber max-w-none"
                    >
                      <div
                        className="text-amber-100/90 leading-relaxed text-lg font-serif [&>p]:mb-6 [&>p]:first-letter:text-5xl [&>p]:first-letter:font-bold [&>p]:first-letter:text-amber-400 [&>p]:first-letter:mr-2 [&>p]:first-letter:float-left"
                        dangerouslySetInnerHTML={{ __html: snippet.content }}
                      />
                    </motion.div>

                    {/* Decorative Footer */}
                    <div className="flex items-center gap-4 mt-10 pt-8 border-t border-amber-500/20">
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
                      <BookOpen className="w-5 h-5 text-amber-400/50" />
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
                    </div>

                    {/* Close Button (bottom) */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="text-center mt-8"
                    >
                      <motion.button
                        onClick={() => setIsOpen(false)}
                        whileHover={{ scale: 1.05, x: -5 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 border border-amber-500/30 rounded-full text-amber-300 font-semibold transition-all"
                      >
                        ← Close Book
                      </motion.button>
                    </motion.div>
                  </div>

                  {/* Corner Decorative Elements */}
                  <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-transparent rounded-br-full" />
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-amber-500/10 to-transparent rounded-tr-full" />
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-amber-500/10 to-transparent rounded-tl-full" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
