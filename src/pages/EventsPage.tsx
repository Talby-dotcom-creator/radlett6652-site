import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Lock,
  Globe,
  ArrowRight,
  Sparkles,
  Wine,
  Book,
  Theater,
  Archive,
  Filter,
  Moon,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import SEOHead from "../components/SEOHead";
import EventDetailsModal from "../components/EventDetailsModal";

interface Event {
  id: string;
  title: string;
  description?: string; // HTML content
  event_date: string;
  event_time?: string;
  location?: string;
  event_type?: string;
  is_members_only: boolean | null;
  is_public?: boolean;
  is_past_event?: boolean | null;
  rsvp_required?: boolean;
  max_attendees?: number;
  current_attendees?: number;
  image_url?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

type EventView = "upcoming" | "past";
type EventFilter =
  | "all"
  | "regular"
  | "special"
  | "social"
  | "educational"
  | "ladies";

const EVENT_TYPE_CONFIG = {
  regular: {
    icon: Calendar,
    label: "Regular Meeting",
    color: "from-blue-500 to-indigo-600",
    bgColor: "from-blue-500/10 to-indigo-500/10",
  },
  special: {
    icon: Star,
    label: "Special Event",
    color: "from-amber-500 to-yellow-600",
    bgColor: "from-amber-500/10 to-yellow-500/10",
  },
  social: {
    icon: Wine,
    label: "Social Gathering",
    color: "from-rose-500 to-pink-600",
    bgColor: "from-rose-500/10 to-pink-500/10",
  },
  educational: {
    icon: Book,
    label: "Educational",
    color: "from-emerald-500 to-green-600",
    bgColor: "from-emerald-500/10 to-green-500/10",
  },
  ladies: {
    icon: Theater,
    label: "Ladies Evening",
    color: "from-purple-500 to-violet-600",
    bgColor: "from-purple-500/10 to-violet-500/10",
  },
};

function EventsPageInner() {
  const [events, setEvents] = useState<Event[]>([]);
  const [featuredEvent, setFeaturedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<EventView>("upcoming");
  const [filter, setFilter] = useState<EventFilter>("all");
  const [countdown, setCountdown] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, [view, filter]);

  // Countdown timer for featured event
  useEffect(() => {
    if (!featuredEvent) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const eventTime = new Date(featuredEvent.event_date).getTime();
      const distance = eventTime - now;

      if (distance < 0) {
        setCountdown("Event has started!");
        clearInterval(interval);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

      setCountdown(`${days}d ${hours}h ${minutes}m`);
    }, 1000);

    return () => clearInterval(interval);
  }, [featuredEvent]);

  async function fetchEvents() {
    setLoading(true);
    const now = new Date().toISOString();

    let query = supabase
      .from("events")
      .select("*")
      .eq("is_public", true)
      .order("event_date", { ascending: view === "upcoming" });

    // Filter by upcoming/past
    if (view === "upcoming") {
      query = query.gte("event_date", now);
    } else {
      query = query.lt("event_date", now);
    }

    // Filter by type
    if (filter !== "all") {
      query = query.eq("event_type", filter);
    }

    const { data, error } = await query;
    if (error) {
      console.error("Error fetching events:", error);
    }

    if (data && data.length > 0) {
      // Featured event is the next upcoming major event
      if (view === "upcoming") {
        const featured =
          data.find(
            (e: Event) =>
              e.event_type === "special" || e.event_type === "ladies"
          ) || data[0];
        setFeaturedEvent(featured);
        setEvents(data.filter((e: Event) => e.id !== featured.id));
      } else {
        setFeaturedEvent(null);
        setEvents(data);
      }
    } else {
      setFeaturedEvent(null);
      setEvents([]);
    }

    setLoading(false);
  }

