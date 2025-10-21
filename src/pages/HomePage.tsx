import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Users, Heart } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

import SectionHeading from "../components/SectionHeading";
import SectionDivider from "../components/SectionDivider";
import SEOHead from "../components/SEOHead";
import Button from "../components/Button";
import NewsCard from "../components/NewsCard";
import TestimonialCard from "../components/TestimonialCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { optimizedApi } from "../lib/optimizedApi";
import { LodgeEvent, Testimonial, CMSBlogPost } from "../types";
import CoreValuesSection from "../components/CoreValuesSection";
import UpcomingEventSpotlight from "../components/UpcomingEventSpotlight";
import NewsDetailsModal from "../components/NewsDetailsModal";
import MemberExperiences from "../components/MemberExperiences";
import QuoteBanner from "../components/QuoteBanner";

const HomePage: React.FC = () => {
  const [events, setEvents] = useState<LodgeEvent[]>([]);
  const [news, setNews] = useState<CMSBlogPost[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
  const [selectedNews, setSelectedNews] = useState<CMSBlogPost | null>(null);

  // Parallax for hero background
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 400], [0, 60]); // gentle drift

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [eventsData, newsData, testimonialsData] = await Promise.all([
          optimizedApi.getEvents(),
          optimizedApi.getBlogPosts("news"),
          optimizedApi.getTestimonials(),
        ]);

        const now = new Date();

        const upcomingEvents = eventsData
          .filter((e) => e.event_date && new Date(e.event_date) > now)
          .sort(
            (a, b) =>
              new Date(a.event_date!).getTime() -
              new Date(b.event_date!).getTime()
          )
          .slice(0, 3);

        const publishedNews = newsData
          .filter((n) => n.is_published)
          .sort(
            (a, b) =>
              new Date(b.publish_date || b.created_at || "").getTime() -
              new Date(a.publish_date || a.created_at || "").getTime()
          )
          .slice(0, 3);

        const sortedTestimonials = testimonialsData.sort(
          (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
        );

        setEvents(upcomingEvents);
        setNews(publishedNews);
        setTestimonials(sortedTestimonials);
      } catch (err) {
        console.error("Error loading homepage data:", err);
        setError("Failed to load content. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <>
      <SEOHead
        title="Radlett Lodge No. 6652 - Freemasons | Brotherhood, Charity & Tradition"
        description="Welcome to Radlett Lodge No. 6652, a Masonic Lodge in Hertfordshire under the United Grand Lodge of England. Discover our history, values, and how to join."
        keywords="Radlett Lodge 6652, Freemasonry, Hertfordshire, United Grand Lodge England, Masonic Lodge, Brotherhood, Charity, Tradition, Join Freemasons"
      />

      {/* 🏛 HERO — with parallax background and counters near bottom */}
      <section className="relative min-h-screen text-white overflow-hidden">
        {/* Parallax background */}
        <motion.div
          aria-hidden
          className="absolute inset-0 bg-[url('/masonic-pillars.png')] bg-cover bg-bottom"
          style={{ y }}
        />
        {/* Dark overlay for contrast */}
        <div className="absolute inset-0 bg-primary-900/35" />

        {/* Main content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 pt-28 md:pt-36 pb-44 flex flex-col items-center text-center">
          <motion.img
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            src="/icon-512.png"
            alt="Radlett Lodge Crest"
            className="w-44 h-44 md:w-60 md:h-60 mx-auto mb-6 drop-shadow-2xl"
          />

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="text-5xl md:text-6xl font-heading font-bold mb-3 text-secondary-500"
          >
            Radlett Lodge No. 6652
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-lg md:text-xl"
          >
            Integrity • Friendship • Respect • Service
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-base md:text-lg text-secondary-100 mt-2"
          >
            A Masonic Lodge under the jurisdiction of the United Grand Lodge of
            England
          </motion.p>

          {/* CTA row (beneath counters visually on small screens it will still be visible) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7 }}
            className="flex flex-col sm:flex-row justify-center gap-4 mt-8"
          >
            <Link to="/about">
              <Button variant="primary" size="lg">
                Learn About Us
              </Button>
            </Link>
            <Link to="/join">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-primary-700"
              >
                Curious?
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Floating counters near bottom of hero */}
        <div className="pointer-events-none absolute inset-x-0 bottom-6 md:bottom-10 z-10">
          <div className="mx-auto max-w-4xl px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 opacity-70">
              {/* Founded */}
              <div className="pointer-events-auto bg-primary-900/25 backdrop-blur-sm rounded-xl p-5 border border-white/15 transition-transform hover:scale-[1.02]">
                <div className="text-secondary-400 mb-1 flex justify-center">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-semibold text-base mb-1 text-white">
                  Founded
                </h3>
                <p className="text-neutral-100 text-sm">1948</p>
              </div>
              {/* Members */}
              <div className="pointer-events-auto bg-primary-900/25 backdrop-blur-sm rounded-xl p-5 border border-white/15 transition-transform hover:scale-[1.02]">
                <div className="text-secondary-400 mb-1 flex justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-semibold text-base mb-1 text-white">
                  Active Members
                </h3>
                <p className="text-neutral-100 text-sm">40+</p>
              </div>
              {/* Charity */}
              <div className="pointer-events-auto bg-primary-900/25 backdrop-blur-sm rounded-xl p-5 border border-white/15 transition-transform hover:scale-[1.02]">
                <div className="text-secondary-400 mb-1 flex justify-center">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-semibold text-base mb-1 text-white">
                  Charity Raised
                </h3>
                <p className="text-neutral-100 text-sm">£50,000+ annually</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Warm ribbon under hero */}
      <section className="bg-primary-900 text-secondary-400 text-center py-4">
        <p className="text-sm md:text-base tracking-wide">
          Discover brotherhood, purpose, and personal growth in a timeless
          tradition.
        </p>
      </section>

      {/* Strong divider */}
      <SectionDivider variant="bold" />

      {/* Welcome section — image scales gracefully with content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-4xl font-heading font-bold text-primary-600 mb-6">
              Welcome to Our Lodge
            </h2>
            <p className="text-lg text-neutral-700 mb-6">
              Founded in 1948, Radlett Lodge No. 6652 is a vibrant Masonic Lodge
              operating within the Province of Hertfordshire.
            </p>
            <p className="text-lg text-neutral-700 mb-6">
              We are committed to personal growth, ethical conduct, and
              charitable giving — honouring centuries of Masonic tradition while
              remaining relevant today.
            </p>
            <Link to="/about">
              <Button variant="primary" className="mt-2">
                Discover Our History
              </Button>
            </Link>
          </div>
          <div className="relative">
            <img
              src="https://neoquuejwgcqueqlcbwj.supabase.co/storage/v1/object/public/cms-media/radlett-%20lodge-%20outside.jpg"
              alt="Radlett Lodge"
              className="w-full h-auto max-h-[520px] object-cover rounded-lg shadow-medium"
            />
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Core Values */}
      <CoreValuesSection />

      {/* Quote Banner */}
      <QuoteBanner />

      {/* Upcoming Event Spotlight (already in your style; no diary icon) */}
      <UpcomingEventSpotlight />

      <SectionDivider />

      {/* Member Experiences (enhanced component you’re adding) */}
      <section className="py-20 bg-primary-50">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Member Experiences"
            subtitle="Hear, feel, and understand what Freemasonry means in real lives."
            centered
          />
          {loading ? (
            <LoadingSpinner subtle />
          ) : testimonials.length > 0 ? (
            <MemberExperiences testimonials={testimonials} />
          ) : (
            <p className="text-center text-neutral-600 mt-6">
              Member portraits and stories are arriving shortly.
            </p>
          )}
        </div>
      </section>

      <SectionDivider />

      {/* News Section — with CTA under the cards */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Latest News"
            subtitle="Stay updated with the latest activities from our Lodge."
          />
          {loading ? (
            <LoadingSpinner subtle />
          ) : news.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                {news.map((n) => (
                  <NewsCard
                    key={n.id}
                    news={{
                      ...n,
                      summary: n.summary ?? "",
                      date: n.publish_date
                        ? new Date(n.publish_date)
                        : new Date(),
                    }}
                    onOpen={(post) => setSelectedNews(post)}
                  />
                ))}
              </div>

              {/* CTA under news cards */}
              <div className="text-center mt-10">
                <Link to="/news">
                  <Button variant="outline" className="hover:shadow-soft">
                    See all news — past and present
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <p className="text-center text-neutral-600 mt-6">
              No news articles yet.
            </p>
          )}
        </div>
      </section>

      {/* Modal for expanded news */}
      {selectedNews && (
        <NewsDetailsModal
          news={selectedNews}
          onClose={() => setSelectedNews(null)}
        />
      )}

      {/* Final, calm divider */}
      <SectionDivider variant="bold" shimmer={false} />
    </>
  );
};

export default HomePage;
