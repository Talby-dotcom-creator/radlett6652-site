import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { optimizedApi } from "../lib/optimizedApi";

interface SnippetData {
  id?: string;
  title?: string;
  subtitle?: string;
  content?: string;
  publish_date?: string | null;
}

const AnimatedBook: React.FC = () => {
  // Start closed by default. Persistence removed so each page load begins closed.
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [snippet, setSnippet] = useState<SnippetData | null>(null);
  const [loadingSnippet, setLoadingSnippet] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const loadSnippet = async () => {
      try {
        const latest = await optimizedApi.getLatestSnippet();
        setSnippet(latest);
      } catch (err) {
        console.error("Error loading snippet:", err);
      } finally {
        setLoadingSnippet(false);
      }
    };
    loadSnippet();
  }, []);

  useEffect(() => {
    if (isOpen && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  }, [isOpen, pageIndex]);

  const snippetText =
    snippet?.content ||
    snippet?.subtitle ||
    snippet?.title ||
    "Snippet not available. Please check back soon.";

  const formattedText = snippetText.replace(/([,.;!?])\s+/g, "$1\n").trim();
  const lines = formattedText.split("\n");
  const linesPerSpread = 26;
  const startIndex = pageIndex * linesPerSpread;
  const spreadLines = lines.slice(startIndex, startIndex + linesPerSpread);

  const halfIndex = Math.ceil(spreadLines.length / 2);
  const leftPageText = spreadLines.slice(0, halfIndex).join("\n");
  const rightPageText = spreadLines.slice(halfIndex).join("\n");

  const displayedTitle = snippet?.title || "";
  const displayedSubtitle = snippet?.subtitle || "";

  const handleOpenClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("AnimatedBook: open button clicked, isOpen before:", isOpen);
    if (!isOpen) setIsOpen(true);
  };

  useEffect(() => {
    console.log("AnimatedBook: isOpen changed ->", isOpen);
  }, [isOpen]);

  // Note: persistence intentionally removed (Option A) — isOpen will not be stored.

  useEffect(() => {
    console.log("AnimatedBook: mounted");
    return () => console.log("AnimatedBook: unmounted");
  }, []);

  useEffect(() => {
    console.log("AnimatedBook: snippet changed ->", snippet);
  }, [snippet]);

  useEffect(() => {
    console.log("AnimatedBook: pageIndex ->", pageIndex);
  }, [pageIndex]);

  return (
    <div className="relative flex flex-col items-center text-center text-white select-none overflow-hidden">
      <audio ref={audioRef} src="/sounds/page-flip.mp3" preload="auto" />

      {/* Subtle ambient light */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          opacity: [0.97, 1, 0.98, 1],
          filter: [
            "brightness(1)",
            "brightness(1.015)",
            "brightness(0.985)",
            "brightness(1)",
          ],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{
          zIndex: 0,
          background:
            "radial-gradient(circle at 55% 70%, rgba(255,210,130,0.05) 0%, transparent 65%)",
        }}
      />

      {/* Book container */}
      <div className="overflow-visible flex justify-center">
        <motion.div
          className="relative w-full max-w-5xl"
          style={{
            transform: isOpen ? "translateY(-100px)" : "translateY(0)",
            zIndex: 10,
          }}
        >
          {/* Closed book (always mounted, visibility toggled) */}
          <motion.div
            key="closed"
            initial={false}
            animate={{
              opacity: isOpen ? 0 : 1,
              rotateY: isOpen ? 135 : 0,
            }}
            transition={{ duration: 0.65, ease: "easeInOut" }}
            className="relative flex items-center justify-center"
            style={{
              pointerEvents: isOpen ? "none" : "auto",
              zIndex: 20,
              transform: "translateY(-120px)", // lifts the closed book upward into view
            }}
          >
            <motion.img
              src="/book-closed-reflections.png"
              alt="Reflections Book (Closed)"
              loading="eager"
              className="w-full h-full object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.8)] ring-2 ring-yellow-900/40"
            />

            {/* Candlelight shimmer overlay */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(115deg, rgba(255,240,180,0.05) 0%, rgba(255,230,130,0.18) 20%, rgba(255,210,90,0.05) 40%, transparent 70%)",
                mixBlendMode: "screen",
              }}
              animate={{
                backgroundPosition: ["0% 0%", "200% 0%"],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Open Book Button */}
            <motion.button
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                console.log(
                  "AnimatedBook: inline open click, isOpen before:",
                  isOpen
                );
                if (!isOpen) setIsOpen(true);
              }}
              className="absolute z-50 font-serif text-lg md:text-xl text-yellow-100 tracking-wide"
              style={{
                bottom: "calc(41% - 160px)",
                left: "55%",
                transform: "translateX(-50%) rotateX(22deg) rotateZ(-12deg)",
                transformOrigin: "50% 50%",
                padding: "1rem 3rem",
                borderRadius: "12px",
                background:
                  "radial-gradient(circle at 50% 0%, rgba(255,215,130,0.3) 0%, rgba(0,0,0,0) 70%), rgba(50,30,0,0.7)",
                border: "1px solid rgba(255,215,130,0.5)",
                boxShadow:
                  "0 0 30px rgba(255,215,130,0.4), 0 10px 25px rgba(0,0,0,0.9)",
                textShadow: "0 2px 10px rgba(0,0,0,0.9)",
                letterSpacing: "0.08em",
                fontWeight: 500,
                minHeight: "70px",
                minWidth: "220px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "auto",
                cursor: "pointer",
              }}
              whileHover={{
                scale: 1.04,
                boxShadow:
                  "0 0 50px rgba(255,215,130,0.8), 0 20px 50px rgba(0,0,0,0.95)",
              }}
              whileTap={{
                scale: 0.97,
                boxShadow:
                  "0 0 25px rgba(255,215,130,0.6), 0 12px 30px rgba(0,0,0,0.9)",
              }}
            >
              Open the Book
            </motion.button>
          </motion.div>

          {/* Open book (always mounted, visibility toggled) */}
          <motion.div
            key="open"
            initial={false}
            animate={{
              opacity: isOpen ? 1 : 0,
              rotateY: isOpen ? 0 : -135,
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center"
            style={{
              backfaceVisibility: "hidden",
              pointerEvents: isOpen ? "auto" : "none",
              zIndex: 30,
            }}
          >
            <motion.img
              src="/book-open.png"
              alt="Reflections Book (Open)"
              loading="eager"
              className="w-full h-full object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.8)] ring-2 ring-yellow-900/40"
            />

            {/* LEFT PAGE */}
            <div
              className="absolute text-left font-serif"
              style={{
                top: "calc(23% + 180px)",
                left: "13%",
                width: "31%",
                height: "48%",
                whiteSpace: "pre-line",
                fontFamily: "'Libre Baskerville', 'Georgia', serif",
                fontWeight: 400,
                fontSize: "clamp(1rem,1vw+0.6rem,1.25rem)",
                lineHeight: 1.7,
                color: "rgba(245,235,215,0.95)",
                textShadow: "0 2px 3px rgba(0,0,0,0.6)",
                transform: "rotate(10.1deg) skewY(-7.5deg)",
              }}
            >
              {displayedTitle && (
                <h2
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 600,
                    color: "#f4e7ba",
                    textShadow:
                      "0 2px 3px rgba(0,0,0,0.7), 0 1px 0 rgba(255,255,255,0.1)",
                    letterSpacing: "0.02em",
                    marginBottom: "0.3em",
                  }}
                  className="text-left text-[clamp(1.9rem,2.3vw,2.7rem)]"
                >
                  {displayedTitle}
                </h2>
              )}
              {displayedSubtitle && (
                <h3
                  style={{
                    color: "rgba(255,255,240,0.85)",
                    fontStyle: "italic",
                    marginBottom: "1.2em",
                    textAlign: "left",
                    textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                  }}
                  className="text-[clamp(1.1rem,1.3vw,1.4rem)]"
                >
                  {displayedSubtitle}
                </h3>
              )}
              <p>{leftPageText}</p>
            </div>

            {/* RIGHT PAGE */}
            <div
              className="absolute text-left font-serif"
              style={{
                top: "calc(26% + 220px)",
                left: "46%",
                width: "31%",
                height: "48%",
                whiteSpace: "pre-line",
                fontFamily: "'Libre Baskerville', 'Georgia', serif",
                fontWeight: 400,
                fontSize: "clamp(1rem,1vw+0.6rem,1.25rem)",
                lineHeight: 1.7,
                color: "rgba(245,235,215,0.95)",
                textShadow: "0 2px 3px rgba(0,0,0,0.6)",
                transform: "rotate(9.5deg) skewY(-4.5deg)",
              }}
            >
              <p>{rightPageText}</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* INFO BOX — hidden on mobile to prevent overlap */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
        className="hidden md:block mx-auto mb-8 max-w-5xl px-8 py-6 text-center rounded-2xl font-serif text-[clamp(1rem,1vw+0.5rem,1.15rem)] text-yellow-50 shadow-[0_0_40px_rgba(0,0,0,0.5)]"
        style={{
          position: "relative",
          zIndex: 40,
          marginTop: "-580px",
          background:
            "linear-gradient(180deg, rgba(60,40,10,0.85) 0%, rgba(30,20,0,0.9) 100%)",
          border: "1px solid rgba(255,215,130,0.4)",
          boxShadow:
            "0 0 25px rgba(255,215,130,0.2), 0 0 120px rgba(255,215,130,0.08) inset",
        }}
      >
        <p className="leading-relaxed">
          <span className="text-yellow-300 font-semibold">
            Welcome to Reflections.
          </span>{" "}
          Here we share short, thought-provoking passages — reflections drawn
          from life, philosophy, and the wider world. They are written for
          everyone, not just Freemasons. Each invites you to pause, consider,
          and reflect. A new piece is published every Monday at 9&nbsp;PM.
        </p>
      </motion.div>
    </div>
  );
};

export default AnimatedBook;
