import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Button from "./Button";

const WelcomeToOurLodge: React.FC = () => {
  return (
    <section className="relative py-24 bg-gradient-to-b from-white via-neutral-50 to-amber-50/20 text-center overflow-hidden">
      {/* Keyframes for shimmer + slow zoom + line draw */}
      <style>{`
        @keyframes shimmerSweep {
          0% { transform: translateX(-150%); opacity: 0; }
          8% { opacity: 0.15; }
          50% { opacity: 0.15; }
          100% { transform: translateX(150%); opacity: 0; }
        }
        @keyframes subtleZoom {
          0% { transform: scale(1); }
          50% { transform: scale(1.015); }
          100% { transform: scale(1); }
        }
        @keyframes drawLine {
          from { width: 0; opacity: 0; }
          to { width: 6rem; opacity: 1; }
        }
      `}</style>

      {/* Gentle radial golden glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.12),transparent_70%)] pointer-events-none" />

      {/* 🏛️ Image Banner */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        viewport={{ once: true }}
        className="relative max-w-4xl mx-auto mb-12 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-amber-100"
      >
        <div
          className="will-change-transform"
          style={{ animation: "subtleZoom 22s ease-in-out infinite" }}
        >
          <img
            src="https://neoquuejwgcqueqlcbwj.supabase.co/storage/v1/object/public/cms-media/radlett-%20lodge-%20outside.jpg"
            alt="Radlett Masonic Centre"
            className="w-full h-auto object-cover"
          />
        </div>
        {/* shimmer sweep */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.15) 55%, transparent 80%)",
            animation: "shimmerSweep 20s linear infinite",
            mixBlendMode: "screen",
          }}
        />
      </motion.div>

      {/* 🕊️ Text Content */}
      <div className="container mx-auto px-6 lg:px-16 max-w-4xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-heading font-bold text-primary-800 mb-4"
        >
          Welcome to Our Lodge
        </motion.h2>

        {/* Animated gold line */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          whileInView={{ width: "6rem", opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          viewport={{ once: true }}
          className="h-1 bg-gradient-to-r from-amber-400 to-yellow-600 rounded-full mx-auto mb-8"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="text-lg text-neutral-700 leading-relaxed mb-6"
        >
          <span className="font-semibold text-primary-700">Radlett Lodge</span>{" "}
          is a welcoming and forward-thinking Masonic Lodge where men from all
          walks of life come together in friendship, learning, and shared
          purpose. Our members represent a wide range of trades, skills, and
          professions — each contributing to a vibrant and supportive community
          built on respect, integrity, and service.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-lg text-neutral-700 leading-relaxed mb-6"
        >
          We understand that modern life can be demanding, so our Lodge meets on{" "}
          <span className="font-semibold text-primary-700">Saturdays</span>,
          offering a perfect balance between Masonic fellowship and weekday
          commitments. This flexibility enables both established and future
          members to participate fully while maintaining a healthy work-life
          balance.
        </motion.p>

        <motion.ul
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="list-disc list-inside text-neutral-700 text-lg mb-8 text-left md:text-center inline-block space-y-1"
        >
          <li>Warm, inclusive atmosphere — open to all backgrounds and ages</li>
          <li>Opportunities to grow in confidence, knowledge, and skill</li>
          <li>Tradition blended with a modern, approachable spirit</li>
        </motion.ul>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="italic text-secondary-600 text-lg mb-8"
        >
          Freemasonry that works for modern life.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <Link to="/about">
            <Button
              variant="outline"
              size="lg"
              className="border-amber-400 text-amber-600 hover:bg-amber-400 hover:text-white mt-8 mb-2 shadow-md"
            >
              Discover Us
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default WelcomeToOurLodge;
