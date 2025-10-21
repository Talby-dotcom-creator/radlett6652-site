// src/components/UpcomingEventSpotlight.tsx
import React, { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
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
    <section className="py-24 bg-[#002147] text-center text-white relative overflow-hidden">
      {/* ✨ Soft ambient gold glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(252,163,17,0.08)_0%,transparent_70%)]" />

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-heading font-bold text-secondary-500 mb-2"
        >
          Upcoming Event Spotlight
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
          className="text-neutral-300 mb-10"
        >
          Next on the Lodge Calendar
        </motion.p>

        {/* Content */}
        {loading ? (
          <p className="text-neutral-400">Loading event...</p>
        ) : nextEvent ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            viewport={{ once: true }}
            whileHover={{ y: -6, scale: 1.02 }}
            className="max-w-2xl mx-auto relative rounded-2xl overflow-hidden shadow-2xl border border-yellow-600/40 bg-white/90 transition-transform duration-500"
          >
            {/* Parchment Background */}
            <div
              className="absolute inset-0 bg-center bg-no-repeat"
              style={{
                backgroundImage:
                  "url('https://neoquuejwgcqueqlcbwj.supabase.co/storage/v1/object/public/cms-media/images%20/parchment-light.jpg')",
                backgroundSize: "cover",
              }}
            />

            {/* Subtle overlay for contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/70 to-white/90" />

            {/* Gold edge shimmer */}
            <div className="absolute inset-0 border-2 border-yellow-600/60 rounded-2xl shadow-[0_0_25px_rgba(252,163,17,0.3)] pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 py-12 px-10 text-neutral-900">
              <h3 className="text-2xl font-heading text-primary-700 mb-4 font-semibold">
                {nextEvent.title}
              </h3>

              {nextEvent.event_date && (
                <p className="text-lg font-semibold text-yellow-700 mb-3">
                  {daysUntilEvent(nextEvent.event_date)}{" "}
                  {daysUntilEvent(nextEvent.event_date) === 1
                    ? "Day to go"
                    : "Days to go"}
                </p>
              )}

              <p className="text-sm text-neutral-700 mb-4 flex items-center justify-center gap-2">
                <MapPin className="w-4 h-4 text-yellow-700" />
                {nextEvent.location ?? "Venue TBA"}
              </p>

              {nextEvent.event_date && (
                <p className="text-sm text-neutral-600 mb-6 italic">
                  {new Date(nextEvent.event_date).toLocaleDateString("en-GB", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  at{" "}
                  {new Date(nextEvent.event_date).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              )}

              {/* CTA Button */}
              <Link
                to="/events"
                aria-label="View all events"
                className="inline-block border border-yellow-700 text-yellow-700 hover:bg-yellow-600 hover:text-white transition rounded-full px-6 py-2 font-medium shadow-md hover:shadow-lg"
              >
                View All Events
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto bg-white/90 shadow-md border border-neutral-200 rounded-2xl py-10 px-8 text-neutral-800"
          >
            <h3 className="text-xl font-heading text-neutral-700 mb-2">
              No upcoming events
            </h3>
            <p className="text-sm text-neutral-500">
              Please check back soon for our next Lodge meeting or social night.
            </p>
          </motion.div>
        )}

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-sm italic text-neutral-300"
        >
          Counting down to another evening of friendship and fellowship.
        </motion.p>
      </div>
    </section>
  );
};

export default UpcomingEventSpotlight;
