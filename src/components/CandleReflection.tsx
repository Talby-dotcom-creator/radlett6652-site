import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CMSBlogPost } from "../types";
import { optimizedApi } from "../lib/optimizedApi";
import { Flame, X } from "lucide-react";

const CandleReflection: React.FC = () => {
  const [snippet, setSnippet] = useState<CMSBlogPost | null>(null);
  const [isLit, setIsLit] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSnippet = async () => {
      try {
        const snippets = await optimizedApi.getBlogPosts();
        // Get the latest active snippet
        const latest =
          snippets.length > 0
            ? snippets.sort((a: CMSBlogPost, b: CMSBlogPost) => {
                const ta = new Date(
                  a.publish_date ?? a.created_at ?? 0
                ).getTime();
                const tb = new Date(
                  b.publish_date ?? b.created_at ?? 0
                ).getTime();
                return tb - ta;
              })[0]
            : null;

        setSnippet(latest);
        setLoading(false);
      } catch (err) {
        console.error("Error loading snippet:", err);
        setLoading(false);
      }
    };

    loadSnippet();
  }, []);

  const lightCandle = () => {
    setIsLit(true);
  };

  const extinguish = () => {
    setIsLit(false);
  };

  if (loading || !snippet) return null;

  return (
    <section className="relative py-32 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Faded lodge room background */}
        <div className="absolute inset-0 bg-[url('/slate-texture-background.png')] bg-cover bg-center opacity-10" />

        {/* Radial gradient */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-slate-900/50 to-slate-950" />

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative container mx-auto px-4 md:px-6 max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 mb-4">
            Reflections in Stone
          </h2>
          <p className="text-amber-100/60 text-lg">
            A weekly reflection for absent brethren
          </p>
          <div className="flex items-center justify-center gap-2 text-amber-400/50 text-sm mt-2">
            <span>Updates every Monday at 9:00 PM</span>
          </div>
        </motion.div>

        {/* Candle Container */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {!isLit ? (
              /* Closed State - Unlit Candle */
              <motion.div
                key="unlit"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="w-64 h-64 bg-amber-500/20 rounded-full blur-3xl"
                  />
                </div>

                {/* Candle with instruction */}
                <div className="relative text-center py-20">
                  {/* Candle flame */}
                  <motion.button
                    onClick={lightCandle}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative mx-auto mb-8 cursor-pointer"
                  >
                    {/* Candle body */}
                    <div className="relative w-32 h-48 mx-auto">
                      {/* Wax */}
                      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-amber-100 to-amber-200 rounded-t-lg shadow-2xl">
                        {/* Wax drips */}
                        <div className="absolute -left-1 top-8 w-3 h-12 bg-amber-100 rounded-full opacity-70" />
                        <div className="absolute -right-1 top-12 w-3 h-16 bg-amber-100 rounded-full opacity-60" />
                      </div>

                      {/* Wick */}
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-40 w-1 h-4 bg-slate-800" />

                      {/* Unlit flame indicator */}
                      <motion.div
                        animate={{
                          opacity: [0.5, 0.8, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                        className="absolute left-1/2 -translate-x-1/2 bottom-44"
                      >
                        <Flame className="w-6 h-6 text-amber-400/50" />
                      </motion.div>
                    </div>

                    {/* Hover glow */}
                    <motion.div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/10 rounded-full blur-2xl transition-all duration-500" />
                  </motion.button>

                  {/* Instruction text */}
                  <motion.div
                    animate={{
                      opacity: [0.6, 1, 0.6],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                    className="text-amber-200/80 text-xl font-serif"
                  >
                    Light the candle for this week's reflection
                  </motion.div>

                  <p className="text-amber-100/40 text-sm mt-4">
                    In memory of absent brethren
                  </p>
                </div>
              </motion.div>
            ) : (
              /* Open State - Lit Candle with Reflection */
              <motion.div
                key="lit"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                {/* Radial light effect */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1.5, opacity: 1 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <div className="w-full h-full bg-gradient-radial from-amber-500/30 via-amber-500/10 to-transparent rounded-full blur-3xl" />
                </motion.div>

                {/* Content container */}
                <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden">
                  {/* Decorative top border */}
                  <div className="h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

                  {/* Close button */}
                  <button
                    onClick={extinguish}
                    className="absolute top-6 right-6 z-10 p-2 bg-slate-900/50 hover:bg-slate-900/80 border border-amber-500/30 rounded-full text-amber-300 hover:text-amber-200 transition-all backdrop-blur-sm"
                    aria-label="Extinguish candle"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {/* Candle at top */}
                  <div className="relative pt-8 pb-6">
                    <div className="flex justify-center">
                      <div className="relative">
                        {/* Lit flame */}
                        <motion.div
                          animate={{
                            scale: [1, 1.1, 1],
                            y: [0, -2, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="relative"
                        >
                          {/* Flame glow */}
                          <div className="absolute inset-0 blur-xl">
                            <Flame className="w-12 h-12 text-amber-400" />
                          </div>
                          {/* Flame */}
                          <Flame className="relative w-12 h-12 text-amber-500 drop-shadow-[0_0_20px_rgba(251,191,36,0.8)]" />
                        </motion.div>

                        {/* Flickering light rays */}
                        <motion.div
                          animate={{
                            opacity: [0.3, 0.6, 0.3],
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                          }}
                          className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Reflection content */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="px-8 md:px-16 pb-12"
                  >
                    {/* Decorative corner elements */}
                    <div className="relative">
                      <div className="absolute -top-4 -left-4 w-16 h-16 border-l-2 border-t-2 border-amber-500/30 rounded-tl-2xl" />
                      <div className="absolute -top-4 -right-4 w-16 h-16 border-r-2 border-t-2 border-amber-500/30 rounded-tr-2xl" />

                      {/* Title */}
                      <h3 className="text-3xl md:text-4xl font-serif font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 mb-8 leading-tight">
                        {snippet.title}
                      </h3>

                      {/* Content illuminated by candlelight */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5, delay: 0.8 }}
                        className="prose prose-invert prose-lg max-w-none mb-8"
                        style={{
                          color: "rgba(253, 230, 138, 0.9)", // amber-200
                        }}
                      >
                        <div
                          className="leading-relaxed text-amber-100/90 [&>p]:mb-4 [&>p]:text-lg"
                          dangerouslySetInnerHTML={{
                            __html: snippet.content ?? "",
                          }}
                        />
                      </motion.div>

                      {/* Author/Date */}
                      {(snippet.author || snippet.publish_date) && (
                        <div className="text-center pt-6 border-t border-amber-500/20">
                          <p className="text-amber-200/60 text-sm italic">
                            {snippet.author && <span>{snippet.author}</span>}
                            {snippet.author && snippet.publish_date && (
                              <span className="mx-2">•</span>
                            )}
                            {snippet.publish_date &&
                              new Date(snippet.publish_date).toLocaleDateString(
                                "en-GB",
                                {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                          </p>
                        </div>
                      )}

                      <div className="absolute -bottom-4 -left-4 w-16 h-16 border-l-2 border-b-2 border-amber-500/30 rounded-bl-2xl" />
                      <div className="absolute -bottom-4 -right-4 w-16 h-16 border-r-2 border-b-2 border-amber-500/30 rounded-br-2xl" />
                    </div>
                  </motion.div>

                  {/* Decorative bottom border */}
                  <div className="h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                </div>

                {/* Extinguish instruction */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  className="text-center mt-6 text-amber-200/50 text-sm"
                >
                  Click the X or anywhere outside to extinguish the candle
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default CandleReflection;
