import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Users, Heart } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

import SectionHeading from "../components/SectionHeading";
import SectionDivider from "../components/SectionDivider";
import SEOHead from "../components/SEOHead";
import Button from "../components/Button";
import NewsCard from "../components/NewsCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { optimizedApi } from "../lib/optimizedApi";
import { Event, CMSBlogPost, Testimonial } from "../types";
import CoreValuesSection from "../components/CoreValuesSection";
import UpcomingEventSpotlight from "../components/UpcomingEventSpotlight";
import MemberExperiences from "../components/MemberExperiences";
import NewsDetailsModal from "../components/NewsDetailsModal";
import QuoteBanner from "../components/QuoteBanner";
import WelcomeToOurLodge from "../components/WelcomeToOurLodge";

const HomePage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [news, setNews] = useState<CMSBlogPost[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
  const [selectedNews, setSelectedNews] = useState<CMSBlogPost | null>(null);

  // Parallax for hero background
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 400], [0, 60]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [eventsData, newsData, testimonialsData] = await Promise.all([
          optimizedApi.getEvents(),
          optimizedApi.getBlogPosts(),
          optimizedApi.getTestimonials
            ? optimizedApi.getTestimonials()
            : Promise.resolve([]),
        ]);

        const sortedEvents = (eventsData as Event[]).sort(
          (a: Event, b: Event) => {
            const ta = a?.event_date ? new Date(a.event_date).getTime() : 0;
            const tb = b?.event_date ? new Date(b.event_date).getTime() : 0;
            return ta - tb;
          }
        );

        const sortedNews = (newsData as CMSBlogPost[]).sort(
          (a: CMSBlogPost, b: CMSBlogPost) => {
            const ta = a?.publish_date ? new Date(a.publish_date).getTime() : 0;
            const tb = b?.publish_date ? new Date(b.publish_date).getTime() : 0;
            return tb - ta;
          }
        );

        const sortedTestimonials = (
          (testimonialsData as Testimonial[]) || []
        ).sort(
          (a: Testimonial, b: Testimonial) =>
            (a.sort_order ?? 0) - (b.sort_order ?? 0)
        );

        setEvents(sortedEvents);
        setNews(sortedNews);
        setTestimonials(sortedTestimonials ?? []);
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

      {/* 🏛 HERO */}
      <section className="relative min-h-screen text-white overflow-hidden bg-[url('/masonic-pillars.png')] bg-cover bg-bottom">
        <motion.div
          aria-hidden
          className="absolute inset-0 bg-primary-800/25"
          style={{ y }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-4 pt-40 md:pt-52 pb-44 flex flex-col items-center text-center">
          <motion.img
            initial={{ opacity: 0, scale: 0.5, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: 1.4,
              ease: [0.25, 0.1, 0.25, 1],
              type: "spring",
              stiffness: 120,
              damping: 15,
            }}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.4, ease: "easeOut" },
            }}
            src="/icon-512.png"
            alt="Radlett Lodge Crest"
            className="w-44 h-44 md:w-60 md:h-60 mx-auto mb-6 drop-shadow-[0_8px_15px_rgba(0,0,0,0.45)]"
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

        {/* Info boxes */}
        <div
          className="animate-fadeIn grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mt-40"
          style={{ animationDelay: "0.7s" }}
        >
          <div className="bg-primary-900/60 backdrop-blur-sm rounded-lg p-4 border border-secondary-500/30 text-center transform transition-all duration-300 hover:scale-105">
            <Calendar className="w-6 h-6 text-secondary-400 mb-2" />
            <h3 className="font-heading font-semibold text-base text-neutral-100 mb-1">
              Founded
            </h3>
            <p className="text-neutral-300 text-sm">1948</p>
          </div>

          <div className="bg-primary-900/60 backdrop-blur-sm rounded-lg p-4 border border-secondary-500/30 text-center transform transition-all duration-300 hover:scale-105">
            <Users className="w-6 h-6 text-secondary-400 mb-2" />
            <h3 className="font-heading font-semibold text-base text-neutral-100 mb-1">
              Active Members
            </h3>
            <p className="text-neutral-300 text-sm">40+</p>
          </div>

          <div className="bg-primary-900/60 backdrop-blur-sm rounded-lg p-4 border border-secondary-500/30 text-center transform transition-all duration-300 hover:scale-105">
            <Heart className="w-6 h-6 text-secondary-400 mb-2" />
            <h3 className="font-heading font-semibold text-base text-neutral-100 mb-1">
              Charity Raised
            </h3>
            <p className="text-neutral-300 text-sm">£50,000+ annually</p>
          </div>
        </div>
      </section>

      <SectionDivider variant="bold" />

      {/* Welcome */}
      <WelcomeToOurLodge />

      <SectionDivider />

      {/* Core Values */}
      <CoreValuesSection />

      {/* Quote Banner */}
      <QuoteBanner />

      {/* Upcoming Event Spotlight */}
      <UpcomingEventSpotlight />

      <SectionDivider />

      {/* Member Experiences */}
      <MemberExperiences />

      <SectionDivider />

      {/* 🗞️ News Section — only top 3 true “news” posts */}
      <section
        className="relative py-20 text-neutral-900 overflow-hidden"
        style={{
          backgroundImage:
            "url('https://neoquuejwgcqueqlcbwj.supabase.co/storage/v1/object/public/cms-media/images%20/old-newspaper-light.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px]" />

        <div className="relative z-10 container mx-auto px-4">
          <SectionHeading
            title="Latest News"
            subtitle="Stay updated with the latest activities from our Lodge."
          />

          {loading ? (
            <LoadingSpinner subtle />
          ) : news.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                {news
                  .filter(
                    (n) =>
                      n.category?.toLowerCase() === "news" &&
                      n.is_published !== false
                  )
                  .slice(0, 3)
                  .map((n) => (
                    <NewsCard
                      key={n.id}
                      news={{
                        ...n,
                        summary: n.summary ?? "",
                      }}
                      onOpen={(post) => setSelectedNews(post)}
                    />
                  ))}
              </div>

              <div className="text-center mt-10">
                <Link to="/news">
                  <Button
                    variant="outline"
                    className="hover:shadow-[0_0_15px_rgba(255,215,0,0.4)] transition-all duration-300"
                  >
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

      {selectedNews && (
        <NewsDetailsModal
          news={selectedNews}
          onClose={() => setSelectedNews(null)}
        />
      )}

      <SectionDivider variant="bold" shimmer={false} />
    </>
  );
};

export default HomePage;
