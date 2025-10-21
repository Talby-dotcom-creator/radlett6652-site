import React, { useEffect, useState } from "react";
import { Calendar, Users, Scale } from "lucide-react";
import HeroSection from "../components/HeroSection";
import MilestoneBlock from "../components/MilestoneBlock";
import AboutStatsSection from "../components/AboutStatsSection";
import LoadingSpinner from "../components/LoadingSpinner";
import MotionSection from "../components/MotionSection";
import { optimizedApi as api } from "../lib/optimizedApi";

const AboutPage: React.FC = () => {
  const [historySections, setHistorySections] = useState<
    Record<string, string>
  >({});
  const [officers, setOfficers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const sections = ["founding_story", "growth_story", "modern_era"];
        const results: Record<string, string> = {};

        for (const section of sections) {
          const content = await api.getPageSection?.(
            "about-radlett-lodge",
            section
          );
          if (content) results[section] = content;
        }

        const officersData = await api.getOfficers?.();
        setHistorySections(results);
        setOfficers(officersData ?? []);
      } catch (err) {
        console.error("Error loading About page:", err);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-white text-gray-900">
      {/* 🏛️ HERO SECTION */}
      <HeroSection
        title="Discover the Story of Radlett Lodge No. 6652"
        subtitle="A proud heritage built on brotherhood, charity, and tradition since 1948."
        backgroundImage="/inside-of-radlett-hall.jpg"
        overlayOpacity={0.4}
        verticalPosition="bottom"
      />

      <main>
        {/* 🕰 OUR HISTORY */}
        <MotionSection className="py-16 px-4 md:px-16">
          <div className="max-w-6xl mx-auto space-y-12">
            {/* 🟡 Lodge Gold Heading */}
            <h1 className="text-4xl font-heading font-bold lodge-heading text-center mb-12">
              About Radlett Lodge
            </h1>

            <div className="flex flex-col md:flex-row items-start gap-10">
              {/* LEFT — History text */}
              <div className="md:w-1/2 w-full">
                <article>
                  <h3 className="text-2xl font-semibold text-oxford-blue flex items-center gap-2">
                    <Calendar className="text-yellow-500" /> The Founding Years:
                    1948–1960
                  </h3>
                  <div
                    className="mt-4 text-lg leading-relaxed text-gray-800"
                    dangerouslySetInnerHTML={{
                      __html: historySections["founding_story"] || "",
                    }}
                  />
                </article>

                <article>
                  <h3 className="text-2xl font-semibold text-oxford-blue flex items-center gap-2 mt-8">
                    <Users className="text-yellow-500" /> Growth and Evolution:
                    1960s–2000s
                  </h3>
                  <div
                    className="mt-4 text-lg leading-relaxed text-gray-800"
                    dangerouslySetInnerHTML={{
                      __html: historySections["growth_story"] || "",
                    }}
                  />
                </article>
              </div>

              {/* RIGHT — Admiral + Milestone */}
              <div className="md:w-1/2 w-full flex flex-col items-end">
                <div className="w-full overflow-hidden rounded-2xl border border-neutral-200 shadow-lg">
                  <img
                    src="https://neoquuejwgcqueqlcbwj.supabase.co/storage/v1/object/public/cms-media/admiral_halsey.webp"
                    alt="Admiral Sir Lionel Halsey — Founding Member of Radlett Lodge"
                    className="w-full h-auto object-cover object-top md:max-h-[650px]"
                  />
                </div>

                <div className="-mt-[2px] w-full">
                  <MilestoneBlock />
                </div>
              </div>
            </div>

            {/* MODERN ERA */}
            <section className="mt-10">
              <h3 className="text-2xl font-semibold text-oxford-blue flex items-center gap-2 mb-4">
                The Modern Era: 21st Century
              </h3>
              <div
                className="text-lg leading-relaxed text-gray-800 text-justify"
                dangerouslySetInnerHTML={{
                  __html: historySections["modern_era"] || "",
                }}
              />
            </section>
          </div>
        </MotionSection>

        {/* 🔶 DIVIDER */}
        <div className="w-24 h-[3px] bg-yellow-500 mx-auto mb-20 rounded-full"></div>

        {/* ⚜️ Our Heritage & Charity Stats */}
        <AboutStatsSection />

        {/* 🧭 ABOUT FREEMASONRY */}
        <MotionSection className="bg-gray-100 py-24">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-heading font-bold lodge-heading mb-4">
              About Freemasonry
            </h2>
            <p className="text-lg text-gray-700 mb-12 max-w-3xl mx-auto">
              Freemasonry is one of the world's oldest secular fraternal
              societies, dedicated to making good men better.
            </p>

            <div className="grid md:grid-cols-3 gap-10">
              {[
                {
                  icon: Calendar,
                  title: "Who We Are",
                  text: "Freemasons are a diverse group of men from all walks of life who share common values of integrity, kindness, honesty, and fairness.",
                },
                {
                  icon: Users,
                  title: "What We Do",
                  text: "We meet regularly in our Lodge to conduct ceremonial rituals that teach moral lessons and promote charity and fellowship.",
                },
                {
                  icon: Scale,
                  title: "Our Principles",
                  text: "Freemasonry is founded on the principles of Brotherly Love, Relief, and Truth — guiding us to live with integrity and compassion.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-transform hover:scale-105 duration-300"
                >
                  <item.icon className="w-10 h-10 mx-auto mb-4 text-yellow-500" />
                  <h3 className="text-xl font-semibold mb-3 text-oxford-blue">
                    {item.title}
                  </h3>
                  <p className="text-gray-700">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <a
                href="/join"
                className="inline-block bg-yellow-500 text-oxford-blue font-semibold px-8 py-4 rounded-lg hover:bg-yellow-400 transition"
              >
                Join Us
              </a>
            </div>
          </div>
        </MotionSection>

        {/* 🔶 DIVIDER */}
        <div className="w-24 h-[3px] bg-yellow-500 mx-auto mb-20 rounded-full"></div>

        {/* 🕊️ Masonic Motto Banner */}
        <MotionSection
          className="py-12 bg-oxford-blue text-center text-white"
          aria-label="Masonic Motto Banner"
        >
          <div className="max-w-4xl mx-auto px-6">
            <p className="text-2xl md:text-3xl italic font-semibold text-yellow-400">
              "To be one, ask one"
            </p>
            <p className="mt-3 text-lg text-gray-100">
              Upholding the values of Brotherly Love, Relief, and Truth since
              1948.
            </p>
          </div>
        </MotionSection>

        {/* 👔 CURRENT LODGE OFFICERS */}
        <MotionSection className="max-w-7xl mx-auto px-6 py-24">
          <h2 className="text-4xl font-heading font-bold lodge-heading mb-2 text-center">
            Current Lodge Officers
          </h2>
          <p className="text-lg text-gray-600 mb-12 text-center">
            Meet the Brethren who lead and serve Radlett Lodge No. 6652
          </p>

          <div className="flex flex-wrap justify-between gap-6">
            {officers
              .filter((officer) => officer.is_active)
              .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
              .slice(0, 6)
              .map((officer) => (
                <div
                  key={officer.id}
                  className="flex-1 min-w-[150px] max-w-[180px] bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-center"
                >
                  <img
                    src={
                      officer.image_url && officer.image_url.trim() !== ""
                        ? officer.image_url
                        : "/images/officer-placeholder.png"
                    }
                    alt={officer.full_name}
                    className="w-full h-[260px] object-cover rounded-t-xl"
                    onError={(e) => {
                      e.currentTarget.src = "/images/officer-placeholder.png";
                    }}
                  />
                  <div className="p-4">
                    <h3 className="text-md font-semibold text-oxford-blue">
                      {officer.full_name}
                    </h3>
                    <p className="text-gray-600 font-medium">
                      {officer.position}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </MotionSection>

        {/* 🕊️ FINAL CTA SECTION */}
        <section className="text-white text-center py-20 bg-oxford-blue">
          <h2 className="text-4xl font-heading font-bold lodge-heading mb-4">
            Experience the Brotherhood of Freemasonry
          </h2>
          <p className="max-w-2xl mx-auto text-lg mb-8 text-gray-200">
            Radlett Lodge offers a welcoming environment for men seeking moral,
            intellectual, and spiritual growth through the teachings and
            traditions of Freemasonry.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/join"
              className="bg-yellow-500 hover:bg-yellow-400 text-oxford-blue font-semibold px-6 py-3 rounded-lg transition"
            >
              Begin Your Journey
            </a>
            <a
              href="/contact"
              className="border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-oxford-blue font-semibold px-6 py-3 rounded-lg transition"
            >
              Contact Our Secretary
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutPage;
