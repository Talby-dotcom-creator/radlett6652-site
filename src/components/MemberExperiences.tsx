import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
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
    <section className="relative py-20 bg-[#fdfbf5] text-center overflow-hidden">
      {/* 📜 Background Texture */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "url('https://neoquuejwgcqueqlcbwj.supabase.co/storage/v1/object/public/cms-media/images%20/parchment-light.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>

      <div className="relative z-10 container mx-auto px-4">
        {/* ✨ Gold Title at Top with Depth */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-heading font-bold mb-14
                     bg-gradient-to-b from-[#e6d18a] to-[#b4974a] text-transparent bg-clip-text
                     drop-shadow-[0_3px_3px_rgba(0,0,0,0.3)]"
          style={{
            textShadow:
              "0 1px 1px rgba(255,255,255,0.6), 0 3px 6px rgba(0,0,0,0.25)",
            letterSpacing: "0.05em",
          }}
        >
          Member Experiences
        </motion.h2>

        {/* Testimonials */}
        {loading ? (
          <p className="text-neutral-600 mt-8">Loading experiences...</p>
        ) : testimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
            {testimonials.map((t, index) => (
              <motion.div
                key={t.id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative bg-white/90 rounded-2xl shadow-lg border border-yellow-600/20 overflow-hidden
                           transform transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl hover:border-yellow-600/40"
                style={{
                  backgroundImage:
                    "url('https://neoquuejwgcqueqlcbwj.supabase.co/storage/v1/object/public/cms-media/images%20/parchment-light.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Decorative Top Accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500" />

                {/* Content */}
                <div className="p-8">
                  <Users className="w-10 h-10 text-yellow-500 mx-auto mb-4 opacity-70" />
                  <p className="italic text-neutral-800 mb-6">
                    “
                    {t.quote ||
                      t.content ||
                      "Freemasonry has given me a sense of purpose and belonging."}
                    ”
                  </p>
                  <h4 className="text-lg font-semibold text-primary-700">
                    {t.name || "A Proud Member"}
                  </h4>
                  {t.role && (
                    <p className="text-sm text-neutral-600 mt-1">{t.role}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-neutral-700 mt-8">
            No member experiences yet — check back soon.
          </p>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <Link to="/about">
            <Button
              variant="primary"
              size="lg"
              className="hover:shadow-[0_0_15px_rgba(255,215,0,0.6)]"
            >
              Curious? Discover what it means to belong.
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default MemberExperiences;
