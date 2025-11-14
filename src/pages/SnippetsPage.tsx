// src/pages/SnippetsPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { AnimatedBook } from "../components";
import { motion } from "framer-motion";
import {
  BookOpen,
  Sparkles,
  Calendar,
  Clock,
  ChevronRight,
} from "lucide-react";
import { optimizedApi } from "../lib/optimizedApi";
import type { CMSBlogPost } from "../types";

const FALLBACK_HERO_TEXT =
  "Click the book to reveal this week's snippet - a carefully curated message designed to inspire reflection, promote brotherhood, and illuminate the timeless principles of Freemasonry.";
const FALLBACK_ARCHIVE_TEXT =
  "New reflections are added weekly. Check back soon for the growing archive.";

const formatDate = (value?: string | null) => {
  if (!value) return "Date to be announced";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "Date to be announced";
  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatTime = (value?: string | null) => {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  });
};

const getExcerpt = (snippet?: CMSBlogPost | null, limit = 320) => {
  if (!snippet) return "";
  const source =
    snippet.summary?.trim() ??
    snippet.excerpt?.trim() ??
    snippet.content?.trim() ??
    "";
  if (!source) return "";
  if (source.length <= limit) return source;
  return `${source.slice(0, limit).trim()}…`;
};

const estimateReadTime = (snippet?: CMSBlogPost | null) => {
  const text =
    snippet?.content || snippet?.summary || snippet?.excerpt || undefined;
  if (!text) return "A few minutes";
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
};

const splitLeadLetter = (text: string) => {
  const trimmed = text.trim();
  if (!trimmed) return { lead: "", remainder: "" };
  return {
    lead: trimmed.charAt(0),
    remainder: trimmed.slice(1),
  };
};

