// src/components/ThreePillarsSection.tsx
import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles } from "lucide-react";

const pillars = [
  {
    title: "Wisdom",
    subtitle: "The Ionic Pillar",
    description:
      "Knowledge, understanding, and enlightenment guide our actions. Through study and reflection, we seek truth and wisdom in all our endeavors.",
    symbolism: "Represents the intellect and the pursuit of knowledge",
    color: "from-blue-400 to-blue-600",
    position: "left",
  },
  {
    title: "Strength",
    subtitle: "The Doric Pillar",
    description:
      "Moral courage, resilience, and fortitude in the face of adversity. We support our brothers and uphold our principles with unwavering determination.",
    symbolism: "Represents the power to overcome challenges",
    color: "from-amber-400 to-amber-600",
    position: "center",
  },
  {
    title: "Beauty",
    subtitle: "The Corinthian Pillar",
    description:
      "Harmony, grace, and excellence in all we do. We strive to beautify the world through charity, fellowship, and virtuous living.",
    symbolism: "Represents the perfection of our work",
    color: "from-purple-400 to-purple-600",
    position: "right",
  },
];

const ThreePillarsSection: React.FC = () => {
  const { scrollYProgress } = useScroll();

  return (
    <section className="relative py-32 overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Texture Overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.3'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Floating Golden Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(30)].map((_, i) => (
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
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-6 py-2 mb-6 bg-amber-500/10 border border-amber-500/30 rounded-full backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300 text-sm font-medium tracking-wider uppercase">
              Our Foundation
            </span>
          </motion.div>

          {/* Title */}
          <h2 className="text-5xl md:text-6xl font-serif font-bold text-white mb-4">
            The Three
            <span className="block mt-2 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 text-transparent bg-clip-text">
              Great Pillars
            </span>
          </h2>

          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Supporting every lodge and illuminating the path of every Mason
          </p>

          {/* Decorative Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mt-8 w-full max-w-md mx-auto"
          >
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
            <Sparkles className="w-5 h-5 text-amber-400/50" />
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
          </motion.div>
        </motion.div>

        {/* Three Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
          {pillars.map((pillar, index) => {
            const delay = index * 0.2;

            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay, duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true, margin: "-100px" }}
                className="relative group"
              >
                {/* Pillar Container */}
                <div className="relative">
                  {/* Glow Effect */}
                  <motion.div
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                      scale: [0.95, 1.05, 0.95],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: index * 0.5,
                      ease: "easeInOut",
                    }}
                    className={`absolute inset-0 bg-gradient-to-b ${pillar.color} opacity-20 blur-3xl rounded-full`}
                  />

                  {/* Pillar Illustration */}
                  <motion.div
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    transition={{
                      delay: delay + 0.3,
                      duration: 1,
                      ease: "easeOut",
                    }}
                    viewport={{ once: true }}
                    className="relative mx-auto mb-8"
                    style={{ originY: 1 }}
                  >
                    {/* Capital (Top) */}
                    <div className="relative">
                      <div
                        className={`h-16 bg-gradient-to-b ${pillar.color} rounded-t-lg shadow-lg`}
                      >
                        {/* Ornate Capital Detail */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-t-lg" />
                        <div className="absolute bottom-0 left-0 right-0 h-2 bg-black/20" />
                      </div>
                    </div>

                    {/* Shaft (Body) */}
                    <div className="relative h-64">
                      <div
                        className={`h-full bg-gradient-to-b ${pillar.color} shadow-2xl relative overflow-hidden`}
                      >
                        {/* Pillar Texture */}
                        <div className="absolute inset-0 opacity-30">
                          {[...Array(8)].map((_, i) => (
                            <div
                              key={i}
                              className="h-8 border-b border-white/10"
                              style={{ marginTop: i * 32 }}
                            />
                          ))}
                        </div>

                        {/* Highlight */}
                        <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white/20 to-transparent" />

                        {/* Shadow */}
                        <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-black/30 to-transparent" />

                        {/* Rising Light Effect */}
                        <motion.div
                          animate={{
                            y: [256, 0],
                            opacity: [0, 0.6, 0],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: index * 0.8,
                            ease: "easeInOut",
                          }}
                          className={`absolute inset-x-0 h-32 bg-gradient-to-t ${pillar.color} blur-xl`}
                        />
                      </div>
                    </div>

                    {/* Base */}
                    <div className="relative">
                      <div
                        className={`h-20 bg-gradient-to-b ${pillar.color} rounded-b-lg shadow-2xl`}
                      >
                        <div className="absolute top-0 left-0 right-0 h-2 bg-white/10" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-b-lg" />
                      </div>
                    </div>

                    {/* Floating Icon */}
                    <motion.div
                      animate={{
                        y: [0, -10, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.3,
                        ease: "easeInOut",
                      }}
                      className="absolute -top-8 left-1/2 -translate-x-1/2"
                    >
                      <Sparkles
                        className={`w-8 h-8 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]`}
                      />
                    </motion.div>
                  </motion.div>

                  {/* Content Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: delay + 0.6, duration: 0.6 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                    className="bg-slate-800/60 backdrop-blur-md border border-amber-500/20 rounded-2xl p-8 shadow-2xl hover:shadow-amber-500/10 transition-all duration-300"
                  >
                    <h3 className="text-3xl font-serif font-bold text-white mb-2 text-center">
                      {pillar.title}
                    </h3>
                    <p className="text-amber-400 text-sm font-medium text-center mb-4 tracking-wide">
                      {pillar.subtitle}
                    </p>

                    <div className="h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent mb-4" />

                    <p className="text-slate-300 text-sm leading-relaxed mb-4 text-center">
                      {pillar.description}
                    </p>

                    <div className="bg-slate-900/50 rounded-lg p-4 border border-amber-500/10">
                      <p className="text-amber-200/70 text-xs italic text-center">
                        {pillar.symbolism}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Quote */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-20 max-w-3xl mx-auto"
        >
          <div className="bg-slate-800/40 backdrop-blur-md border border-amber-500/20 rounded-2xl p-8 shadow-2xl">
            <p className="text-amber-100 text-lg font-serif italic leading-relaxed">
              "As these three pillars support the lodge, so do Wisdom, Strength,
              and Beauty support and adorn the entire Masonic edifice."
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-500/30" />
              <Sparkles className="w-4 h-4 text-amber-400/50" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-500/30" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Edge Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
    </section>
  );
};

export default ThreePillarsSection;
