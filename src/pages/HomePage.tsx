import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Users, Heart, BookOpen } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import SectionDivider from "../components/SectionDivider";
import SEOHead from "../components/SEOHead";
import Button from "../components/Button";
import EventCard from "../components/EventCard";
import NewsCard from "../components/NewsCard";
import TestimonialCard from "../components/TestimonialCard";
import StatsSection from "../components/StatsSection";
import CountdownTimer from "../components/CountdownTimer";
import LoadingSpinner from "../components/LoadingSpinner";
import optimizedApi from "../lib/optimizedApi";
import { Event, Testimonial, CMSBlogPost } from "../types";
import { motion } from "framer-motion";

const HomePage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [news, setNews] = useState<CMSBlogPost[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
              new Date(b.publish_date!).getTime() -
              new Date(a.publish_date!).getTime()
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

      {/* 🏛 Hero Section */}
      <section
        className="relative min-h-screen flex items-center justify-center text-white overflow-hidden"
        style={{
          backgroundImage: `url('/masonic-pillars.png')`,
          backgroundSize: "cover",
          backgroundPosition: "bottom center",
        }}
      >
        <div className="absolute inset-0 bg-primary-900 opacity-30" />
        <div className="relative z-10 text-center max-w-5xl mx-auto px-4">
          <img
            src="/icon-512.png"
            alt="Radlett Lodge Crest"
            className="w-48 h-48 md:w-64 md:h-64 mx-auto mb-6 drop-shadow-2xl"
          />
          <h1 className="text-5xl md:text-6xl font-heading font-bold mb-4 text-secondary-500">
            Radlett Lodge No. 6652
          </h1>
          <p className="text-xl mb-2">
            Integrity • Friendship • Respect • Service
          </p>
          <p className="text-lg text-secondary-100 mb-8">
            A Masonic Lodge under the jurisdiction of the United Grand Lodge of
            England
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
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
                Join Our Lodge
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ✨ Thicker ceremonial divider after hero */}
      <SectionDivider variant="bold" />

      {/* Countdown Timer */}
      <section className="bg-gradient-to-b from-primary-900 via-primary-800 to-primary-700 py-12 text-center text-white">
        <CountdownTimer useSchedule={true} />
      </section>

      {/* ✨ Thin divider after countdown */}
      <SectionDivider />

      {/* Introduction */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
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
              <Button variant="primary">Discover Our History</Button>
            </Link>
          </div>
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/2928232/pexels-photo-2928232.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="Masonic Temple Interior"
              className="rounded-lg shadow-medium"
            />
          </div>
        </div>
      </section>

      {/* ✨ Thin divider after intro */}
      <SectionDivider />

      {/* === Core Values Section === */}
      <section className="relative py-24 bg-gradient-to-b from-neutral-100 via-white to-neutral-50 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.3), transparent 60%)",
          }}
        />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <SectionHeading
            title="Our Core Values"
            subtitle="Freemasonry is founded on the timeless principles of Brotherly Love, Relief, and Truth."
            centered
          />
          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 mx-auto mt-6 mb-12 rounded-full shadow-md"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mt-8">
            {[
              {
                icon: "🤝",
                title: "Integrity",
                text: "Honesty, trust, honour, reliability, and conscience are the pillars of good character. They build integrity, earn trust, and reflect a life guided by strong values and consistent actions.",
              },
              {
                icon: "💙",
                title: "Friendship",
                text: "Freemasonry offers lifelong friendships with like-minded individuals, creating a strong sense of belonging, enjoyment, and fulfilment.",
              },
              {
                icon: "🕊️",
                title: "Respect",
                text: "Freemasonry has always valued its members' beliefs, promoting inclusivity, diversity, and mutual respect across all backgrounds.",
              },
              {
                icon: "💫",
                title: "Service",
                text: "Helping others is at the heart of Freemasonry. Whether it’s fundraising, volunteering, or supporting local causes, Freemasons are committed to making a difference.",
              },
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: index * 0.15 }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.05,
                  boxShadow:
                    "0 0 20px rgba(255, 215, 0, 0.25), 0 12px 25px rgba(0,0,0,0.15)",
                }}
                className="bg-white/90 backdrop-blur-sm border border-neutral-200 rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="w-20 h-20 mx-auto mb-5 flex items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-yellow-500 shadow-inner text-3xl">
                  {value.icon}
                </div>
                <h3 className="text-xl font-heading font-semibold text-primary-700 mb-3">
                  {value.title}
                </h3>
                <p className="text-neutral-700 text-sm leading-relaxed">
                  {value.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ✨ Thin divider after Core Values */}
      <SectionDivider />

      {/* Stats */}
      <StatsSection />

      {/* ✨ Thin divider after Stats */}
      <SectionDivider />

      {/* Upcoming Events */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Upcoming Events"
            subtitle="Join us at our upcoming meetings and socials."
          />
          {loading ? (
            <LoadingSpinner subtle />
          ) : events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <p className="text-center text-neutral-600 mt-6">
              No upcoming events at the moment.
            </p>
          )}
        </div>
      </section>

      {/* ✨ Thin divider after Events */}
      <SectionDivider />

      {/* Testimonials */}
      <section className="py-20 bg-primary-50">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Member Experiences"
            subtitle="Hear from some of our members about their Masonic journey."
            centered
          />
          {loading ? (
            <LoadingSpinner subtle />
          ) : testimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {testimonials.map((t) => (
                <TestimonialCard key={t.id} testimonial={t} />
              ))}
            </div>
          ) : (
            <p className="text-center text-neutral-600 mt-6">
              No testimonials yet.
            </p>
          )}
        </div>
      </section>

      {/* ✨ Thin divider after Testimonials */}
      <SectionDivider />

      {/* News */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Latest News"
            subtitle="Stay updated with the latest activities from our Lodge."
          />
          {loading ? (
            <LoadingSpinner subtle />
          ) : news.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              {news.map((n) => (
                <NewsCard
                  key={n.id}
                  news={{ ...n, summary: n.summary ?? "" }}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-neutral-600 mt-6">
              No news articles yet.
            </p>
          )}
        </div>
      </section>

      {/* ✨ Thicker ceremonial divider before footer */}
      <SectionDivider variant="bold" shimmer={false} />

      {/* Footer */}
      <footer className="bg-primary-900 text-white pt-16 pb-8 border-t border-secondary-700">
        <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-xl font-heading font-bold text-secondary-400 mb-4">
              Radlett Lodge No. 6652
            </h3>
            <p className="text-sm text-neutral-300">
              A Freemasons lodge under the United Grand Lodge of England,
              fostering brotherhood, charity, and integrity.
            </p>
          </div>

          <div>
            <h4 className="text-secondary-400 font-semibold mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/join">Join Us</Link>
              </li>
              <li>
                <Link to="/events">Events</Link>
              </li>
              <li>
                <Link to="/news">News</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-secondary-400 font-semibold mb-3">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/faqs">FAQs</a>
              </li>
              <li>
                <a
                  href="https://www.ugle.org.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  United Grand Lodge of England
                </a>
              </li>
              <li>
                <a
                  href="https://pglherts.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Provincial Grand Lodge of Hertfordshire
                </a>
              </li>
              <li>
                <Link to="/privacy">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms">Terms of Use</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-secondary-400 font-semibold mb-3">
              Contact Us
            </h4>
            <ul className="space-y-2 text-sm text-neutral-300">
              <li>
                Radlett Masonic Centre, Rose Walk, Radlett, Hertfordshire WD7
                7JS
              </li>
              <li>
                <a
                  href="mailto:radlet6652@gmail.com"
                  className="hover:text-secondary-300"
                >
                  radlet6652@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:07590800657" className="hover:text-secondary-300">
                  07590 800657
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="container mx-auto px-4 mt-12 pt-6 border-t border-primary-800 text-center text-sm text-neutral-400">
          <p>
            © {new Date().getFullYear()} Radlett Lodge No. 6652. All rights
            reserved.
          </p>
          <p className="mt-1">
            Under the Constitution of the United Grand Lodge of England
          </p>
        </div>
      </footer>
    </>
  );
};

export default HomePage;
