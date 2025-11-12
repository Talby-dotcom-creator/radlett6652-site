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

interface AnimatedBookProps {
  onSheetOpenChange?: (open: boolean) => void;
}

const AnimatedBook: React.FC<AnimatedBookProps> = ({ onSheetOpenChange }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [snippet, setSnippet] = useState<SnippetData | null>(null);
  const [loadingSnippet, setLoadingSnippet] = useState(true);

  // NEW STATES
  const [showFullSheet, setShowFullSheet] = useState(false);
  const [showReflectionMessage, setShowReflectionMessage] = useState(false);
  const [hasFlutteredIn, setHasFlutteredIn] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (onSheetOpenChange) {
      onSheetOpenChange(showFullSheet);
    }
  }, [showFullSheet, onSheetOpenChange]);

  useEffect(() => {
    const loadSnippet = async () => {
      try {
        const latest = await optimizedApi.getLatestSnippet();
        console.log("📚 Loaded snippet:", latest);
        setSnippet(latest);
      } catch (err) {
        console.error("❌ Error loading snippet:", err);
        // Set fallback content if API fails
        setSnippet({
          title: "Weekly Reflection",
          subtitle: "A Moment of Masonic Wisdom",
          content:
            "Welcome to our Weekly Snippet. Each Monday we share thought-provoking reflections on Freemasonry, brotherhood, and personal growth. These short pieces are designed to inspire and enlighten all who seek wisdom. Please check back regularly for new content.",
        });
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
  }, [isOpen]);

  const displayedTitle = snippet?.title || "Weekly Snippet";
  const displayedSubtitle = snippet?.subtitle || "Masonic Reflection";
  const snippetBody =
    snippet?.content ||
    snippet?.subtitle ||
    snippet?.title ||
    "Each Monday we feature thought-provoking reflections on Freemasonry, brotherhood, and personal growth. These short pieces are designed to inspire and enlighten all who seek wisdom.";

  const formattedBody = snippetBody.replace(/([,.;!?])\s+/g, "$1\n").trim();

  console.log("📖 Book State:", {
    isOpen,
    showFullSheet,
    hasFlutteredIn,
    loadingSnippet,
    snippetTitle: snippet?.title,
  });

  return (
    <div
      className="relative flex flex-col items-center text-center text-white select-none overflow-hidden"
      style={{
        pointerEvents: !isOpen || showFullSheet ? "auto" : "none",
      }}
    >
      <audio ref={audioRef} src="/sounds/page-flip.mp3" preload="auto" />

      {/* ✅ AMBIENT LIGHT */}
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

      {/* ✅ BOOK CONTAINER */}
      <div className="overflow-visible flex justify-center">
        <motion.div
          className="relative w-full max-w-5xl"
          style={{
            transform: isOpen ? "translateY(-100px)" : "translateY(0)",
            zIndex: 10,
          }}
        >
          {/* ✅ CLOSED BOOK */}
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
              transform: "translateY(-120px)",
              zIndex: 20,
            }}
          >
            <motion.img
              src="/book-closed-reflections.png"
              alt="Book (Closed)"
              loading="eager"
              className="w-full h-full object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.8)] ring-2 ring-yellow-900/40"
            />

            {/* ❗ BUTTON TO OPEN BOOK */}
            <motion.button
              onClick={() => {
                setIsOpen(true);
                setShowReflectionMessage(false);
              }}
              className="absolute bottom-[calc(8%+350px)] px-5 py-2 
                         text-sm font-semibold bg-[#FFD700] 
                         text-[#0A174E] rounded-full shadow-md 
                         hover:bg-[#f4c430] hover:scale-105 
                         transition-all duration-300"
            >
              Open the Book
            </motion.button>
          </motion.div>

          {/* ✅ OPEN BOOK (HIDDEN WHEN SHEET IS OPEN) */}
          <motion.div
            key="open"
            initial={false}
            animate={{
              opacity: isOpen && !showFullSheet ? 1 : 0,
              rotateY: isOpen && !showFullSheet ? 0 : -135,
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center"
            style={{
              backfaceVisibility: "hidden",
              pointerEvents: "none",
              zIndex: 30,
            }}
          >
            <motion.img
              src="/book-open.png"
              alt="Book (Open)"
              loading="eager"
              className="w-full h-full object-contain 
                         drop-shadow-[0_30px_60px_rgba(0,0,0,0.8)] 
                         ring-2 ring-yellow-900/40"
            />

            {/* ✅ REFLECTION MESSAGE - ELEGANT CHAPTER PAGE */}
            {showReflectionMessage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute w-[68%] text-center font-serif z-30"
                style={{
                  top: "calc(30% - 20px)",
                  left: "16%",
                  padding: "1.5rem 2.5rem",
                  background:
                    "linear-gradient(to bottom, rgba(245,234,205,0.03) 0%, rgba(245,234,205,0.01) 100%)",
                  borderRadius: "8px",
                }}
              >
                {/* Decorative Top Glyph - Masonic Square & Compass Hint */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  style={{
                    fontSize: "1.2rem",
                    color: "#D4AF37",
                    marginBottom: "0.4rem",
                    textShadow:
                      "0 0 8px rgba(212,175,55,0.4), 0 2px 4px rgba(0,0,0,0.3)",
                    letterSpacing: "0.3em",
                  }}
                >
                  ✦ ◆ ✦
                </motion.div>

                {/* Elegant Divider Line - Top */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  style={{
                    height: "1px",
                    background:
                      "linear-gradient(to right, transparent, #D4AF37 20%, #D4AF37 80%, transparent)",
                    marginBottom: "0.8rem",
                    boxShadow: "0 0 4px rgba(212,175,55,0.5)",
                  }}
                />

                {/* Main Text Content */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  style={{
                    fontSize: "clamp(0.85rem, 1.1vw, 1rem)",
                    lineHeight: 1.5,
                    color: "#f5eacd",
                    textShadow:
                      "0 2px 8px rgba(0,0,0,0.7), 0 1px 3px rgba(212,175,55,0.15)",
                    fontFamily: "'Libre Baskerville', 'Georgia', serif",
                    letterSpacing: "0.01em",
                    marginBottom: "0.8rem",
                  }}
                >
                  Each Monday we feature thought-provoking reflections. These
                  are not only for Masons but for everyone. Please come back and
                  check them out — they could be life-changing for you.
                </motion.p>

                {/* Elegant Divider Line - Bottom */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  style={{
                    height: "1px",
                    background:
                      "linear-gradient(to right, transparent, #D4AF37 20%, #D4AF37 80%, transparent)",
                    marginBottom: "0.5rem",
                    boxShadow: "0 0 4px rgba(212,175,55,0.5)",
                  }}
                />

                {/* Decorative Bottom Glyph - Subtle Masonic Pillars */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  style={{
                    fontSize: "1.1rem",
                    color: "#D4AF37",
                    textShadow:
                      "0 0 8px rgba(212,175,55,0.4), 0 2px 4px rgba(0,0,0,0.3)",
                    letterSpacing: "0.5em",
                    opacity: 0.8,
                  }}
                >
                  ⬩ ◇ ⬩
                </motion.div>

                {/* Close Book Button */}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                  onClick={() => {
                    setIsOpen(false);
                    setShowReflectionMessage(false);
                    setHasFlutteredIn(false);
                  }}
                  className="px-6 py-2.5 rounded-lg font-semibold
                             transition-all duration-200
                             hover:scale-105 active:scale-95"
                  style={{
                    marginTop: "1.5rem",
                    background:
                      "linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)",
                    color: "#1a1105",
                    boxShadow:
                      "0 4px 12px rgba(212,175,55,0.3), 0 2px 6px rgba(0,0,0,0.2)",
                    border: "1px solid rgba(255,215,0,0.3)",
                    pointerEvents: "auto",
                  }}
                  whileHover={{
                    boxShadow:
                      "0 6px 20px rgba(212,175,55,0.5), 0 3px 8px rgba(0,0,0,0.3)",
                  }}
                  whileTap={{
                    boxShadow: "0 2px 6px rgba(212,175,55,0.2)",
                  }}
                >
                  ✕ Close Book
                </motion.button>
              </motion.div>
            )}
          </motion.div>

          {/* ✅ INITIAL PARCHMENT FLUTTER IN - CINEMATIC ENTRANCE */}
          <AnimatePresence>
            {isOpen && !hasFlutteredIn && (
              <motion.div
                key="parchment-flutter-in"
                initial={{
                  opacity: 0,
                  x: "-2%",
                  y: "10%",
                  rotate: -6,
                  scale: 0.2,
                }}
                animate={{
                  opacity: [0, 1, 1, 1],
                  x: "-2%",
                  y: ["10%", "-3%", "-1%", "0%"],
                  rotate: [-6, 3, -0.5, 0],
                  scale: [0.2, 0.6, 1.24, 1.22],
                }}
                transition={{
                  duration: 2.2,
                  ease: [0.34, 1.56, 0.64, 1],
                  times: [0, 0.4, 0.75, 1],
                }}
                onAnimationComplete={() => {
                  setHasFlutteredIn(true);
                  setShowFullSheet(true);
                }}
                style={{
                  position: "absolute",
                  top: "22%",
                  left: "16%",
                  width: "68%",
                  height: "58%",
                  zIndex: 35,
                  pointerEvents: "none",
                  borderRadius: "6px",
                }}
              >
                {/* 3D Curl Shadows - Top */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "5%",
                    right: "5%",
                    height: "8%",
                    background:
                      "linear-gradient(to bottom, rgba(90,70,50,0.25) 0%, transparent 100%)",
                    borderRadius: "6px 6px 0 0",
                    zIndex: -1,
                    transform: "translateY(-2px)",
                  }}
                />

                {/* 3D Curl Shadows - Left Side */}
                <div
                  style={{
                    position: "absolute",
                    top: "5%",
                    bottom: "5%",
                    left: 0,
                    width: "6%",
                    background:
                      "linear-gradient(to right, rgba(90,70,50,0.2) 0%, transparent 100%)",
                    zIndex: -1,
                    transform: "translateX(-2px)",
                  }}
                />

                {/* 3D Curl Shadows - Right Side */}
                <div
                  style={{
                    position: "absolute",
                    top: "5%",
                    bottom: "5%",
                    right: 0,
                    width: "6%",
                    background:
                      "linear-gradient(to left, rgba(90,70,50,0.2) 0%, transparent 100%)",
                    zIndex: -1,
                    transform: "translateX(2px)",
                  }}
                />

                {/* 3D Curl Shadows - Bottom */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: "5%",
                    right: "5%",
                    height: "8%",
                    background:
                      "linear-gradient(to top, rgba(90,70,50,0.3) 0%, transparent 100%)",
                    borderRadius: "0 0 6px 6px",
                    zIndex: -1,
                    transform: "translateY(2px)",
                  }}
                />

                {/* Central Warm Glow */}
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: "70%",
                    height: "70%",
                    transform: "translate(-50%, -50%)",
                    background:
                      "radial-gradient(ellipse at center, rgba(255,245,220,0.15) 0%, rgba(255,215,130,0.08) 40%, transparent 70%)",
                    borderRadius: "50%",
                    zIndex: 1,
                    pointerEvents: "none",
                  }}
                />

                {/* Parchment Image */}
                <motion.img
                  src="/parchment-full.png"
                  alt="Parchment"
                  animate={{
                    filter: [
                      "contrast(1) brightness(1)",
                      "contrast(1.02) brightness(1.01)",
                      "contrast(1) brightness(1)",
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "6px",
                    boxShadow: `
                      0 25px 50px rgba(0,0,0,0.4),
                      0 15px 30px rgba(0,0,0,0.3),
                      inset 0 0 60px rgba(255,245,220,0.1)
                    `,
                  }}
                />

                {/* Paper Grain Texture Overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "6px",
                    backgroundImage: `
                      repeating-linear-gradient(
                        0deg,
                        transparent,
                        transparent 2px,
                        rgba(90,70,50,0.02) 2px,
                        rgba(90,70,50,0.02) 4px
                      ),
                      repeating-linear-gradient(
                        90deg,
                        transparent,
                        transparent 2px,
                        rgba(90,70,50,0.015) 2px,
                        rgba(90,70,50,0.015) 4px
                      )
                    `,
                    opacity: 0.6,
                    mixBlendMode: "multiply",
                    pointerEvents: "none",
                    zIndex: 2,
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ✅ FULL-SHEET WITH SNIPPET CONTENT - UPGRADED 3D */}
          <AnimatePresence>
            {isOpen && showFullSheet && (
              <>
                {/* CINEMATIC BACKDROP EFFECTS */}

                {/* A. Deep Vignette - Darkens edges dramatically */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.7) 100%)",
                    zIndex: 33,
                    pointerEvents: "none",
                  }}
                />

                {/* B. Gold Edge Rays - Behind the page */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.6, 0.4] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, times: [0, 0.6, 1] }}
                  style={{
                    position: "absolute",
                    top: "22%",
                    left: "16%",
                    width: "68%",
                    height: "58%",
                    zIndex: 34,
                    pointerEvents: "none",
                    overflow: "visible",
                  }}
                >
                  {/* Multiple golden rays at 25° angle */}
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        opacity: [0.15, 0.25, 0.15],
                      }}
                      transition={{
                        duration: 3 + i * 0.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.3,
                      }}
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        width: "150%",
                        height: "2px",
                        background: `linear-gradient(90deg, transparent 0%, rgba(255,215,100,${
                          0.3 - i * 0.03
                        }) 50%, transparent 100%)`,
                        transform: `translate(-50%, -50%) rotate(${
                          25 + i * 15
                        }deg) translateX(${i * 15}%)`,
                        transformOrigin: "center",
                        filter: "blur(1px)",
                      }}
                    />
                  ))}
                </motion.div>

                {/* C. Floating Dust Particles - Super subtle */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  style={{
                    position: "absolute",
                    top: "15%",
                    left: "10%",
                    width: "80%",
                    height: "70%",
                    zIndex: 36,
                    pointerEvents: "none",
                    overflow: "hidden",
                  }}
                >
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        y: [
                          `${Math.random() * 100}%`,
                          `${Math.random() * 100}%`,
                        ],
                        x: [
                          `${Math.random() * 100}%`,
                          `${Math.random() * 100}%`,
                        ],
                        opacity: [0, 0.3, 0.5, 0.2, 0],
                      }}
                      transition={{
                        duration: 8 + Math.random() * 6,
                        repeat: Infinity,
                        ease: "linear",
                        delay: Math.random() * 3,
                      }}
                      style={{
                        position: "absolute",
                        width: `${1 + Math.random() * 2}px`,
                        height: `${1 + Math.random() * 2}px`,
                        borderRadius: "50%",
                        background: "rgba(255,240,200,0.6)",
                        filter: "blur(0.5px)",
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                      }}
                    />
                  ))}
                </motion.div>

                {/* PARCHMENT SHEET */}
                <motion.div
                  key="full-parchment"
                  initial={{
                    opacity: 1,
                    x: "-2%",
                    y: "0%",
                    rotate: 0,
                    scale: 1.22,
                  }}
                  animate={{
                    opacity: 1,
                    x: "-2%",
                    y: "0%",
                    rotate: 0,
                    scale: 1.22,
                  }}
                  exit={{
                    opacity: 0,
                    x: "-2%",
                    y: "10%",
                    scale: 0.2,
                    rotate: -4,
                  }}
                  transition={{
                    duration: 0.8,
                    ease: "easeInOut",
                  }}
                  style={{
                    position: "absolute",
                    top: "22%",
                    left: "16%",
                    width: "68%",
                    height: "58%",
                    zIndex: 35,
                    pointerEvents: "auto",
                    borderRadius: "6px",
                    overflow: "hidden",
                  }}
                >
                  {/* 3D Curl Shadows - Top */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: "5%",
                      right: "5%",
                      height: "8%",
                      background:
                        "linear-gradient(to bottom, rgba(90,70,50,0.25) 0%, transparent 100%)",
                      borderRadius: "6px 6px 0 0",
                      zIndex: 1,
                      transform: "translateY(-2px)",
                      pointerEvents: "none",
                    }}
                  />

                  {/* 3D Curl Shadows - Left Side */}
                  <div
                    style={{
                      position: "absolute",
                      top: "5%",
                      bottom: "5%",
                      left: 0,
                      width: "6%",
                      background:
                        "linear-gradient(to right, rgba(90,70,50,0.2) 0%, transparent 100%)",
                      zIndex: 1,
                      transform: "translateX(-2px)",
                      pointerEvents: "none",
                    }}
                  />

                  {/* 3D Curl Shadows - Right Side */}
                  <div
                    style={{
                      position: "absolute",
                      top: "5%",
                      bottom: "5%",
                      right: 0,
                      width: "6%",
                      background:
                        "linear-gradient(to left, rgba(90,70,50,0.2) 0%, transparent 100%)",
                      zIndex: 1,
                      transform: "translateX(2px)",
                      pointerEvents: "none",
                    }}
                  />

                  {/* 3D Curl Shadows - Bottom */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: "5%",
                      right: "5%",
                      height: "8%",
                      background:
                        "linear-gradient(to top, rgba(90,70,50,0.3) 0%, transparent 100%)",
                      borderRadius: "0 0 6px 6px",
                      zIndex: 1,
                      transform: "translateY(2px)",
                      pointerEvents: "none",
                    }}
                  />

                  {/* Central Warm Glow */}
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      width: "70%",
                      height: "70%",
                      transform: "translate(-50%, -50%)",
                      background:
                        "radial-gradient(ellipse at center, rgba(255,245,220,0.15) 0%, rgba(255,215,130,0.08) 40%, transparent 70%)",
                      borderRadius: "50%",
                      zIndex: 2,
                      pointerEvents: "none",
                    }}
                  />

                  {/* Ambient Shimmer - Candle-like Breathing */}
                  <motion.div
                    animate={{
                      opacity: [0.03, 0.08, 0.04, 0.09, 0.03],
                    }}
                    transition={{
                      duration: 4.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      times: [0, 0.25, 0.5, 0.75, 1],
                    }}
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "radial-gradient(ellipse at 60% 40%, rgba(255,230,180,0.6) 0%, rgba(255,245,220,0.3) 30%, transparent 60%)",
                      borderRadius: "6px",
                      zIndex: 2,
                      pointerEvents: "none",
                      mixBlendMode: "overlay",
                    }}
                  />

                  {/* Hand Shadow - Passes across when settled */}
                  <motion.div
                    initial={{ x: "-120%", opacity: 0 }}
                    animate={{
                      x: ["-120%", "-60%", "50%", "140%", "180%"],
                      opacity: [0, 0.4, 0.3, 0.2, 0],
                    }}
                    transition={{
                      delay: 0.3,
                      duration: 1.2,
                      ease: "easeOut",
                      times: [0, 0.1, 0.5, 0.9, 1],
                    }}
                    style={{
                      position: "absolute",
                      top: "-10%",
                      left: "-10%",
                      width: "40%",
                      height: "120%",
                      background:
                        "linear-gradient(90deg, transparent 0%, rgba(50,40,30,0.25) 50%, transparent 100%)",
                      borderRadius: "50%",
                      zIndex: 3,
                      pointerEvents: "none",
                      transform: "rotate(-25deg)",
                    }}
                  />

                  {/* Parchment Background with Micro-Warp */}
                  <motion.div
                    animate={{
                      filter: [
                        "contrast(1) brightness(1)",
                        "contrast(1.015) brightness(1.008)",
                        "contrast(0.998) brightness(0.995)",
                        "contrast(1.005) brightness(1.003)",
                        "contrast(1) brightness(1)",
                      ],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundImage: "url('/parchment-full.png')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      borderRadius: "6px",
                      boxShadow: `
                      0 25px 50px rgba(0,0,0,0.4),
                      0 15px 30px rgba(0,0,0,0.3),
                      inset 0 0 60px rgba(255,245,220,0.1)
                    `,
                      zIndex: 0,
                    }}
                  >
                    {/* Paper Micro-Warp Overlay */}
                    <motion.div
                      animate={{
                        transform: [
                          "perspective(1000px) rotateX(0deg) rotateY(0deg)",
                          "perspective(1000px) rotateX(0.3deg) rotateY(-0.2deg)",
                          "perspective(1000px) rotateX(-0.2deg) rotateY(0.3deg)",
                          "perspective(1000px) rotateX(0.1deg) rotateY(0.1deg)",
                          "perspective(1000px) rotateX(0deg) rotateY(0deg)",
                        ],
                      }}
                      transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "6px",
                      }}
                    />
                  </motion.div>

                  {/* Paper Grain Texture Overlay */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "6px",
                      backgroundImage: `
                      repeating-linear-gradient(
                        0deg,
                        transparent,
                        transparent 2px,
                        rgba(90,70,50,0.02) 2px,
                        rgba(90,70,50,0.02) 4px
                      ),
                      repeating-linear-gradient(
                        90deg,
                        transparent,
                        transparent 2px,
                        rgba(90,70,50,0.015) 2px,
                        rgba(90,70,50,0.015) 4px
                      )
                    `,
                      opacity: 0.6,
                      mixBlendMode: "multiply",
                      pointerEvents: "none",
                      zIndex: 3,
                    }}
                  />

                  {/* Scrollable Content Container */}
                  <div
                    className="custom-scrollbar"
                    style={{
                      position: "absolute",
                      inset: 0,
                      padding: "clamp(2rem, 4vw, 3rem)",
                      overflowY: "auto",
                      overflowX: "hidden",
                      zIndex: 4,
                    }}
                  >
                    {/* SNIPPET CONTENT ON PARCHMENT */}
                    <div
                      style={{
                        fontFamily: "'Libre Baskerville', 'Georgia', serif",
                        color: "#2a210f",
                      }}
                    >
                      {/* Title - Playfair Display SC with Golden Tint */}
                      {displayedTitle && (
                        <h2
                          className="text-center"
                          style={{
                            fontFamily:
                              "'Playfair Display SC', 'Playfair Display', serif",
                            fontWeight: 700,
                            letterSpacing: "0.12em",
                            fontSize: "clamp(1.8rem, 2.5vw, 2.5rem)",
                            marginBottom: "0.5em",
                            lineHeight: 1.25,
                            textTransform: "uppercase",
                            color: "#6B4E11",
                            textShadow:
                              "0 0 2px rgba(255,215,0,0.4), 0 1px 2px rgba(0,0,0,0.25), 0 -1px 1px rgba(139,105,20,0.3)",
                          }}
                        >
                          {displayedTitle}
                        </h2>
                      )}

                      {/* Subtitle - Left-aligned with Gradient */}
                      {displayedSubtitle && (
                        <p
                          className="italic"
                          style={{
                            fontSize: "clamp(1.05rem, 1.4vw, 1.2rem)",
                            marginBottom: "1.5em",
                            textAlign: "left",
                            textIndent: "1.5em",
                            letterSpacing: "0.02em",
                            opacity: 0.85,
                            color: "#3a2f18",
                            textShadow: "0 1px 1px rgba(90,69,32,0.2)",
                            lineHeight: 1.6,
                          }}
                        >
                          {displayedSubtitle}
                        </p>
                      )}

                      {/* Decorative Divider */}
                      {displayedSubtitle && (
                        <div
                          style={{
                            width: "60px",
                            height: "2px",
                            margin: "0 auto 1.8em",
                            background:
                              "linear-gradient(to right, transparent, #8b7355, transparent)",
                            opacity: 0.5,
                          }}
                        />
                      )}

                      {/* Body - Enhanced Contrast & Vertical Rhythm */}
                      <div
                        className="snippet-body"
                        style={{
                          whiteSpace: "pre-line",
                          lineHeight: 1.9,
                          fontSize: "clamp(0.98rem, 1.25vw, 1.08rem)",
                          textRendering: "optimizeLegibility",
                          textAlign: "justify",
                          hyphens: "auto",
                          color: "#1a140a",
                          textShadow: "0 1px 1px rgba(255,255,255,0.25)",
                          background:
                            "linear-gradient(to bottom, rgba(255,250,240,0.005) 0%, rgba(255,250,240,0.005) 100%)",
                          padding: "0.2em 0",
                        }}
                      >
                        {formattedBody}
                      </div>
                    </div>
                  </div>

                  {/* CSS-in-JS for custom scrollbar and drop cap */}
                  <style>{`
                  .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                  }
                  .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(139, 115, 85, 0.1);
                    border-radius: 10px;
                  }
                  .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(90, 70, 50, 0.4);
                    border-radius: 10px;
                  }
                  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(90, 70, 50, 0.6);
                  }
                  .snippet-body::first-letter {
                    font-size: 3.8em;
                    line-height: 0.82;
                    float: left;
                    margin: 0.05em 0.12em 0 0;
                    font-family: 'Playfair Display SC', 'Playfair Display', serif;
                    font-weight: 700;
                    color: #6B4E11;
                    text-shadow: 0 0 2px rgba(255,215,0,0.4), 0 1px 2px rgba(0,0,0,0.2);
                  }
                `}</style>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* ✅ CLOSE BUTTON */}
          {showFullSheet && (
            <motion.button
              onClick={() => {
                setShowFullSheet(false);
                setShowReflectionMessage(true);
              }}
              className="absolute bottom-[12%] left-1/2 -translate-x-1/2
                         bg-[#FFD700] text-[#0A174E] px-6 py-3 
                         rounded-lg shadow-lg font-semibold
                         hover:bg-[#f4c430] hover:scale-105 transition-all"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{ zIndex: 40 }}
            >
              Close Book
            </motion.button>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AnimatedBook;
