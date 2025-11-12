// src/components/UpcomingEventSpotlight.tsx
import React, { useEffect, useState } from "react";
import { Calendar, MapPin, Clock, Sparkles, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { optimizedApi as api } from "../lib/optimizedApi";
import { LodgeEvent } from "../types";

const UpcomingEventSpotlight: React.FC = () => {
  const [nextEvent, setNextEvent] = useState<LodgeEvent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNextEvent = async () => {
      try {
        const events = await api.getEvents();
        const now = new Date();
        const upcoming = events
          .filter(
            (e: LodgeEvent) => !!e.event_date && new Date(e.event_date) > now
          )
          .sort((a: LodgeEvent, b: LodgeEvent) => {
            const at = a.event_date ? new Date(a.event_date).getTime() : 0;
            const bt = b.event_date ? new Date(b.event_date).getTime() : 0;
            return at - bt;
          });

        setNextEvent(upcoming[0] || null);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    loadNextEvent();
  }, []);

  const daysUntilEvent = (dateString: string) => {
    const eventDate = new Date(dateString);
    const now = new Date();
    const diffTime = eventDate.getTime() - now.getTime();
    return Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 0);
  };

  return (
    <section className="relative py-24 bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 overflow-hidden">
      {/* Texture Overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.3'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.08)_0%,transparent_60%)]" />

      {/* Floating Calendar Icons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute opacity-5"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.03, 0.08, 0.03],
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: 6 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          >
            <Calendar className="w-24 h-24 text-amber-400" />
          </motion.div>
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
            <Calendar className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300 text-sm font-medium tracking-wider uppercase">
              Next Gathering
            </span>
          </motion.div>

          {/* Title */}
          <h2 className="text-5xl md:text-6xl font-serif font-bold text-white mb-4">
            Upcoming Event
            <span className="block mt-2 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 text-transparent bg-clip-text">
              Spotlight
            </span>
          </h2>

          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Mark your calendar for our next lodge gathering
          </p>
        </motion.div>

        {/* Content */}
        {loading ? (
          <p className="text-center text-slate-400">Loading event...</p>
        ) : nextEvent ? (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            {/* Main Event Card */}
            <div className="relative group">
              {/* Pulsing Glow */}
              <motion.div
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 blur-3xl rounded-3xl"
              />

              {/* Card */}
              <div className="relative bg-slate-800/60 backdrop-blur-md border-2 border-amber-500/30 rounded-3xl overflow-hidden shadow-2xl">
                {/* Top Golden Bar */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

                {/* Corner Decorations */}
                <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-amber-500/40 rounded-tl-3xl" />
                <div className="absolute top-0 right-0 w-24 h-24 border-t-4 border-r-4 border-amber-500/40 rounded-tr-3xl" />

                <div className="grid md:grid-cols-[300px_1fr] gap-0">
                  {/* Left: Countdown Circle */}
                  <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 p-10 flex flex-col items-center justify-center border-r border-amber-500/20">
                    {/* Rotating Ring */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute inset-10 border-2 border-dashed border-amber-500/20 rounded-full"
                    />

                    {/* Countdown Number */}
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring", bounce: 0.5 }}
                      viewport={{ once: true }}
                      className="relative"
                    >
                      <div className="text-center">
                        <div className="text-7xl md:text-8xl font-bold bg-gradient-to-b from-amber-300 to-amber-600 text-transparent bg-clip-text mb-2">
                          {nextEvent.event_date
                            ? daysUntilEvent(nextEvent.event_date)
                            : "?"}
                        </div>
                        <div className="text-amber-400 text-lg font-medium uppercase tracking-wider">
                          {nextEvent.event_date &&
                          daysUntilEvent(nextEvent.event_date) === 1
                            ? "Day"
                            : "Days"}
                        </div>
                        <div className="text-slate-400 text-sm mt-1">to go</div>
                      </div>

                      {/* Sparkle Accents */}
                      <motion.div
                        animate={{
                          rotate: [0, 180, 360],
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="absolute -top-4 -right-4"
                      >
                        <Sparkles className="w-8 h-8 text-amber-400/50" />
                      </motion.div>
                      <motion.div
                        animate={{
                          rotate: [360, 180, 0],
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "linear",
                          delay: 2,
                        }}
                        className="absolute -bottom-4 -left-4"
                      >
                        <Sparkles className="w-8 h-8 text-amber-400/50" />
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Right: Event Details */}
                  <div className="p-10">
                    {/* Event Title */}
                    <h3 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6 leading-tight">
                      {nextEvent.title}
                    </h3>

                    {/* Event Details Grid */}
                    <div className="space-y-4 mb-8">
                      {/* Date */}
                      {nextEvent.event_date && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 }}
                          viewport={{ once: true }}
                          className="flex items-start gap-4"
                        >
                          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                            <Calendar className="w-6 h-6 text-amber-400" />
                          </div>
                          <div>
                            <div className="text-sm text-slate-400 uppercase tracking-wide mb-1">
                              Date
                            </div>
                            <div className="text-lg text-slate-200 font-medium">
                              {new Date(
                                nextEvent.event_date
                              ).toLocaleDateString("en-GB", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Time */}
                      {nextEvent.event_date && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 }}
                          viewport={{ once: true }}
                          className="flex items-start gap-4"
                        >
                          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                            <Clock className="w-6 h-6 text-amber-400" />
                          </div>
                          <div>
                            <div className="text-sm text-slate-400 uppercase tracking-wide mb-1">
                              Time
                            </div>
                            <div className="text-lg text-slate-200 font-medium">
                              {new Date(
                                nextEvent.event_date
                              ).toLocaleTimeString("en-GB", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Location */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        viewport={{ once: true }}
                        className="flex items-start gap-4"
                      >
                        <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-6 h-6 text-amber-400" />
                        </div>
                        <div>
                          <div className="text-sm text-slate-400 uppercase tracking-wide mb-1">
                            Location
                          </div>
                          <div className="text-lg text-slate-200 font-medium">
                            {nextEvent.location ?? "Venue TBA"}
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* CTA Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      viewport={{ once: true }}
                    >
                      <Link
                        to="/events"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-semibold rounded-full shadow-lg hover:shadow-amber-500/50 transition-all duration-300 group"
                      >
                        <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        View All Events
                        <Sparkles className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                      </Link>
                    </motion.div>
                  </div>
                </div>

                {/* Bottom Golden Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto bg-slate-800/60 backdrop-blur-md border border-amber-500/20 rounded-2xl py-16 px-10 text-center"
          >
            <Calendar className="w-16 h-16 text-amber-400/50 mx-auto mb-6" />
            <h3 className="text-2xl font-serif font-semibold text-white mb-3">
              No Upcoming Events
            </h3>
            <p className="text-slate-400 mb-6">
              Please check back soon for our next Lodge meeting or social
              gathering.
            </p>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-amber-500/30 text-amber-400 hover:bg-amber-500/10 rounded-full font-medium transition-all"
            >
              View Past Events
            </Link>
          </motion.div>
        )}

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center text-slate-400 italic text-sm"
        >
          Counting down to another evening of friendship and fellowship.
        </motion.p>
      </div>

      {/* Bottom Edge Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
    </section>
  );
};

export default UpcomingEventSpotlight;