  // Strip HTML tags for preview text
  const stripHtml = (html?: string) => {
    if (!html) return "";
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return "";
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getEventTypeConfig = (type?: string) => {
    return (
      EVENT_TYPE_CONFIG[type as keyof typeof EVENT_TYPE_CONFIG] ||
      EVENT_TYPE_CONFIG.regular
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="relative"
        >
          <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full"></div>
          <Calendar className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-amber-400" />
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="Lodge Events – Radlett Lodge No. 6652"
        description="Upcoming meetings, ceremonies, and social events at Radlett Lodge No. 6652. Join us for fellowship and Masonic gatherings."
      />

      <div className="relative min-h-screen overflow-hidden">
        {/* Premium Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900" />

        {/* Faded Calendar Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <Calendar className="w-[600px] h-[600px] text-amber-400" />
        </div>

        {/* Floating Moon Phases (Masonic tradition) */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -50, 0],
                opacity: [0.1, 0.3, 0.1],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeInOut",
              }}
            >
              <Moon className="w-8 h-8 text-amber-400/30" />
            </motion.div>
          ))}
        </div>

        {/* Candlelight Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-amber-400/40 rounded-full"
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
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* Epic Header */}
            <div className="text-center mb-16 relative">
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.05, 0.1, 0.05],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Calendar className="w-96 h-96 text-amber-500" />
              </motion.div>

              <div className="relative">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="inline-flex items-center gap-2 px-6 py-2 mb-6 bg-amber-500/10 border border-amber-500/30 rounded-full backdrop-blur-sm"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-300 text-sm font-medium tracking-wider uppercase">
                    Gatherings & Ceremonies
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="text-7xl md:text-8xl lg:text-9xl font-serif font-bold text-center tracking-[0.15em] select-none relative mb-6"
                >
                  <span className="text-white drop-shadow-2xl">Lodge </span>
                  <motion.span
                    className="relative inline-block"
                    animate={{
                      textShadow: [
                        "0 0 20px rgba(255, 215, 0, 0.5)",
                        "0 0 40px rgba(255, 215, 0, 0.8)",
                        "0 0 20px rgba(255, 215, 0, 0.5)",
                      ],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 text-transparent bg-clip-text">
                      Calendar
                    </span>
                  </motion.span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.4 }}
                  className="text-amber-100/80 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed font-light"
                >
                  Meetings, ceremonies, and fellowship events for our Masonic
                  brotherhood
                </motion.p>

                <div className="flex items-center justify-center gap-4 mt-8">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="h-px w-24 bg-gradient-to-r from-transparent to-amber-500"
                  />
                  <Calendar className="w-6 h-6 text-amber-400" />
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="h-px w-24 bg-gradient-to-l from-transparent to-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* View Toggle: Upcoming / Past Events */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex justify-center gap-4 mb-10"
            >
              <motion.button
                onClick={() => setView("upcoming")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative px-8 py-4 rounded-full font-bold transition-all duration-300 ${
                  view === "upcoming"
                    ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 shadow-lg shadow-amber-500/50"
                    : "bg-white/10 text-amber-100 hover:bg-white/20 border border-amber-500/30 backdrop-blur-sm"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Upcoming Events
                </span>
              </motion.button>

              <motion.button
                onClick={() => setView("past")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative px-8 py-4 rounded-full font-bold transition-all duration-300 ${
                  view === "past"
                    ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 shadow-lg shadow-amber-500/50"
                    : "bg-white/10 text-amber-100 hover:bg-white/20 border border-amber-500/30 backdrop-blur-sm"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Archive className="w-5 h-5" />
                  Past Events
                </span>
              </motion.button>
            </motion.div>

            {/* Event Type Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex flex-wrap justify-center gap-3 mb-16"
            >
              <motion.button
                onClick={() => setFilter("all")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  filter === "all"
                    ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 shadow-lg"
                    : "bg-white/10 text-amber-100 hover:bg-white/20 border border-amber-500/30"
                }`}
              >
                All Events
              </motion.button>

              {Object.entries(EVENT_TYPE_CONFIG).map(([key, config]) => {
                const Icon = config.icon;
                return (
                  <motion.button
                    key={key}
                    onClick={() => setFilter(key as EventFilter)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-6 py-3 rounded-full font-semibold transition-all flex items-center gap-2 ${
                      filter === key
                        ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 shadow-lg"
                        : "bg-white/10 text-amber-100 hover:bg-white/20 border border-amber-500/30"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {config.label}
                  </motion.button>
                );
              })}
            </motion.div>

            {/* Featured Event (Upcoming only) */}
            <AnimatePresence mode="wait">
              {featuredEvent && view === "upcoming" && (
                <motion.div
                  key="featured"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.8 }}
                  onClick={() => {
                    setSelectedEvent(featuredEvent);
                    setIsModalOpen(true);
                  }}
                  className="mb-20 relative group cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all" />

                  <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-amber-500/20 rounded-3xl shadow-2xl overflow-hidden">
                    <div className="grid md:grid-cols-2">
                      {/* Image */}
                      <div className="relative h-96 md:h-auto overflow-hidden">
                        {featuredEvent.image_url ? (
                          <motion.img
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                            src={featuredEvent.image_url}
                            alt={featuredEvent.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800">
                            {React.createElement(
                              getEventTypeConfig(featuredEvent.event_type).icon,
                              {
                                className: "w-32 h-32 text-amber-500/20",
                              }
                            )}
                          </div>
                        )}

                        {/* Featured Badge */}
                        <span className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 rounded-full text-sm font-bold shadow-lg">
                          <Sparkles className="w-4 h-4" />
                          Next Major Event
                        </span>

                        {/* Members Only Badge */}
                        {featuredEvent.is_members_only && (
                          <span className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 bg-slate-900/90 border border-amber-500/50 text-amber-300 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm">
                            <Lock className="w-4 h-4" />
                            Members Only
                          </span>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent md:bg-gradient-to-r" />
                      </div>

                      {/* Content */}
                      <div className="p-10 flex flex-col justify-center">
                        <div
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-4 bg-gradient-to-r ${
                            getEventTypeConfig(featuredEvent.event_type).bgColor
                          } border border-amber-500/30 w-fit`}
                        >
                          {React.createElement(
                            getEventTypeConfig(featuredEvent.event_type).icon,
                            {
                              className: "w-4 h-4",
                            }
                          )}
                          {getEventTypeConfig(featuredEvent.event_type).label}
                        </div>

                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4 leading-tight">
                          {featuredEvent.title}
                        </h2>

                        {featuredEvent.description && (
                          <p className="text-amber-100/70 text-lg mb-6 leading-relaxed line-clamp-3">
                            {stripHtml(featuredEvent.description)}
                          </p>
                        )}

                        {/* Event Details */}
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center gap-3 text-amber-200">
                            <Calendar className="w-5 h-5 text-amber-400" />
                            <span className="font-medium">
                              {formatDate(featuredEvent.event_date)}
                            </span>
                          </div>

                          {featuredEvent.event_time && (
                            <div className="flex items-center gap-3 text-amber-200">
                              <Clock className="w-5 h-5 text-amber-400" />
                              <span className="font-medium">
                                {formatTime(featuredEvent.event_time)}
                              </span>
                            </div>
                          )}

                          {featuredEvent.location && (
                            <div className="flex items-center gap-3 text-amber-200">
                              <MapPin className="w-5 h-5 text-amber-400" />
                              <span className="font-medium">
                                {featuredEvent.location}
                              </span>
                            </div>
                          )}

                          {featuredEvent.max_attendees && (
                            <div className="flex items-center gap-3 text-amber-200">
                              <Users className="w-5 h-5 text-amber-400" />
                              <span className="font-medium">
                                {featuredEvent.current_attendees || 0} /{" "}
                                {featuredEvent.max_attendees} attendees
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Countdown Timer */}
                        {countdown && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 rounded-2xl mb-6 backdrop-blur-sm w-fit"
                          >
                            <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
                            <span className="text-2xl font-mono font-bold text-amber-300">
                              {countdown}
                            </span>
                          </motion.div>
                        )}

                        {/* RSVP Button */}
                        {featuredEvent.rsvp_required && (
                          <motion.button
                            whileHover={{ scale: 1.05, x: 5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                              navigate(`/contact?event=${featuredEvent.id}`)
                            }
                            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all w-fit"
                          >
                            Register Interest
                            <ArrowRight className="w-5 h-5" />
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Events Grid */}
            {events.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((event, index) => {
                  const typeConfig = getEventTypeConfig(event.event_type);
                  const TypeIcon = typeConfig.icon;

                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ y: -8, scale: 1.02 }}
                      onClick={() => {
                        setSelectedEvent(event);
                        setIsModalOpen(true);
                      }}
                      className="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-md border border-amber-500/20 rounded-2xl shadow-xl overflow-hidden cursor-pointer"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-yellow-500/0 group-hover:from-amber-500/10 group-hover:to-yellow-500/10 transition-all duration-500 rounded-2xl" />

                      {/* Image or Icon */}
                      <div className="relative h-48 overflow-hidden">
                        {event.image_url ? (
                          <motion.img
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                            src={event.image_url}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div
                            className={`h-full bg-gradient-to-br ${typeConfig.bgColor} flex items-center justify-center`}
                          >
                            <TypeIcon className="w-16 h-16 text-amber-500/30" />
                          </div>
                        )}

                        {/* Members Only Badge */}
                        {event.is_members_only && (
                          <span className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-slate-900/90 border border-amber-500/50 text-amber-300 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm">
                            <Lock className="w-3 h-3" />
                            Members
                          </span>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
                      </div>

                      {/* Content */}
                      <div className="relative p-6">
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-3 bg-gradient-to-r ${typeConfig.bgColor} border border-amber-500/30`}
                        >
                          <TypeIcon className="w-3 h-3" />
                          {typeConfig.label}
                        </div>

                        <h3 className="text-xl font-serif font-bold text-white mb-3 leading-tight group-hover:text-amber-300 transition-colors">
                          {event.title}
                        </h3>

                        {event.description && (
                          <p className="text-amber-100/60 text-sm mb-4 line-clamp-2 leading-relaxed">
                            {stripHtml(event.description)}
                          </p>
                        )}

                        {/* Event Details */}
                        <div className="space-y-2 mb-4 text-sm">
                          <div className="flex items-center gap-2 text-amber-200/80">
                            <Calendar className="w-4 h-4 text-amber-400" />
                            <span>{formatDate(event.event_date)}</span>
                          </div>

                          {event.event_time && (
                            <div className="flex items-center gap-2 text-amber-200/80">
                              <Clock className="w-4 h-4 text-amber-400" />
                              <span>{formatTime(event.event_time)}</span>
                            </div>
                          )}

                          {event.location && (
                            <div className="flex items-center gap-2 text-amber-200/80">
                              <MapPin className="w-4 h-4 text-amber-400" />
                              <span className="truncate">{event.location}</span>
                            </div>
                          )}
                        </div>

                        {/* RSVP/View Details */}
                        <div className="flex items-center justify-between border-t border-amber-500/20 pt-4">
                          {event.rsvp_required ? (
                            <motion.button
                              whileHover={{ x: 5 }}
                              onClick={() =>
                                navigate(`/contact?event=${event.id}`)
                              }
                              className="flex items-center gap-2 text-amber-400 font-semibold text-sm"
                            >
                              Register
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                          ) : (
                            <span className="text-amber-200/50 text-sm">
                              No RSVP required
                            </span>
                          )}

                          {event.max_attendees && (
                            <span className="flex items-center gap-1.5 text-xs text-amber-200/60">
                              <Users className="w-3.5 h-3.5" />
                              {event.current_attendees || 0}/
                              {event.max_attendees}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Corner Accent */}
                      <div
                        className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${typeConfig.bgColor} rounded-bl-full opacity-50`}
                      />
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <Calendar className="w-16 h-16 text-amber-500/30 mx-auto mb-4" />
                <p className="text-xl text-amber-200/60">
                  {view === "upcoming"
                    ? "No upcoming events at this time."
                    : "No past events found."}
                </p>
              </motion.div>
            )}

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mt-24 relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all" />

              <div className="relative bg-gradient-to-br from-slate-800/90 to-blue-950/90 backdrop-blur-xl border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden text-center py-20 px-8">
                <div className="absolute inset-0 opacity-5">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute"
                      style={{
                        left: `${20 + i * 15}%`,
                        top: `${10 + (i % 2) * 40}%`,
                      }}
                    >
                      <Calendar className="w-24 h-24 text-amber-500" />
                    </div>
                  ))}
                </div>

                <div className="relative z-10">
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 px-6 py-2 mb-6 bg-amber-500/10 border border-amber-500/30 rounded-full backdrop-blur-sm"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="text-amber-300 text-sm font-medium tracking-wider uppercase">
                      Interested in Attending?
                    </span>
                  </motion.div>

                  <h2 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6">
                    Never Miss an Event
                  </h2>

                  <p className="text-amber-100/80 text-xl mb-12 max-w-3xl mx-auto leading-relaxed">
                    Join our mailing list or contact us to learn more about
                    upcoming meetings and social gatherings.
                  </p>

                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/contact")}
                    className="relative group/cta"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-yellow-600 rounded-full blur-lg group-hover/cta:blur-xl transition-all" />
                    <div className="relative flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full font-bold text-lg text-slate-900 shadow-2xl">
                      <span>Contact Us</span>
                      <ArrowRight className="w-5 h-5 group-hover/cta:translate-x-2 transition-transform" />
                    </div>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Event Details Modal */}
      <EventDetailsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent as any}
      />
    </>
  );
}

export default function EventsPage() {
  return <EventsPageInner />;
}
