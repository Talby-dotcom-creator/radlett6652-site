import React, { useState, useEffect } from "react";
import { Users, Heart, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedCounter from "./AnimatedCounter";
import { optimizedApi as api } from "../lib/optimizedApi"; // or cmsApi if you're still using that
import LoadingSpinner from "./LoadingSpinner";

const AboutStatsSection: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const siteSettings = await api.getSiteSettings?.();
        const settingsMap: Record<string, string> = {};
        siteSettings?.forEach((setting: any) => {
          settingsMap[setting.setting_key] = setting.setting_value;
        });
        setSettings(settingsMap);
      } catch (err) {
        console.error("Error loading About stats:", err);
        setError("Failed to load lodge statistics");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const stats = [
    {
      icon: Calendar,
      value: parseInt(settings.founded_year || "1948"),
      suffix: "",
      label: "Founded",
      description: "Year of Consecration",
    },
    {
      icon: Users,
      value: parseInt(settings.active_members_count || "28"),
      suffix: "+",
      label: "Active Members",
      description: "Committed Brethren",
    },
    {
      icon: Heart,
      value: parseInt(settings.charities_supported_2025 || "12"),
      suffix: "",
      label: "Charities Supported",
      description: "During 2025",
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="py-16 bg-blue-900 text-white relative overflow-hidden"
    >
      {/* Soft background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(252,163,17,0.08),_transparent_70%)] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-10">
          <motion.h2
            className="text-3xl md:text-4xl font-heading font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 animate-goldShimmer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Our Heritage and Charity
          </motion.h2>
          <p className="text-lg text-neutral-100 max-w-2xl mx-auto">
            Celebrating our founding, our members, and our charitable work
          </p>
        </div>

        {loading ? (
          <LoadingSpinner subtle={true} className="text-white py-4" />
        ) : error ? (
          <div className="bg-primary-700 p-6 rounded-lg text-center">
            <p className="text-neutral-100">
              Statistics are currently unavailable
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center bg-oxford-blue/60 rounded-xl p-6 backdrop-blur-sm shadow-soft hover:shadow-medium hover:bg-oxford-blue/80 transition"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500/10 rounded-full mb-4">
                  <stat.icon
                    size={32}
                    className="text-yellow-500 animate-goldPulse"
                  />
                </div>
                <div className="text-3xl md:text-4xl font-heading font-bold mb-2 text-yellow-500">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <h3 className="text-lg font-semibold mb-1 text-neutral-50">
                  {stat.label}
                </h3>
                <p className="text-sm text-neutral-200">{stat.description}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default AboutStatsSection;
