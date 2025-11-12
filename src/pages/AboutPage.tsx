// src/pages/AboutPage.tsx - Enhanced Version with Hero Image
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../components/Button";
import OfficerCard from "../components/OfficerCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { optimizedApi } from "../lib/optimizedApi";
import { CMSOfficer } from "../types";
import {
  Sparkles,
  Users,
  Calendar,
  Award,
  BookOpen,
  Heart,
  ChevronRight,
  Shield,
  HandHeart,
  Trophy,
} from "lucide-react";

const AboutPage: React.FC = () => {
  const [officers, setOfficers] = useState<CMSOfficer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOfficers = async () => {
      try {
        setLoading(true);
        setError(null);
        const officersData = await optimizedApi.getOfficers();
        const active = officersData
          .filter((o: any) => o.is_active !== false)
          .sort((a: any, b: any) => a.sort_order - b.sort_order);
        setOfficers(active);
      } catch (err) {
        console.error("Error loading officers:", err);
        setError("Failed to load officers.");
        setOfficers([]);
      } finally {
        setLoading(false);
      }
    };
    loadOfficers();
  }, []);

  const convertOfficerData = (o: CMSOfficer) => ({
    id: o.id,
    position: o.position,
    name: o.full_name || o.name,
    image: o.image_url ?? undefined,
  });

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Premium Dark Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950" />

      {/* Texture Overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.3'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Floating Book Icons Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute opacity-5"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.03, 0.08, 0.03],
              rotate: [0, 15, 0],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          >
            <BookOpen className="w-32 h-32 text-amber-400" />
          </motion.div>
        ))}
      </div>

      {/* Golden Dust Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -150, 0],
              opacity: [0, 1, 0],
              scale: [0, 2, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative">
        {/* Hero Section with Lodge Interior Image */}
        <section className="relative h-[70vh] min-h-[600px] overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src="https://neoquuejwgcqueqlcbwj.supabase.co/storage/v1/object/public/cms-media/banners/inside-lodge.jpg"
              alt="Radlett Lodge Temple Interior"
              className="w-full h-full object-cover"
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/60 to-slate-900/90" />
          </div>

          {/* Hero Content */}
          <div className="relative h-full flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center"
              >
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-6 py-2 mb-6 bg-amber-500/20 border border-amber-500/40 rounded-full backdrop-blur-md"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-300 text-sm font-medium tracking-wider uppercase">
                    Since 1948
                  </span>
                </motion.div>

                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="text-5xl md:text-7xl font-serif font-bold mb-6"
                >
                  <span className="text-white">Radlett Lodge </span>
                  <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 text-transparent bg-clip-text">
                    No. 6652
                  </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="text-xl md:text-2xl text-amber-100/80 max-w-3xl mx-auto leading-relaxed"
                >
                  A distinguished Masonic Lodge in Hertfordshire, dedicated to
                  the timeless principles of Freemasonry for over 75 years
                </motion.p>

                {/* Caption for Interior */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="mt-8 text-amber-400/60 text-sm italic"
                >
                  Our Temple Room - Where tradition meets fellowship
                </motion.p>
              </motion.div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-amber-400/60 text-sm"
            >
              ↓ Scroll to explore our history
            </motion.div>
          </motion.div>
        </section>

        {/* Our History Section - Consolidated Card */}
        <section className="relative py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                <span className="text-white">Our </span>
                <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 text-transparent bg-clip-text">
                  History
                </span>
              </h2>
              <p className="text-amber-100/70 text-lg max-w-3xl mx-auto">
                A legacy of brotherhood spanning over seven decades
              </p>
            </motion.div>

            {/* Consolidated History Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-6xl mx-auto"
            >
              <div className="relative bg-slate-800/40 backdrop-blur-md border-2 border-amber-500/30 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden">
                {/* Background glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />

                <div className="relative z-10 grid lg:grid-cols-3 gap-12">
                  {/* Left Column - Admiral Image */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="lg:col-span-1"
                  >
                    <div className="sticky top-8">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-2xl blur-xl" />
                        <div className="relative overflow-hidden rounded-2xl border-2 border-amber-500/30">
                          <img
                            src="https://neoquuejwgcqueqlcbwj.supabase.co/storage/v1/object/public/cms-media/images/Admiral%20Sir%20Lionel%20Halsey.webp"
                            alt="Admiral Sir Lionel Halsey"
                            className="w-full h-auto"
                          />
                        </div>
                      </div>
                      <div className="mt-4 text-center">
                        <h3 className="text-xl font-serif font-bold text-amber-300">
                          Admiral Sir Lionel Halsey
                        </h3>
                        <p className="text-amber-400/80 text-sm">
                          RW Provincial Grand Master, 1948
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Right Column - Timeline & History Content */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="lg:col-span-2 space-y-8"
                  >
                    {/* Founding Story */}
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center border-2 border-slate-900 shadow-lg"
                        >
                          <Calendar className="w-6 h-6 text-white" />
                        </motion.div>
                        <div>
                          <h3 className="text-2xl font-serif font-bold text-amber-300">
                            The Founding
                          </h3>
                          <p className="text-amber-400/60 text-sm">
                            May 31, 1948
                          </p>
                        </div>
                      </div>
                      <p className="text-amber-100/70 leading-relaxed mb-4">
                        Radlett Lodge No. 6652 was founded by a diverse group of
                        friends residing in Radlett in the aftermath of World
                        War II. The founding members included a doctor, a local
                        businessman, a farmer, and a Savile Row tailor, among
                        others. Facing a significant waiting list at the
                        existing local lodge, they petitioned to form a new
                        lodge that would meet on Saturdays.
                      </p>
                      <p className="text-amber-100/70 leading-relaxed mb-4">
                        With Elstree Lodge as its sponsor, Radlett Lodge was
                        consecrated on May 31, 1948, by Admiral Sir Lionel
                        Halsey, the Right Worshipful Provincial Grand Master.
                      </p>
                      <p className="text-amber-100/70 leading-relaxed mb-4">
                        This momentous occasion marked the beginning of our
                        lodge's distinguished history, establishing a new home
                        for Masonic fellowship and tradition in Hertfordshire
                        that continues to thrive today.
                      </p>
                      <div className="flex items-center gap-2 text-amber-400 text-sm">
                        <Sparkles className="w-4 h-4" />
                        <span>Consecration Ceremony • May 31, 1948</span>
                      </div>
                    </div>

                    {/* Timeline Divider */}
                    <div className="relative py-4">
                      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-500 via-amber-500/50 to-amber-500/20" />

                      {/* Timeline Points */}
                      <div className="space-y-6">
                        {/* 1948-1960 */}
                        <div className="relative pl-16">
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                            className="absolute left-[18px] top-2 w-3 h-3 rounded-full bg-amber-500 shadow-lg shadow-amber-500/50"
                          />
                          <h4 className="text-lg font-bold text-amber-300 mb-1">
                            1948 - 1960
                          </h4>
                          <p className="text-sm font-medium text-amber-400/80 mb-2">
                            Founding Years
                          </p>
                          <p className="text-amber-100/70 text-sm leading-relaxed">
                            Established as a beacon of Masonic tradition in
                            Hertfordshire, our lodge welcomed its first members
                            and began building the foundation of fellowship that
                            continues today.
                          </p>
                        </div>

                        {/* 1960s-2000s */}
                        <div className="relative pl-16">
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: 0.5,
                            }}
                            className="absolute left-[18px] top-2 w-3 h-3 rounded-full bg-amber-500 shadow-lg shadow-amber-500/50"
                          />
                          <h4 className="text-lg font-bold text-amber-300 mb-1">
                            1960s - 2000s
                          </h4>
                          <p className="text-sm font-medium text-amber-400/80 mb-2">
                            Growth & Evolution
                          </p>
                          <p className="text-amber-100/70 text-sm leading-relaxed">
                            Through decades of growth, we welcomed countless
                            brethren from diverse backgrounds, achieving
                            Provincial and Grand Lodge honours while maintaining
                            our commitment to ritual excellence and Masonic
                            education.
                          </p>
                        </div>

                        {/* 21st Century */}
                        <div className="relative pl-16">
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: 1,
                            }}
                            className="absolute left-[18px] top-2 w-3 h-3 rounded-full bg-amber-500 shadow-lg shadow-amber-500/50"
                          />
                          <h4 className="text-lg font-bold text-amber-300 mb-1">
                            21st Century
                          </h4>
                          <p className="text-sm font-medium text-amber-400/80 mb-2">
                            Modern Era
                          </p>
                          <p className="text-amber-100/70 text-sm leading-relaxed">
                            Today, we continue to uphold Masonic values while
                            embracing the future, remaining a vibrant community
                            welcoming new brethren. Our charitable work and
                            community connections remain at the heart of our
                            mission.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Key Milestones */}
                    <div className="pt-4 border-t border-amber-500/20">
                      <h3 className="text-xl font-serif font-bold text-amber-300 mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        Key Milestones
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {[
                          { year: "1948", event: "Lodge Consecration" },
                          { year: "1973", event: "25th Anniversary" },
                          { year: "1998", event: "Golden Jubilee" },
                          { year: "2023", event: "75th Anniversary" },
                        ].map((milestone, index) => (
                          <motion.div
                            key={milestone.year}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                            className="flex items-center gap-3 bg-slate-800/30 rounded-lg p-3 border border-amber-500/10"
                          >
                            <div className="text-2xl font-bold text-amber-400">
                              {milestone.year}
                            </div>
                            <div className="text-amber-100/70 text-sm">
                              {milestone.event}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* The Lodge Today */}
                    <div className="pt-8 border-t border-amber-500/20 mt-8">
                      <h3 className="text-2xl font-serif font-bold text-amber-300 mb-6">
                        The Lodge Today
                      </h3>

                      {/* Saturday Meetings */}
                      <div className="mb-6">
                        <h4 className="text-lg font-bold text-amber-300 mb-2 flex items-center gap-2">
                          <Calendar className="w-5 h-5" />
                          Saturday Meetings, Perfect for Busy Schedules
                        </h4>
                        <p className="text-amber-100/70 text-sm leading-relaxed">
                          For those with busy workweeks, our Saturday meetings
                          offer the ideal opportunity to participate in the
                          Masonic community without compromising on your weekday
                          commitments.
                        </p>
                      </div>

                      {/* Welcoming Community */}
                      <div>
                        <h4 className="text-lg font-bold text-amber-300 mb-2 flex items-center gap-2">
                          <Users className="w-5 h-5" />A Welcoming Community
                          from All Walks of Life
                        </h4>
                        <p className="text-amber-100/70 text-sm leading-relaxed">
                          Since our founding, Radlett Lodge has consistently
                          attracted members from a variety of backgrounds. Men
                          from all different working backgrounds join us. Our
                          strength lies in creating a cohesive, friendly group
                          where every member is valued and encouraged to
                          contribute.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* What is Freemasonry Section - Enhanced with Illuminated Cards */}
        <section className="relative py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                <span className="text-white">About </span>
                <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 text-transparent bg-clip-text">
                  Freemasonry
                </span>
              </h2>
              <p className="text-amber-100/70 text-lg max-w-3xl mx-auto">
                Understanding the principles that guide us
              </p>
            </motion.div>

            {/* Three Illuminated Cards */}
            <div className="grid md:grid-cols-3 gap-8">
              {/* Card 1: Who We Are */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100" />

                <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-md border border-amber-500/20 rounded-2xl p-8 shadow-xl">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                  <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-amber-400/30 rounded-tl-lg" />
                  <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-amber-400/30 rounded-tr-lg" />

                  <motion.div
                    animate={{ rotate: [0, 5, 0] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="mb-6"
                  >
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-full flex items-center justify-center border border-amber-500/30">
                      <Users className="w-8 h-8 text-amber-400" />
                    </div>
                  </motion.div>

                  <h3 className="text-2xl font-serif font-bold text-white mb-4 text-center">
                    Who We Are
                  </h3>

                  <p className="text-amber-100/70 text-center leading-relaxed">
                    Freemasons are a diverse group of men from all walks of life
                    who share common values of integrity, kindness, honesty, and
                    fairness. We come together to build friendships, support
                    each other, and contribute to our communities.
                  </p>

                  <motion.div
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="mt-6 text-center text-2xl text-amber-400/30"
                  >
                    🤝
                  </motion.div>

                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                </div>
              </motion.div>

              {/* Card 2: What We Do */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100" />

                <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-md border border-amber-500/20 rounded-2xl p-8 shadow-xl">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                  <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-amber-400/30 rounded-tl-lg" />
                  <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-amber-400/30 rounded-tr-lg" />

                  <motion.div
                    animate={{ rotate: [0, 5, 0] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5,
                    }}
                    className="mb-6"
                  >
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-full flex items-center justify-center border border-amber-500/30">
                      <Award className="w-8 h-8 text-amber-400" />
                    </div>
                  </motion.div>

                  <h3 className="text-2xl font-serif font-bold text-white mb-4 text-center">
                    What We Do
                  </h3>

                  <p className="text-amber-100/70 text-center leading-relaxed">
                    We meet regularly in our Lodge to conduct ceremonial rituals
                    that teach moral lessons, engage in social activities,
                    support charitable causes, and work together on personal
                    development. We aim to make a positive impact in our local
                    communities and the wider world.
                  </p>

                  <motion.div
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1,
                    }}
                    className="mt-6 text-center text-2xl text-amber-400/30"
                  >
                    🔺
                  </motion.div>

                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                </div>
              </motion.div>

              {/* Card 3: Our Principles */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100" />

                <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-md border border-amber-500/20 rounded-2xl p-8 shadow-xl">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                  <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-amber-400/30 rounded-tl-lg" />
                  <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-amber-400/30 rounded-tr-lg" />

                  <motion.div
                    animate={{ rotate: [0, 5, 0] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1,
                    }}
                    className="mb-6"
                  >
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-full flex items-center justify-center border border-amber-500/30">
                      <Heart className="w-8 h-8 text-amber-400" />
                    </div>
                  </motion.div>

                  <h3 className="text-2xl font-serif font-bold text-white mb-4 text-center">
                    Our Principles
                  </h3>

                  <p className="text-amber-100/70 text-center leading-relaxed">
                    Freemasonry is founded on the principles of Brotherly Love,
                    Relief, and Truth. We practice charity, promote tolerance,
                    maintain high moral standards, and encourage members to be
                    good citizens who contribute positively to society.
                  </p>

                  <motion.div
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1.5,
                    }}
                    className="mt-6 text-center text-2xl text-amber-400/30"
                  >
                    ❤️
                  </motion.div>

                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="relative py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                <span className="text-white">Our </span>
                <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 text-transparent bg-clip-text">
                  Values
                </span>
              </h2>
              <p className="text-amber-100/70 text-lg max-w-3xl mx-auto">
                The principles that guide our brotherhood
              </p>
            </motion.div>

            {/* Six Value Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Integrity */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100" />

                <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-md border border-amber-500/20 rounded-2xl p-8 shadow-xl h-full">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />

                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="mb-6"
                  >
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-full flex items-center justify-center border border-blue-500/30">
                      <Shield className="w-8 h-8 text-blue-400" />
                    </div>
                  </motion.div>

                  <h3 className="text-2xl font-serif font-bold text-white mb-4 text-center">
                    Integrity
                  </h3>

                  <p className="text-amber-100/70 text-center leading-relaxed">
                    We uphold the highest moral standards in all our actions,
                    both within and outside the lodge.
                  </p>

                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
                </div>
              </motion.div>

              {/* Respect */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100" />

                <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-md border border-amber-500/20 rounded-2xl p-8 shadow-xl h-full">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />

                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.3,
                    }}
                    className="mb-6"
                  >
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-full flex items-center justify-center border border-purple-500/30">
                      <HandHeart className="w-8 h-8 text-purple-400" />
                    </div>
                  </motion.div>

                  <h3 className="text-2xl font-serif font-bold text-white mb-4 text-center">
                    Respect
                  </h3>

                  <p className="text-amber-100/70 text-center leading-relaxed">
                    We treat all individuals with dignity and honor, recognizing
                    the worth of every person.
                  </p>

                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
                </div>
              </motion.div>

              {/* Excellence */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100" />

                <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-md border border-amber-500/20 rounded-2xl p-8 shadow-xl h-full">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.6,
                    }}
                    className="mb-6"
                  >
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-full flex items-center justify-center border border-amber-500/30">
                      <Trophy className="w-8 h-8 text-amber-400" />
                    </div>
                  </motion.div>

                  <h3 className="text-2xl font-serif font-bold text-white mb-4 text-center">
                    Excellence
                  </h3>

                  <p className="text-amber-100/70 text-center leading-relaxed">
                    We strive for personal improvement and excellence in our
                    Masonic practice and daily lives.
                  </p>

                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                </div>
              </motion.div>

              {/* Tradition */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100" />

                <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-md border border-amber-500/20 rounded-2xl p-8 shadow-xl h-full">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />

                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.9,
                    }}
                    className="mb-6"
                  >
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-full flex items-center justify-center border border-emerald-500/30">
                      <BookOpen className="w-8 h-8 text-emerald-400" />
                    </div>
                  </motion.div>

                  <h3 className="text-2xl font-serif font-bold text-white mb-4 text-center">
                    Tradition
                  </h3>

                  <p className="text-amber-100/70 text-center leading-relaxed">
                    We honor and preserve the rich heritage and time-honored
                    rituals of Freemasonry.
                  </p>

                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
                </div>
              </motion.div>

              {/* Fellowship */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100" />

                <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-md border border-amber-500/20 rounded-2xl p-8 shadow-xl h-full">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />

                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1.2,
                    }}
                    className="mb-6"
                  >
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 rounded-full flex items-center justify-center border border-cyan-500/30">
                      <Users className="w-8 h-8 text-cyan-400" />
                    </div>
                  </motion.div>

                  <h3 className="text-2xl font-serif font-bold text-white mb-4 text-center">
                    Fellowship
                  </h3>

                  <p className="text-amber-100/70 text-center leading-relaxed">
                    We foster deep bonds of brotherhood and friendship among our
                    members.
                  </p>

                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
                </div>
              </motion.div>

              {/* Service */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 to-rose-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100" />

                <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-md border border-amber-500/20 rounded-2xl p-8 shadow-xl h-full">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent" />

                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1.5,
                    }}
                    className="mb-6"
                  >
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-rose-500/20 to-rose-600/20 rounded-full flex items-center justify-center border border-rose-500/30">
                      <Heart className="w-8 h-8 text-rose-400" />
                    </div>
                  </motion.div>

                  <h3 className="text-2xl font-serif font-bold text-white mb-4 text-center">
                    Service
                  </h3>

                  <p className="text-amber-100/70 text-center leading-relaxed">
                    We are committed to charitable work and serving our
                    community with compassion.
                  </p>

                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Current Lodge Officers Section */}
        <section className="relative py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                <span className="text-white">Current Lodge </span>
                <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 text-transparent bg-clip-text">
                  Officers
                </span>
              </h2>
              <p className="text-amber-100/70 text-lg max-w-3xl mx-auto">
                Meet the Brethren who lead and serve Radlett Lodge No. 6652
              </p>
            </motion.div>

            {error && (
              <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-6 text-red-300 text-center">
                {error}
              </div>
            )}

            {loading ? (
              <LoadingSpinner subtle={true} className="py-4" />
            ) : officers.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
              >
                {officers.map((o, index) => (
                  <motion.div
                    key={o.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <OfficerCard officer={convertOfficerData(o)} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="bg-slate-800/30 backdrop-blur-md border border-amber-500/10 rounded-2xl p-12 text-center">
                <Users className="w-16 h-16 mx-auto mb-4 text-amber-400/30" />
                <p className="text-amber-100/50 text-lg">No officers listed.</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
                <span className="text-white">Experience the </span>
                <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 text-transparent bg-clip-text">
                  Brotherhood
                </span>
              </h2>
              <p className="text-xl text-amber-100/70 max-w-3xl mx-auto mb-10 leading-relaxed">
                Radlett Lodge offers a welcoming environment for men seeking
                personal growth, fellowship, and the opportunity to make a
                positive difference.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Link to="/join">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button variant="primary" size="lg" className="group">
                      <span>Begin Your Journey</span>
                      <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>
                </Link>

                <Link to="/contact">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button variant="outline" size="lg">
                      Contact Our Secretary
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default AboutPage;
