import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Users, Heart, BookOpen } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import SEOHead from "../components/SEOHead";
import Button from "../components/Button";
import EventCard from "../components/EventCard";
import NewsCard from "../components/NewsCard";
import TestimonialCard from "../components/TestimonialCard";
import StatsSection from "../components/StatsSection";
import LoadingSpinner from "../components/LoadingSpinner";
import { optimizedApi } from "../lib/optimizedApi";
import { LodgeEvent, Testimonial, CMSBlogPost } from "../types";

const HomePage: React.FC = () => {
  const [events, setEvents] = useState<LodgeEvent[]>([]);
  const [news, setNews] = useState<CMSBlogPost[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageCounters, setPageCounters] = useState<Record<string, string>>({
    founded_year: "1948",
    active_members_count: "100+",
  });

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      try {
        const [eventData, newsData, testimonialData, settingsData] =
          await Promise.all([
            optimizedApi.getEvents(),
            optimizedApi.getBlogPosts("news"),
            optimizedApi.getTestimonials(),
            optimizedApi.getSiteSettings(),
          ]);

        if (!mounted) return;
        setEvents(eventData || []);
        setNews(newsData || []);
        setTestimonials(testimonialData || []);

        // Map settings to counters
        const counters: Record<string, string> = { ...pageCounters };
        if (Array.isArray(settingsData)) {
          settingsData.forEach((row: any) => {
            if (row.setting_key === "founded_year")
              counters.founded_year = row.setting_value;
            if (row.setting_key === "active_members_count")
              counters.active_members_count = row.setting_value;
          });
        }
        setPageCounters(counters);
      } catch (err) {
        console.error("Error loading homepage data:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <SEOHead
        title="Radlett Lodge No. 6652 — Freemasonry in Hertfordshire"
        description="Discover the spirit of Freemasonry in Radlett — integrity, friendship, respect, and service since 1948."
      />

      <section
        className="relative h-screen flex flex-col items-center justify-center text-center text-white overflow-hidden"
        style={{
          backgroundImage: "url('/masonic-pillars.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/30" />

        <div className="text-center space-y-4 md:space-y-6">
          {/* Lodge Logo */}
          <div className="flex justify-center mb-4">
            <img
              src="/lodge-logo.png"
              alt="Radlett Lodge logo"
              className="max-w-[160px] md:max-w-[200px] h-auto object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]"
            />
          </div>

          {/* Title */}
          <h1
            className="text-4xl md:text-6xl font-bold drop-shadow-[0_2px_8px_rgba(255,215,0,0.3)]"
            style={{ color: "#d4af37" }}
          >
            Radlett Lodge No. 6652
          </h1>

          {/* Subtitle Lines */}
          <div className="leading-relaxed md:leading-loose space-y-1">
            <p className="text-lg md:text-xl font-semibold tracking-wide text-yellow-300">
              Integrity • Friendship • Respect • Service
            </p>
            <p className="text-base md:text-lg text-neutral-100 font-light">
              A Masonic Lodge under the United Grand Lodge of England
            </p>
          </div>
        </div>

        <Link
          to="/join"
          className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold px-8 py-3 rounded-lg shadow-md"
        >
          Discover Yourself
        </Link>

        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20 flex flex-wrap justify-center gap-8">
          {[
            { key: "founded_year", label: "Founded" },
            { key: "active_members_count", label: "Active Members" },
          ].map((item) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: item.key === "active_members_count" ? 0.2 : 0,
              }}
              className="backdrop-blur-lg bg-white/5 border border-white/20 rounded-2xl px-6 py-4 text-center"
            >
              <p className="text-sm uppercase text-neutral-200 mb-1">
                {item.label}
              </p>
              <p className="text-2xl md:text-3xl font-semibold text-yellow-300">
                {pageCounters[item.key] ?? "--"}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 grid md:grid-cols-2 items-center gap-12 max-w-6xl">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-yellow-500 mb-6">
              Welcome to Our Lodge
            </h2>
            <p className="text-lg text-neutral-700 leading-relaxed mb-6">
              Since our founding in 1948,{" "}
              <strong>Radlett Lodge No. 6652</strong> has been part of the
              Province of Hertfordshire under the United Grand Lodge of England.
            </p>
            <p className="text-lg text-neutral-700 leading-relaxed mb-8">
              Whether you are curious about Freemasonry or looking to rekindle
              your Masonic journey, you’ll find a warm welcome and community
              spirit.
            </p>
            <Link
              to="/about"
              className="inline-block bg-gradient-to-r from-[#F7D36B] to-[#B9852F] text-black font-semibold px-6 py-3 rounded-lg"
            >
              Learn More About Us
            </Link>
          </div>

          <div className="relative">
            <img
              src="https://neoquuejwgcqueqlcbwj.supabase.co/storage/v1/object/public/cms-media/radlett-%20lodge-%20outside.jpg"
              alt="Radlett Lodge exterior"
              className="rounded-2xl shadow-lg w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent rounded-2xl pointer-events-none" />
          </div>
        </div>
      </section>

      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-6">
          <SectionHeading
            title="Upcoming Events"
            subtitle="Join us for meetings, social gatherings, and charitable activities."
            icon={<Calendar className="w-8 h-8 text-yellow-500" />}
          />
          {events.length === 0 ? (
            <p className="text-center text-neutral-600">No upcoming events.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              {events.slice(0, 3).map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
          <div className="text-center mt-12">
            <Link
              to="/events"
              className="inline-block bg-yellow-500 px-6 py-3 rounded-lg text-oxford-blue font-semibold"
            >
              View All Events
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <SectionHeading
            title="Latest News"
            subtitle="Stories and updates from Radlett Lodge."
            icon={<BookOpen className="w-8 h-8 text-yellow-500" />}
          />
          {news.length === 0 ? (
            <p className="text-center text-neutral-600">
              No news articles found.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              {news.slice(0, 3).map((n) => (
                <NewsCard
                  key={n.id}
                  news={{
                    id: n.id,
                    title: n.title,
                    summary: n.summary || "",
                    date: new Date(n.publish_date || n.created_at || ""),
                    image: n.image_url || undefined,
                    isMembers: Boolean(n.is_members_only),
                    content: n.content,
                  }}
                />
              ))}
            </div>
          )}
          <div className="text-center mt-12">
            <Link
              to="/news"
              className="inline-block bg-yellow-500 px-6 py-3 rounded-lg text-oxford-blue font-semibold"
            >
              View All News
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-6">
          <SectionHeading
            title="What Our Members Say"
            subtitle="Reflections from Brethren of Radlett Lodge."
            icon={<Users className="w-8 h-8 text-yellow-500" />}
          />
          {testimonials.length === 0 ? (
            <p className="text-center text-neutral-600">No testimonials yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              {testimonials.map((t) => (
                <TestimonialCard key={t.id} testimonial={t} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-white text-center">
        <div className="container mx-auto px-6">
          <SectionHeading
            title="Charity at the Heart"
            subtitle="Our members are committed to supporting Masonic and local charitable causes."
            icon={<Heart className="w-8 h-8 text-yellow-500" />}
          />
          <p className="text-neutral-600 max-w-3xl mx-auto mb-8">
            Freemasonry has long been associated with benevolence and community
            support. Radlett Lodge actively contributes to charitable causes in
            Hertfordshire and beyond.
          </p>
          <Link
            to="/charity"
            className="inline-block bg-yellow-500 px-6 py-3 rounded-lg text-oxford-blue font-semibold"
          >
            Learn More
          </Link>
        </div>
      </section>

      <StatsSection />
    </>
  );
};

export default HomePage;
