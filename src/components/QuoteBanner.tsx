import React from "react";
import { motion } from "framer-motion";

interface QuoteBannerProps {
  text?: string;
  subtext?: string;
}

const QuoteBanner: React.FC<QuoteBannerProps> = ({
  text = "Freemasonry builds men — not in rank or wealth, but in character.",
  subtext = "A timeless path of integrity, service and brotherhood.",
}) => {
  return (
    <section className="relative py-10 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-900 text-center text-white overflow-hidden">
      {/* very soft candle-glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(252,163,17,0.08)_0%,transparent_65%)]" />
      <div className="relative z-10 container mx-auto px-4">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-xl md:text-2xl font-heading text-secondary-400 tracking-wide"
        >
          “{text}”
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-2 text-sm md:text-base text-neutral-200"
        >
          {subtext}
        </motion.p>
      </div>
    </section>
  );
};

export default QuoteBanner;