const SnippetsPage: React.FC = () => {
  const [showFullSheetGlobal, setShowFullSheetGlobal] = useState(false);
  const [latestSnippet, setLatestSnippet] = useState<CMSBlogPost | null>(null);
  const [nextSnippet, setNextSnippet] = useState<CMSBlogPost | null>(null);
  const [archiveSnippets, setArchiveSnippets] = useState<CMSBlogPost[]>([]);
  const [loadingSnippets, setLoadingSnippets] = useState(true);
  const [snippetError, setSnippetError] = useState<string | null>(null);

  const floatingBooks = useMemo(() => {
    const hasWindow = typeof window !== "undefined";
    const width = hasWindow ? window.innerWidth : 1440;
    const height = hasWindow ? window.innerHeight : 900;
    return Array.from({ length: 8 }).map((_, index) => ({
      id: `book-${index}`,
      initialX: Math.random() * width,
      initialY: Math.random() * height,
      targetX: Math.random() * width,
      targetY: Math.random() * height,
      duration: 20 + Math.random() * 10,
      size: 20 + Math.random() * 20,
    }));
  }, []);

  const floatingParticles = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, index) => ({
        id: `particle-${index}`,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: 3 + Math.random() * 2,
        delay: Math.random() * 2,
      })),
    []
  );

  useEffect(() => {
    let isMounted = true;

    const loadSnippets = async () => {
      setLoadingSnippets(true);
      setSnippetError(null);
      try {
        const fetched: CMSBlogPost[] =
          (await optimizedApi.getSnippets?.()) ??
          (await optimizedApi.getBlogPosts?.("snippet")) ??
          [];
        const now = Date.now();
        const withDates = fetched.filter(
          (snippet) => snippet.is_published !== false
        );

        const liveSnippets = withDates.filter((snippet) => {
          if (!snippet.publish_date) return true;
          const publishTime = new Date(snippet.publish_date).getTime();
          if (Number.isNaN(publishTime)) return true;
          return publishTime <= now;
        });

        const scheduledSnippets = withDates
          .filter((snippet) => {
            if (!snippet.publish_date) return false;
            const publishTime = new Date(snippet.publish_date).getTime();
            if (Number.isNaN(publishTime)) return false;
            return publishTime > now;
          })
          .sort((a, b) => {
            const timeA = new Date(a.publish_date ?? "").getTime();
            const timeB = new Date(b.publish_date ?? "").getTime();
            return timeA - timeB;
          });

        if (!isMounted) return;
        setLatestSnippet(liveSnippets[0] ?? null);
        setArchiveSnippets(liveSnippets.slice(1));
        setNextSnippet(scheduledSnippets[0] ?? null);
      } catch (error) {
        console.error("Failed to load snippets:", error);
        if (isMounted) {
          setSnippetError("Unable to load snippets right now.");
          setLatestSnippet(null);
          setArchiveSnippets([]);
        }
      } finally {
        if (isMounted) {
          setLoadingSnippets(false);
        }
      }
    };

    loadSnippets();

    return () => {
      isMounted = false;
    };
  }, []);

  const heroDescription =
    getExcerpt(latestSnippet, 400) || FALLBACK_HERO_TEXT;
  const heroDate = formatDate(
    latestSnippet?.publish_date ?? nextSnippet?.publish_date
  );
  const heroReadTime = estimateReadTime(latestSnippet ?? nextSnippet ?? null);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Floating book particles */}
      {floatingBooks.map((book) => (
        <motion.div
          key={book.id}
          className="absolute text-amber-500/10"
          initial={{ x: book.initialX, y: book.initialY }}
          animate={{ x: book.targetX, y: book.targetY }}
          transition={{
            duration: book.duration,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
        >
          <BookOpen size={book.size} />
        </motion.div>
      ))}

      {/* Floating particles */}
      {floatingParticles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-amber-400/30 rounded-full"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
          }}
        />
      ))}

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-16 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300 text-sm font-medium">
              Weekly Masonic Wisdom
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200 bg-clip-text text-transparent"
          >
            Weekly Snippet
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-300 text-lg max-w-2xl mx-auto"
          >
            A moment of reflection, shared wisdom, and Masonic enlightenment for
            all brethren
          </motion.p>
        </motion.div>

        {/* Hero Card - Two Column Layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto mb-24"
        >
          <div className="backdrop-blur-md bg-slate-800/60 rounded-3xl border border-amber-500/20 p-8 md:p-12 shadow-2xl overflow-hidden relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />

            <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
              {/* Left Column - Description */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-amber-300 mb-4">
                  This Week's Reflection
                </h2>
                <div className="flex items-center gap-4 mb-6 text-slate-400 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>{heroDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{heroReadTime}</span>
                  </div>
                </div>
                <p className="text-slate-300 leading-relaxed mb-4 text-lg">
                  {loadingSnippets
                    ? "Gathering this week's reflection..."
                    : latestSnippet
                    ? heroDescription
                    : "Our schedule is set—once the first reflection unlocks it will appear here."}
                </p>
                {nextSnippet && (
                  <p className="text-slate-400 text-sm mb-6">
                    Next reflection unlocks on{" "}
                    <span className="text-amber-300">
                      {formatDate(nextSnippet.publish_date)}
                    </span>{" "}
                    at{" "}
                    <span className="text-amber-300">
                      {formatTime(nextSnippet.publish_date) || "21:00"}
                    </span>
                    .
                  </p>
                )}
                <div className="flex items-center gap-2 text-amber-400 text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>Updated every Monday - new wisdom awaits</span>
                </div>
              </motion.div>

              {/* Right Column - Book */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="flex justify-center md:justify-end"
                aria-label="Interactive weekly snippet book"
              >
                <div className="scale-90 md:scale-100">
                  <AnimatedBook onSheetOpenChange={setShowFullSheetGlobal} />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Archive Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="max-w-7xl mx-auto"
        >
          {/* Archive Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-amber-300 mb-3">
              Previous Reflections
            </h2>
            <p className="text-slate-400">
              Explore our archive of past weekly snippets
            </p>
          </div>

          {snippetError && (
            <div className="text-center text-amber-300 mb-8">
              {snippetError}
            </div>
          )}

          {archiveSnippets.length === 0 && !loadingSnippets ? (
            <p className="text-center text-slate-400">{FALLBACK_ARCHIVE_TEXT}</p>
          ) : (
            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
              {archiveSnippets.map((snippet, index) => {
                const excerpt = getExcerpt(snippet) || FALLBACK_ARCHIVE_TEXT;
                const { lead, remainder } = splitLeadLetter(excerpt);
                return (
                  <motion.div
                    key={snippet.id ?? `${snippet.title}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="group cursor-pointer"
                  >
                    <div className="h-full min-h-[320px] max-w-4xl mx-auto backdrop-blur-md bg-slate-800/40 rounded-3xl border border-slate-700/50 p-10 hover:border-amber-500/30 transition-all duration-300 relative overflow-hidden">
                      {/* Hover glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/0 group-hover:from-amber-500/5 group-hover:to-transparent transition-all duration-300" />

                      <div className="relative z-10">
                        {/* Date and read time */}
                        <div className="flex items-center gap-3 mb-3 text-sm text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{formatDate(snippet.publish_date)}</span>
                          </div>
                          <div className="w-1 h-1 rounded-full bg-slate-600" />
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{estimateReadTime(snippet)}</span>
                          </div>
                        </div>

                        {/* Title */}
                        <h3
                          className="text-lg font-semibold text-amber-200 mb-2 group-hover:text-amber-300 transition-colors break-words max-w-full"
                          style={{ wordBreak: "break-word", whiteSpace: "normal" }}
                        >
                          {snippet.title || "Untitled snippet"}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-slate-300 text-base leading-relaxed mb-6">
                          {lead && (
                            <span className="font-semibold text-amber-200">
                              {lead}
                            </span>
                          )}
                          {remainder}
                        </p>

                        {/* Read more link */}
                        <div className="flex items-center gap-1.5 text-amber-400 text-sm font-medium group-hover:gap-2.5 transition-all">
                          <span>Read snippet</span>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>

                      {/* Corner accent */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-bl-full" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* View All Archive CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-center"
          >
            <button className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white font-semibold shadow-lg hover:shadow-amber-500/25 transition-all duration-300 transform hover:scale-105">
              <BookOpen className="w-5 h-5" />
              <span>View Full Archive</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SnippetsPage;
