// src/components/SectionBreather.tsx
import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface SectionBreatherProps {
  variant?: "default" | "ornate" | "minimal";
}

const SectionBreather: React.FC<SectionBreatherProps> = ({
  variant = "default",
}) => {
  if (variant === "ornate") {
    return (
      <div className="relative py-8 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        {/* Texture */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.3'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative container mx-auto px-6">
          {/* Ornate Divider */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-6"
          >
            {/* Left Line */}
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-amber-500/30" />

            {/* Center Ornament */}
            <div className="relative">
              {/* Rotating Circle */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 rounded-full border border-dashed border-amber-500/20"
              />

              {/* Center Sparkle */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Sparkles className="w-6 h-6 text-amber-400/60" />
              </motion.div>
            </div>

            {/* Right Line */}
            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-amber-500/30 to-amber-500/30" />
          </motion.div>
        </div>
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div className="relative py-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="container mx-auto px-6"
        >
          <div className="h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
        </motion.div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="relative py-8 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.03)_0%,transparent_70%)]" />

      <div className="relative container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-4"
        >
          {/* Left Line */}
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-amber-500/30" />

          {/* Center Icon */}
          <motion.div
            animate={{
              opacity: [0.4, 0.8, 0.4],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Sparkles className="w-5 h-5 text-amber-400/50" />
          </motion.div>

          {/* Right Line */}
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-amber-500/30 to-amber-500/30" />
        </motion.div>
      </div>
    </div>
  );
};

export default SectionBreather;
