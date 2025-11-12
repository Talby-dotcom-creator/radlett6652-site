import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Quote, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "./Button";
import { optimizedApi } from "../lib/optimizedApi";
import { Testimonial } from "../types";

const MemberExperiences: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const data = await optimizedApi.getTestimonials();
        setTestimonials(data || []);
      } catch (err) {
        console.error("Error loading testimonials:", err);
      } finally {
        setLoading(false);
      }
    };

    loadTestimonials();
  }, []);

  return (
    <section className="relative py-24 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Texture Overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.3'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Floating Golden Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-400/30 rounded-full"
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
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
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
              Voices from the Craft
            </span>
          </motion.div>

          {/* Title */}
          <h2 className="text-5xl md:text-6xl font-serif font-bold text-white mb-4">
            Member
            <span className="block mt-2 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 text-transparent bg-clip-text">
              Experiences
            </span>
          </h2>

          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Hear from brothers who walk this timeless path
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

        {/* Testimonials */}
        {loading ? (
          <p className="text-center text-slate-400 mt-8">
            Loading experiences...
          </p>
        ) : testimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {testimonials.map((t, index) => (
              <motion.div
                key={t.id || index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -8 }}
                className="relative group"
              >
                {/* Glow Effect */}
                <motion.div
                  animate={{
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.5,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 bg-gradient-to-b from-amber-500/20 to-transparent blur-2xl rounded-2xl"
                />

                {/* Card */}
                <div className="relative bg-slate-800/60 backdrop-blur-md border border-amber-500/20 rounded-2xl overflow-hidden shadow-2xl hover:shadow-amber-500/10 transition-all duration-300">
                  {/* Corner Flourishes */}
                  <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-amber-500/30 rounded-tl-2xl" />
                  <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-amber-500/30 rounded-tr-2xl" />
                  <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-amber-500/30 rounded-bl-2xl" />
                  <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-amber-500/30 rounded-br-2xl" />

                  {/* Top Golden Accent */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

                  {/* Content */}
                  <div className="relative p-8">
                    {/* Quote Icon */}
                    <motion.div
                      animate={{
                        rotate: [0, 5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.3,
                        ease: "easeInOut",
                      }}
                      className="absolute top-6 right-6 opacity-10"
                    >
                      <Quote className="w-16 h-16 text-amber-400" />
                    </motion.div>

                    {/* Member Photo/Icon */}
                    <div className="flex justify-center mb-6">
                      <div className="relative">
                        {/* Circular Frame */}
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-1 shadow-lg">
                          <div className="w-full h-full rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
                            <Users className="w-12 h-12 text-amber-400/80" />
                          </div>
                        </div>

                        {/* Glow */}
                        <motion.div
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: index * 0.4,
                            ease: "easeInOut",
                          }}
                          className="absolute inset-0 bg-amber-400/30 rounded-full blur-xl -z-10"
                        />
                      </div>
                    </div>

                    {/* Quote Text */}
                    <div className="relative mb-6">
                      <p className="text-slate-300 text-base leading-relaxed italic">
                        "
                        {t.quote ||
                          t.content ||
                          "Freemasonry has given me a sense of purpose and belonging."}
                        "
                      </p>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent mb-4" />

                    {/* Author Info */}
                    <div className="text-center">
                      <h4 className="text-lg font-serif font-semibold text-amber-400 mb-1">
                        {t.name || "A Proud Brother"}
                      </h4>
                      {t.role && (
                        <p className="text-sm text-slate-400">{t.role}</p>
                      )}
                    </div>

                    {/* Bottom Sparkle */}
                    <motion.div
                      animate={{
                        opacity: [0.3, 0.7, 0.3],
                        rotate: [0, 180, 360],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        delay: index * 0.5,
                        ease: "linear",
                      }}
                      className="absolute bottom-4 left-1/2 -translate-x-1/2"
                    >
                      <Sparkles className="w-5 h-5 text-amber-400/40" />
                    </motion.div>
                  </div>

                  {/* Bottom Golden Accent */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-400 mt-8">
            No member experiences yet — check back soon.
          </p>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <Link to="/about">
            <Button
              variant="primary"
              size="lg"
              className="hover:shadow-[0_0_20px_rgba(251,191,36,0.6)] transition-all duration-300"
            >
              Curious? Discover what it means to belong.
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Bottom Edge Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
    </section>
  );
};

export default MemberExperiences;
