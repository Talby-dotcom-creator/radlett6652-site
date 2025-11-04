import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabase";
import { Event } from "../types";
import LoadingSpinner from "../components/LoadingSpinner";
import SEOHead from "../components/SEOHead";

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showDiary, setShowDiary] = useState(true);
  const [showPast, setShowPast] = useState(false);

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: true });
      if (!error && data) setEvents(data);
      setLoading(false);
    };
    loadEvents();
  }, []);

  const upcomingEvents = events.filter(
    (e) => new Date(e.event_date) >= new Date()
  );
  const pastEvents = events.filter((e) => new Date(e.event_date) < new Date());

  if (loading)
    return (
      <main className="flex justify-center items-center h-screen bg-[#0A174E]">
        <LoadingSpinner />
      </main>
    );

  return (
    <main className="min-h-screen bg-[#0A174E] text-white py-20 px-6">
      <SEOHead
        title="Events | Radlett Lodge No. 6652"
        description="Upcoming and past Masonic events at Radlett Lodge No. 6652, Province of Hertfordshire."
      />

      {/* Header */}
      <section className="text-center mb-14">
        {/* Lodge Logo with Fade-In */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex justify-center mb-6"
        >
          <img
            src="/icon-512.png"
            alt="Radlett Lodge Logo"
            className="w-40 h-40 md:w-30 md:h-30 drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]"
          />
        </motion.div>

        <h2
          className="text-5xl md:text-6xl font-serif font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-white to-[#FFD700]"
          style={{
            WebkitTextStroke: "1px #FFD700",
            textShadow: "0 0 10px rgba(255,215,0,0.6)",
          }}
        >
          Lodge Events
        </h2>
        <p className="text-gray-200 text-lg max-w-2xl mx-auto">
          A calendar of meetings and special gatherings at Radlett Lodge No.
          6652.
        </p>
      </section>

      {/* Main Layout */}
      <div className="grid lg:grid-cols-4 gap-8 items-start">
        {/* Left - 2x2 Grid of Events */}
        <section className="lg:col-span-3 grid md:grid-cols-2 gap-8">
          {upcomingEvents.map((event) => (
            <motion.div
              key={event.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedEvent(event)}
              className="cursor-pointer bg-[#0A174E] rounded-2xl p-6
                         border border-[#FFD700]/20 
                         shadow-[0_2px_10px_rgba(0,0,0,0.25)]
                         hover:border-[#FFD700]/40
                         hover:shadow-[0_0_25px_rgba(255,215,0,0.25)]
                         transition-all duration-300"
            >
              {/* Event Image */}
              <div className="relative w-full h-44 rounded-t-2xl overflow-hidden mb-4 flex items-center justify-center border border-[#FFD700]/20">
                {event.image_url ? (
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : event.is_members_only ? (
                  <img
                    src="https://neoquuejwgcqueqlcbwj.supabase.co/storage/v1/object/public/cms-media/events/square-compasses1.webp"
                    alt="Members only"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500">
                    No image
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
              </div>

              {/* Title + Badge */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <h3
                  className="text-xl font-semibold mb-2 group-hover:text-[#FFD700] transition-all duration-200"
                  style={{
                    WebkitTextStroke: "0.6px black",
                    textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                  }}
                >
                  {event.title}
                </h3>
                {event.is_members_only && (
                  <span className="bg-[#FFD700] text-[#0A174E] text-xs font-semibold px-3 py-1 rounded-full">
                    Members Only
                  </span>
                )}
              </div>

              {/* Details */}
              <div className="text-gray-100 mt-3 space-y-1">
                <p className="text-sm">
                  <Calendar className="inline w-4 h-4 mr-2 text-[#FFD700]" />
                  {new Date(event.event_date).toLocaleDateString("en-GB", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                {event.location && (
                  <p className="text-sm">
                    <MapPin className="inline w-4 h-4 mr-2 text-[#FFD700]" />
                    {event.location}
                  </p>
                )}
                {event.event_time && (
                  <p className="text-sm">
                    <Clock className="inline w-4 h-4 mr-2 text-[#FFD700]" />
                    {event.event_time}
                  </p>
                )}
              </div>

              {/* Description */}
              <p className="mt-4 text-gray-300 text-sm leading-relaxed line-clamp-3">
                {event.description ||
                  "Join us for this special event at Radlett Masonic Centre."}
              </p>
            </motion.div>
          ))}
        </section>

        {/* Right - Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          {/* Lodge Diary */}
          <div className="bg-[#0A174E] rounded-2xl p-5 border border-[#FFD700]/20 hover:border-[#FFD700]/40 transition-all duration-300">
            <button
              onClick={() => setShowDiary(!showDiary)}
              className="flex justify-between items-center w-full text-[#FFD700] font-semibold text-lg"
            >
              Lodge Diary
              {showDiary ? (
                <ChevronUp className="w-5 h-5 text-[#FFD700]" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[#FFD700]" />
              )}
            </button>
            {showDiary && (
              <ul className="mt-4 space-y-3 text-gray-100 text-sm max-h-[300px] overflow-y-auto pr-1">
                {upcomingEvents.map((e) => (
                  <li
                    key={e.id}
                    className="border-b border-[#FFD700]/10 pb-2 cursor-pointer hover:text-[#FFD700]"
                    onClick={() => setSelectedEvent(e)}
                  >
                    {new Date(e.event_date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}{" "}
                    – {e.title}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Past Events */}
          <div className="bg-[#0A174E] rounded-2xl p-5 border border-[#FFD700]/20 hover:border-[#FFD700]/40 transition-all duration-300">
            <button
              onClick={() => setShowPast(!showPast)}
              className="flex justify-between items-center w-full text-[#FFD700] font-semibold text-lg"
            >
              Past Events
              {showPast ? (
                <ChevronUp className="w-5 h-5 text-[#FFD700]" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[#FFD700]" />
              )}
            </button>
            {showPast && (
              <ul className="mt-4 space-y-3 text-gray-100 text-sm max-h-[300px] overflow-y-auto pr-1">
                {pastEvents.map((e) => (
                  <li
                    key={e.id}
                    className="border-b border-[#FFD700]/10 pb-2 cursor-pointer hover:text-[#FFD700]"
                    onClick={() => setSelectedEvent(e)}
                  >
                    {new Date(e.event_date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "2-digit",
                    })}{" "}
                    – {e.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>

      {/* Modal Popup */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-[#0A174E] text-white border border-[#FFD700]/30 rounded-2xl shadow-2xl max-w-lg w-full p-8 relative overflow-y-auto max-h-[85vh]"
          >
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-3 right-3 text-[#FFD700] hover:text-white text-xl"
            >
              ✕
            </button>

            {selectedEvent.image_url && (
              <img
                src={selectedEvent.image_url}
                alt={selectedEvent.title}
                className="w-full h-48 object-cover rounded-lg mb-4 border border-[#FFD700]/30"
              />
            )}

            <h3 className="text-2xl font-bold text-[#FFD700] mb-3">
              {selectedEvent.title}
            </h3>
            <p className="text-sm text-gray-200 mb-2">
              <Calendar className="inline w-4 h-4 mr-2 text-[#FFD700]" />
              {new Date(selectedEvent.event_date).toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            {selectedEvent.location && (
              <p className="text-sm mb-2">
                <MapPin className="inline w-4 h-4 mr-2 text-[#FFD700]" />
                {selectedEvent.location}
              </p>
            )}
            {selectedEvent.event_time && (
              <p className="text-sm mb-4">
                <Clock className="inline w-4 h-4 mr-2 text-[#FFD700]" />
                {selectedEvent.event_time}
              </p>
            )}

            <p className="text-gray-200 leading-relaxed">
              {selectedEvent.description ||
                "Details for this event will be announced soon."}
            </p>
          </motion.div>
        </div>
      )}
    </main>
  );
};

export default EventsPage;
