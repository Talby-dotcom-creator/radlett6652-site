// src/components/SacredChamber.tsx
import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Flame } from "lucide-react";

interface SacredChamberProps {
  text?: string;
  author?: string;
}

const SacredChamber: React.FC<SacredChamberProps> = ({
  text = "Freemasonry builds men — not in rank or wealth, but in character.",
  author = "A timeless path of integrity, service and brotherhood",
}) => {
  return (
    <section className="relative py-24 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Texture Overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.3'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Ambient Candlelight Glow */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Left Candle Glow */}
        <motion.div
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[10%] top-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl"
        />

        {/* Right Candle Glow */}
        <motion.div
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          className="absolute right-[10%] top-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Left Candle */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="absolute left-0 md:left-8 lg:left-16 top-1/2 -translate-y-1/2 hidden md:block"
          >
            <div className="relative">
              {/* Candle Body */}
              <div className="w-8 h-40 bg-gradient-to-b from-amber-200 via-amber-300 to-amber-400 rounded-t-sm shadow-lg relative">
                {/* Wax Drips */}
                <div className="absolute top-0 left-1/4 w-1 h-8 bg-amber-300/60 rounded-full" />
                <div className="absolute top-4 right-1/4 w-1 h-6 bg-amber-300/60 rounded-full" />
              </div>

              {/* Flame */}
              <motion.div
                animate={{
                  scaleY: [1, 1.2, 1],
                  scaleX: [1, 0.9, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-8 left-1/2 -translate-x-1/2"
              >
                <Flame className="w-6 h-6 text-amber-400 fill-amber-400/50 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
              </motion.div>

              {/* Light Rays */}
              <motion.div
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-16 bg-amber-400/20 rounded-full blur-xl"
              />
            </div>
          </motion.div>

          {/* Right Candle */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="absolute right-0 md:right-8 lg:right-16 top-1/2 -translate-y-1/2 hidden md:block"
          >
            <div className="relative">
              {/* Candle Body */}
              <div className="w-8 h-40 bg-gradient-to-b from-amber-200 via-amber-300 to-amber-400 rounded-t-sm shadow-lg relative">
                {/* Wax Drips */}
                <div className="absolute top-0 left-1/4 w-1 h-8 bg-amber-300/60 rounded-full" />
                <div className="absolute top-4 right-1/4 w-1 h-6 bg-amber-300/60 rounded-full" />
              </div>

              {/* Flame */}
              <motion.div
                animate={{
                  scaleY: [1, 1.2, 1],
                  scaleX: [1, 0.9, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.3,
                }}
                className="absolute -top-8 left-1/2 -translate-x-1/2"
              >
                <Flame className="w-6 h-6 text-amber-400 fill-amber-400/50 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
              </motion.div>

              {/* Light Rays */}
              <motion.div
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-16 bg-amber-400/20 rounded-full blur-xl"
              />
            </div>
          </motion.div>

          {/* Scroll/Parchment Container */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Scroll Background */}
            <div className="relative bg-gradient-to-br from-amber-50 via-amber-100 to-amber-50 rounded-lg shadow-2xl border-4 border-amber-900/20 overflow-hidden">
              {/* Parchment Texture */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='5' /%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23paper)' /%3E%3C/svg%3E")`,
                }}
              />

              {/* Scroll Curl Effect - Top */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                viewport={{ once: true }}
                className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-amber-200 to-transparent rounded-t-lg"
                style={{ transformOrigin: "left" }}
              />

              {/* Scroll Curl Effect - Bottom */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                viewport={{ once: true }}
                className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-amber-200 to-transparent rounded-b-lg"
                style={{ transformOrigin: "right" }}
              />

              {/* Content */}
              <div className="relative px-8 md:px-16 py-12 md:py-16">
                {/* Decorative Top Corner Flourish */}
                <div className="absolute top-4 left-4 w-16 h-16 opacity-20">
                  <Sparkles className="w-full h-full text-amber-900" />
                </div>
                <div className="absolute top-4 right-4 w-16 h-16 opacity-20">
                  <Sparkles className="w-full h-full text-amber-900 transform scale-x-[-1]" />
                </div>

                {/* Quote Text */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  {/* Opening Quote Mark */}
                  <span className="text-6xl md:text-7xl font-serif text-amber-900/30 leading-none">
                    "
                  </span>

                  <p className="text-2xl md:text-3xl lg:text-4xl font-serif text-slate-800 italic leading-relaxed my-6 px-4">
                    {text}
                  </p>

                  {/* Closing Quote Mark */}
                  <span className="text-6xl md:text-7xl font-serif text-amber-900/30 leading-none">
                    "
                  </span>
                </motion.div>

                {/* Decorative Divider */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ delay: 0.9, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="flex items-center justify-center gap-3 my-8"
                >
                  <div className="h-px w-24 bg-gradient-to-r from-transparent via-amber-900/40 to-transparent" />
                  <Sparkles className="w-4 h-4 text-amber-900/40" />
                  <div className="h-px w-24 bg-gradient-to-l from-transparent via-amber-900/40 to-transparent" />
                </motion.div>

                {/* Author/Subtext */}
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 1.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="text-center text-sm md:text-base text-slate-600 font-medium tracking-wide"
                >
                  {author}
                </motion.p>

                {/* Decorative Bottom Corner Flourish */}
                <div className="absolute bottom-4 left-4 w-16 h-16 opacity-20 rotate-180">
                  <Sparkles className="w-full h-full text-amber-900" />
                </div>
                <div className="absolute bottom-4 right-4 w-16 h-16 opacity-20 rotate-180">
                  <Sparkles className="w-full h-full text-amber-900 transform scale-x-[-1]" />
                </div>
              </div>
            </div>

            {/* Wax Seal */}
            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: -20 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                delay: 1.3,
                duration: 0.6,
                type: "spring",
                bounce: 0.4,
              }}
              viewport={{ once: true }}
              className="absolute -bottom-8 right-8 md:right-16"
            >
              <div className="relative w-20 h-20 bg-gradient-to-br from-red-700 via-red-800 to-red-900 rounded-full shadow-2xl border-4 border-red-950 flex items-center justify-center">
                {/* Wax Seal Texture */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-transparent rounded-full" />

                {/* S&C Symbol (simplified) */}
                <div className="relative z-10 text-amber-200/80 font-serif text-2xl font-bold">
                  G
                </div>

                {/* Wax Drips */}
                <div className="absolute -bottom-1 left-1/4 w-3 h-4 bg-red-800/60 rounded-b-full" />
                <div className="absolute -bottom-1 right-1/4 w-3 h-4 bg-red-800/60 rounded-b-full" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Floating Dust Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -80, 0],
              opacity: [0, 0.6, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default SacredChamber;
