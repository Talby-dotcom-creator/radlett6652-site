import React, { useState, useEffect } from "react";
import { Users, Calendar, Heart, Award } from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";
import { motion } from "framer-motion";
import { cmsApi } from "../lib/cmsApi";
import LoadingSpinner from "./LoadingSpinner";

const StatsSection: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStatsSettings = async () => {
      try {
        const siteSettings = await cmsApi.getSiteSettings();
        const settingsMap: Record<string, string> = {};
        siteSettings.forEach((setting) => {
          settingsMap[setting.setting_key] = setting.setting_value;
        });
        setSettings(settingsMap);
      } catch (error) {
        console.error("Error loading stats settings:", error);
        setError("Failed to load statistics");
      } finally {
        setLoading(false);
      }
    };
    loadStatsSettings();
  }, []);

  const stats = [
    {
      icon: Users,
      value: parseInt(settings.active_members_count || "28"),
      suffix: "+",
      label: "Active Members",
      description: "Dedicated Freemasons",
    },
    {
      icon: Calendar,
      value: parseInt(settings.years_of_service || "76"),
      suffix: "",
      label: "Years of Service",
      description: `Since ${settings.founded_year || "1948"}`,
    },
    {
      icon: Heart,
      value: settings.charity_raised_annually?.replace(/[^0-9]/g, "")
        ? parseInt(settings.charity_raised_annually.replace(/[^0-9]/g, ""))
        : 52,
      suffix: settings.charity_raised_annually?.includes("M+") ? "M+" : "k+",
      label: "Charitable Donations",
      description: "Annually across UGLE",
    },
    {
      icon: Award,
      value: parseInt(settings.regular_meetings_count || "5"),
      suffix: "",
      label: "Regular Meetings",
      description: "Members Only",
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="py-20 bg-primary-800 text-white relative overflow-hidden"
    >
      {/* Soft golden radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(252,163,17,0.1),_transparent_70%)] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-12">
          <motion.h2
            className="text-3xl md:text-4xl font-heading font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-secondary-400 via-secondary-200 to-secondary-400 animate-goldShimmer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Our Lodge in Numbers
          </motion.h2>
          <p className="text-lg text-neutral-100 max-w-2xl mx-auto">
            A reflection of our dedication to brotherhood, charity, and community service
          </p>
        </div>

        {loading ? (
          <LoadingSpinner subtle={true} className="text-white py-4" />
        ) : error ? (
          <div className="bg-primary-700 p-6 rounded-lg text-center">
            <p className="text-neutral-100">Statistics are currently unavailable</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center bg-primary-900/40 rounded-xl p-6 backdrop-blur-sm shadow-soft hover:shadow-medium hover:bg-primary-900/60 transition"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary-500/10 rounded-full mb-4">
                  <stat.icon
                    size={32}
                    className="text-secondary-400 animate-goldPulse"
                  />
                </div>
                <div className="text-3xl md:text-4xl font-heading font-bold mb-2 text-secondary-400">
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

export default StatsSection;
