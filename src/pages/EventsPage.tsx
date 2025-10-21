// src/pages/EventsPage.tsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeroSection from "../components/HeroSection";
import LoadingSpinner from "../components/LoadingSpinner";
import { optimizedApi } from "../lib/optimizedApi";
import { Event, CMSBlogPost } from "../types";
import { Calendar, MapPin, X } from "lucide-react";

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [highlights, setHighlights] = useState<CMSBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const eventData = await optimizedApi.getEvents();
        setEvents(eventData);
        if (eventData.length < 2) {
          const highlightData = await optimizedApi.getBlogPosts("news");
          setHighlights(highlightData.slice(0, 3));
        }
      } catch (err) {
        console.error("Error loading events:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const upcomingEvents = events
    .filter((e) => new Date(e.event_date) >= new Date())
    .sort(
      (a, b) =>
        new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
    );

  const diaryEntries = upcomingEvents.slice(0, 5);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-neutral-50">
      {/* Hero Section */}
      <HeroSection
        title="Events Calendar"
        subtitle="Stay up to date with all Lodge meetings and social events."
        backgroundImage="https://neoquuejwgcqueqlcbwj.supabase.co/storage/v1/object/public/cms-media/radlett_event.png"
        overlayOpacity={0.35}
        verticalPosition="bottom"
        showScrollHint
      />

      <main className="flex-grow py-16 px-6 md:px-12 lg:px-20">
        {loading ? (
          <div className="flex justify-center py-24">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="grid lg:grid-cols-[320px_1fr] gap-10 max-w-7xl mx-auto">
            {/* Lodge Diary */}
            <aside className="rounded-2xl border border-[#d4af37] shadow-md bg-gradient-to-b from-[#fff9e6] to-[#fff6d9] p-6 mt-12 lg:mt-16 h-fit">
              <h3 className="text-2xl font-bold text-[#d4af37] mb-4 drop-shadow-sm">
                Lodge Diary
              </h3>
              {diaryEntries.length > 0 ? (
                <ul className="space-y-3">
                  {diaryEntries.map((d) => (
                    <li
                      key={d.id}
                      onClick={() => setSelectedEvent(d)}
                      className="cursor-pointer flex items-start hover:text-[#b68c28] hover:translate-x-1 transition-transform duration-200"
                    >
                      <Calendar
                        size={16}
                        className="mt-1 mr-2 text-[#b68c28] flex-shrink-0"
                      />
                      <span>
                        {new Date(d.event_date).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                        })}{" "}
                        – {d.title}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-neutral-600 text-sm">
                  No upcoming events in the diary.
                </p>
              )}

              <motion.div
                className="mt-6 text-sm bg-[#fff9e6]/80 border border-[#d4af37]/60 rounded-lg p-3 text-[#0b2545] shadow-sm cursor-default transition-all duration-300 hover:shadow-[0_0_12px_#d4af37AA] hover:scale-[1.02]"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                💡 <span className="font-medium">Tip:</span> Click any event to
                view full details in a larger window.
              </motion.div>
            </aside>

            {/* Main Events Section */}
            <section>
              <h2 className="text-3xl font-heading font-bold lodge-heading mb-8 text-center">
                Upcoming Events
              </h2>

              {upcomingEvents.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-8">
                  <AnimatePresence>
                    {upcomingEvents.map((event) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        whileHover={{
                          scale: 1.02,
                          y: -4,
                          boxShadow: "0 12px 25px rgba(0,0,0,0.08)",
                        }}
                        className="cursor-pointer bg-white rounded-2xl p-6 shadow-sm border border-neutral-200 hover:border-[#d4af37] transition-all duration-300"
                        onClick={() => setSelectedEvent(event)}
                      >
                        {event.image_url && (
                          <img
                            src={event.image_url}
                            alt={event.title}
                            className="w-full h-48 object-cover rounded-xl mb-4"
                          />
                        )}
                        <h3 className="text-xl font-semibold text-[#0b2545] mb-2 flex items-center flex-wrap gap-2">
                          {event.title}
                          {event.is_members_only && (
                            <span className="inline-block px-2 py-0.5 text-xs font-medium border border-[#d4af37] text-[#0b2545] bg-[#fff9e6] rounded-full">
                              Members Only
                            </span>
                          )}
                        </h3>
                        <div className="flex items-center text-sm text-neutral-600 mb-1">
                          <Calendar size={14} className="mr-2 text-[#b68c28]" />
                          {new Date(event.event_date).toLocaleDateString(
                            "en-GB"
                          )}
                        </div>
                        {event.location && (
                          <div className="flex items-center text-sm text-neutral-600 mb-2">
                            <MapPin size={14} className="mr-2 text-[#b68c28]" />
                            {event.location}
                          </div>
                        )}
                        <p className="text-neutral-700 line-clamp-3">
                          {event.description || "No description provided."}
                        </p>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div>
                  <h3 className="text-2xl font-semibold text-[#d4af37] mb-6">
                    Recent Highlights
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-8">
                    {highlights.map((news) => (
                      <motion.div
                        key={news.id}
                        whileHover={{
                          scale: 1.02,
                          y: -4,
                          boxShadow: "0 12px 25px rgba(0,0,0,0.08)",
                        }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm hover:border-[#d4af37] cursor-pointer"
                      >
                        {news.image_url && (
                          <img
                            src={news.image_url}
                            alt={news.title}
                            className="w-full h-48 object-cover rounded-xl mb-4"
                          />
                        )}
                        <h4 className="text-lg font-semibold text-[#0b2545] mb-2">
                          {news.title}
                        </h4>
                        <p className="text-neutral-700 line-clamp-3">
                          {news.summary || "Read more about this highlight."}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      {/* Event Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden"
            >
              {selectedEvent.image_url && (
                <img
                  src={selectedEvent.image_url}
                  alt={selectedEvent.title}
                  className="w-full h-64 object-cover"
                />
              )}
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 bg-white/80 hover:bg-white text-neutral-800 rounded-full p-1 shadow"
              >
                <X size={20} />
              </button>

              <div className="p-8 overflow-y-auto max-h-[80vh]">
                <h2 className="text-2xl font-bold text-[#0b2545] mb-3">
                  {selectedEvent.title}
                </h2>
                {selectedEvent.is_members_only && (
                  <span className="inline-block mt-1 mb-3 px-2 py-0.5 text-xs font-medium border border-[#d4af37] text-[#0b2545] bg-[#fff9e6] rounded-full">
                    Members Only
                  </span>
                )}
                <div className="flex flex-col gap-2 text-neutral-700 mb-4">
                  <div className="flex items-center text-sm">
                    <Calendar size={14} className="mr-2 text-[#b68c28]" />
                    {new Date(selectedEvent.event_date).toLocaleDateString(
                      "en-GB"
                    )}
                  </div>
                  {selectedEvent.location && (
                    <div className="flex items-center text-sm">
                      <MapPin size={14} className="mr-2 text-[#b68c28]" />
                      {selectedEvent.location}
                    </div>
                  )}
                </div>
                <p className="text-neutral-800 whitespace-pre-line leading-relaxed">
                  {selectedEvent.description ||
                    "No additional details provided."}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventsPage;
