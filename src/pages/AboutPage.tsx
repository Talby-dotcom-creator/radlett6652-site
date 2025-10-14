// src/pages/AboutPage.tsx
import React, { useEffect, useState } from "react";
import optimizedApi from "../lib/optimizedApi";
import LoadingSpinner from "../components/LoadingSpinner";
import { Officer, Testimonial } from "../types";

const AboutPage: React.FC = () => {
  const [aboutContent, setAboutContent] = useState<string | null>(null);
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [snippetHtml, setSnippetHtml] = useState<string | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);

        const [about, officersData, testimonialsData] = await Promise.all([
          optimizedApi.getPageContent("about-radlett-lodge"),
          optimizedApi.getOfficers(),
          optimizedApi.getTestimonials(),
        ]);

        const snippets = await optimizedApi.getBlogPosts("snippet");

        setAboutContent(about?.content ?? null);
        setOfficers(officersData ?? []);
        setSnippetHtml(snippets?.[0]?.content ?? null);
        setTestimonials(testimonialsData ?? []);

        console.log("✅ Testimonials loaded:", testimonialsData);
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
    <main className="w-full overflow-hidden">
      {/* 1️⃣ OUR HISTORY */}
      <section className="container mx-auto px-4 md:px-8 py-16">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-neutral-900 mb-8 text-center">
          Our History
        </h1>
        {aboutContent ? (
          <article
            className="prose lg:prose-lg mx-auto text-neutral-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: aboutContent }}
          />
        ) : (
          <p className="text-center text-neutral-600">
            No historical content available at this time.
          </p>
        )}
      </section>

      {/* 2️⃣ ABOUT FREEMASONRY */}
      <section className="bg-neutral-100 py-20">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-neutral-900 mb-4">
            About Freemasonry
          </h2>
          <p className="text-lg text-neutral-700 max-w-3xl mx-auto mb-12">
            Freemasonry is one of the world's oldest secular fraternal
            societies, dedicated to making good men better.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-10">
            {[
              {
                title: "Who We Are",
                text: "Freemasons are a diverse group of men from all walks of life who share common values of integrity, kindness, honesty, and fairness. We come together to build friendships, support each other, and contribute to our communities.",
              },
              {
                title: "What We Do",
                text: "We meet regularly in our Lodge to conduct ceremonial rituals that teach moral lessons, engage in social activities, support charitable causes, and work together on personal development.",
              },
              {
                title: "Our Principles",
                text: "Freemasonry is founded on the principles of Brotherly Love, Relief, and Truth. We practice charity, promote tolerance, maintain high moral standards, and encourage members to be good citizens who contribute positively to society.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold text-primary-700 mb-3">
                  {item.title}
                </h3>
                <p className="text-neutral-700 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <a
              href="/join"
              className="px-6 py-3 rounded-lg bg-secondary-600 text-white text-lg font-medium hover:bg-secondary-700 transition shadow-md"
            >
              Learn How to Join
            </a>
          </div>
        </div>
      </section>

      {/* 3️⃣ REFLECTIONS IN STONE */}
      <section
        id="reflections"
        className="relative w-full py-24 md:py-32 bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: "url('/images/churchyard.webp')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/40" />
        <div className="container relative z-10 mx-auto px-4 text-center text-neutral-50">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 tracking-wide">
            Reflections in Stone
          </h2>
          <div
            className="max-w-3xl mx-auto text-lg leading-relaxed text-neutral-100 font-serif animate-engrave"
            dangerouslySetInnerHTML={{
              __html: snippetHtml || "<p>Loading reflections...</p>",
            }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer pointer-events-none" />
      </section>

      {/* 4️⃣ CURRENT LODGE OFFICERS */}
      <section className="container mx-auto px-4 md:px-8 py-16">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-neutral-900 mb-8 text-center">
          Current Lodge Officers
        </h2>

        {officers.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {officers.map((officer) => (
              <div
                key={officer.id}
                className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center transition-transform hover:scale-105 hover:shadow-lg duration-300"
              >
                {officer.image_url ? (
                  <img
                    src={officer.image_url}
                    alt={officer.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mb-4 object-cover border border-neutral-300"
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 mb-4 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-500 text-sm">
                    No Image
                  </div>
                )}
                <h3 className="text-lg font-semibold text-primary-700 mb-1">
                  {officer.name}
                </h3>
                <p className="text-neutral-700 text-sm font-medium">
                  {officer.position}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-neutral-600">No officers found.</p>
        )}
      </section>

      {/* 5️⃣ MEMBER EXPERIENCES */}
      <section className="bg-neutral-50 py-20">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-neutral-900 mb-12">
            Member Experiences
          </h2>
          <p className="text-lg text-neutral-700 max-w-2xl mx-auto mb-16">
            Hear from some of our members about their Masonic journey.
          </p>

          {testimonials.length > 0 ? (
            <div className="grid gap-10 md:grid-cols-3">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center text-center"
                >
                  {t.image_url ? (
                    <img
                      src={t.image_url}
                      alt={t.member_name}
                      className="w-24 h-24 rounded-full object-cover border border-neutral-200 mb-4"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-neutral-200 mb-4 flex items-center justify-center text-neutral-500">
                      No Image
                    </div>
                  )}
                  <p className="text-neutral-700 italic mb-4 leading-relaxed">
                    “{t.content}”
                  </p>
                  <h4 className="font-semibold text-primary-700">
                    {t.member_name}
                  </h4>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-neutral-600">
              No testimonials available at this time.
            </p>
          )}
        </div>
      </section>

      {/* 6️⃣ CTA FOOTER */}
      <section className="bg-primary-900 text-white text-center py-20">
        <h3 className="text-2xl md:text-3xl font-heading font-bold mb-3">
          Interested in Becoming a Freemason?
        </h3>
        <p className="opacity-90 mb-6">
          Discover friendship, fulfilment, and the opportunity to make a
          difference.
        </p>
        <div className="flex gap-3 justify-center">
          <a
            href="/join"
            className="px-6 py-3 rounded-lg bg-secondary-600 text-white hover:bg-secondary-700 transition"
          >
            Learn How to Join
          </a>
          <a
            href="/contact"
            className="px-6 py-3 rounded-lg bg-white/10 ring-1 ring-white/30 hover:bg-white/15 transition"
          >
            Contact Us
          </a>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
