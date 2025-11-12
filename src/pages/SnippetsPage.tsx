// src/pages/SnippetsPage.tsx
import React, { useState } from "react";
import { AnimatedBook } from "../components";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Sparkles,
  Calendar,
  Clock,
  ChevronRight,
} from "lucide-react";

const SnippetsPage: React.FC = () => {
  const [showFullSheetGlobal, setShowFullSheetGlobal] = useState(false);

  // Mock data for previous snippets (replace with real data from your CMS)
  const previousSnippets = [
    {
      id: 1,
      date: "December 2, 2024",
      title: "On Brotherhood and Trust",
      excerpt:
        "In the quiet moments between our meetings, we find the true essence of Masonic fellowship...",
      readTime: "3 min",
    },
    {
      id: 2,
      date: "November 25, 2024",
      title: "The Working Tools of Life",
      excerpt:
        "Just as the ancient craftsmen relied on their tools, we too must employ wisdom in our daily pursuits...",
      readTime: "4 min",
    },
    {
      id: 3,
      date: "November 18, 2024",
      title: "Light in Darkness",
      excerpt:
        "The ceremony of receiving light is not merely symbolic—it represents our continuous journey...",
      readTime: "3 min",
    },
    {
      id: 4,
      date: "November 11, 2024",
      title: "Charity and Relief",
      excerpt:
        "To practice charity is to live by one of our most sacred tenets. This week, let us reflect...",
      readTime: "2 min",
    },
  ];

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
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`book-${i}`}
          className="absolute text-amber-500/10"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            y: [null, Math.random() * window.innerHeight],
            x: [null, Math.random() * window.innerWidth],
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
        >
          <BookOpen size={20 + Math.random() * 20} />
        </motion.div>
      ))}

      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 bg-amber-400/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
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
          className="max-w-6xl mx-auto mb-24"
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
                    <span>December 9, 2024</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>3 min read</span>
                  </div>
                </div>
                <p className="text-slate-300 leading-relaxed mb-6 text-lg">
                  Click the book to reveal this week's snippet—a carefully
                  curated message designed to inspire reflection, promote
                  brotherhood, and illuminate the timeless principles of
                  Freemasonry.
                </p>
                <div className="flex items-center gap-2 text-amber-400 text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>Updated every Monday • New wisdom awaits</span>
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
          className="max-w-6xl mx-auto"
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

          {/* Archive Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {previousSnippets.map((snippet, index) => (
              <motion.div
                key={snippet.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group cursor-pointer"
              >
                <div className="h-full backdrop-blur-md bg-slate-800/40 rounded-2xl border border-slate-700/50 p-6 hover:border-amber-500/30 transition-all duration-300 relative overflow-hidden">
                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/0 group-hover:from-amber-500/5 group-hover:to-transparent transition-all duration-300" />

                  <div className="relative z-10">
                    {/* Date and read time */}
                    <div className="flex items-center gap-3 mb-3 text-sm text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{snippet.date}</span>
                      </div>
                      <div className="w-1 h-1 rounded-full bg-slate-600" />
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{snippet.readTime}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-semibold text-amber-200 mb-3 group-hover:text-amber-300 transition-colors">
                      {snippet.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-slate-400 text-sm leading-relaxed mb-4">
                      {snippet.excerpt}
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
            ))}
          </div>

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
