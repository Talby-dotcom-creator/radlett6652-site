// src/pages/AboutPage.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import SectionHeading from "../components/SectionHeading";
import Button from "../components/Button";
import OfficerCard from "../components/OfficerCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { optimizedApi } from "../lib/optimizedApi";
import { CMSOfficer } from "../types";
import { Users, Calendar, Award, BookOpen } from "lucide-react";

const AboutPage: React.FC = () => {
  const [officers, setOfficers] = useState<CMSOfficer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOfficers = async () => {
      try {
        setLoading(true);
        setError(null);
        const officersData = await optimizedApi.getOfficers();
        const active = officersData
          .filter((o: any) => o.is_active !== false)
          .sort((a: any, b: any) => a.sort_order - b.sort_order);
        setOfficers(active);
      } catch (err) {
        console.error("Error loading officers:", err);
        setError("Failed to load officers.");
        setOfficers([]);
      } finally {
        setLoading(false);
      }
    };
    loadOfficers();
  }, []);

  const convertOfficerData = (o: CMSOfficer) => ({
    id: o.id,
    position: o.position,
    name: o.full_name || o.name,
    image: o.image_url ?? undefined,
  });

  return (
    <>
      <HeroSection
        title="About Radlett Lodge No. 6652"
        subtitle="Learn about our history, principles, and the men who make up our Lodge"
        backgroundImage="https://neoquuejwgcqueqlcbwj.supabase.co/storage/v1/object/public/cms-media/banners/inside-lodge.jpg"
        verticalPosition="bottom"
      />

      {/* HISTORY SECTION */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* LEFT COLUMN — ALL TEXT HARD-CODED */}
            <div>
              <SectionHeading
                title="Our History"
                subtitle="A journey through time: Exploring the rich heritage of Radlett Lodge No. 6652 since 1948."
              />

              {/* --- Founding Years --- */}
              <h3 className="text-xl font-heading font-semibold text-primary-600 mt-6 mb-3 flex items-center">
                <Calendar className="w-5 h-5 text-secondary-500 mr-2" />
                The Founding Years: 1948–1960
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                Radlett Lodge No. 6652 was founded by a diverse group of friends
                residing in Radlett in the aftermath of World War II. The
                founding members included a doctor, a local businessman, a
                farmer, and a Savile Row tailor, among others. Facing a
                significant waiting list at the existing local lodge, they
                petitioned to form a new lodge that would meet on Saturdays.
              </p>
              <p className="text-neutral-600 leading-relaxed">
                With Elstree Lodge as its sponsor, Radlett Lodge was consecrated
                on May 31, 1948, by Admiral Sir Lionel Halsey, the Right
                Worshipful Provincial Grand Master. The ceremony marked the
                beginning of what would become a vibrant Masonic community in
                Hertfordshire.
              </p>

              {/* --- Growth --- */}
              <h3 className="text-xl font-heading font-semibold text-primary-600 mt-8 mb-3 flex items-center">
                <Award className="w-5 h-5 text-secondary-500 mr-2" />
                Growth and Evolution: 1960s–2000s
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                Throughout the latter half of the 20th century, Radlett Lodge
                flourished and evolved while maintaining its commitment to
                Masonic principles. The Lodge saw steady growth in membership,
                with Brothers from increasingly diverse professional backgrounds
                joining our ranks.
              </p>
              <p className="text-neutral-600 leading-relaxed">
                Many members achieved Provincial and Grand Lodge honours,
                bringing distinction to Radlett Lodge. Our commitment to ritual
                excellence and Masonic education became hallmarks of our
                identity within the Province of Hertfordshire.
              </p>

              {/* --- Modern Era --- */}
              <h3 className="text-xl font-heading font-semibold text-primary-600 mt-8 mb-3 flex items-center">
                <BookOpen className="w-5 h-5 text-secondary-500 mr-2" />
                The Modern Era: 21st Century
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                Today, Radlett Lodge continues to be a place where people from
                all walks of life come together to form a friendly and welcoming
                brotherhood. Whether a longstanding member or newly joined, all
                are encouraged to participate in Lodge activities with full
                support from their Brethren.
              </p>
              <p className="text-neutral-600 leading-relaxed">
                We have embraced modern approaches to communication and
                engagement while honouring our rich heritage. Our charitable
                work remains at the heart of our mission, with strong
                connections to the local community.
              </p>
            </div>

            {/* RIGHT COLUMN — IMAGE + TIMELINE */}
            <div className="space-y-8">
              <img
                src="https://neoquuejwgcqueqlcbwj.supabase.co/storage/v1/object/public/cms-media/images/Admiral%20Sir%20Lionel%20Halsey.webp"
                alt="Admiral Sir Lionel Halsey"
                className="rounded-lg shadow-medium w-full h-auto object-cover"
              />

              {/* Key Milestones (your 4 items) */}
              <div className="bg-neutral-50 rounded-lg p-6 shadow-soft">
                <h3 className="text-xl font-heading font-semibold text-primary-600 mb-4">
                  Key Milestones
                </h3>

                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-1/2 before:w-0.5 before:bg-secondary-200 before:h-full">
                  {/* 1948 */}
                  <div className="relative pl-8">
                    <div className="absolute left-0 top-1 w-4 h-4 bg-secondary-500 rounded-full"></div>
                    <h4 className="text-lg font-medium text-primary-600">
                      1948
                    </h4>
                    <p className="text-sm font-medium text-secondary-600 mb-1">
                      Consecration
                    </p>
                    <p className="text-neutral-600 text-sm">
                      Radlett Lodge No. 6652 was consecrated by Admiral Sir
                      Lionel Halsey, RW Provincial Grand Master.
                    </p>
                  </div>

                  {/* 1973 */}
                  <div className="relative pl-8">
                    <div className="absolute left-0 top-1 w-4 h-4 bg-secondary-500 rounded-full"></div>
                    <h4 className="text-lg font-medium text-primary-600">
                      1973
                    </h4>
                    <p className="text-sm font-medium text-secondary-600 mb-1">
                      25th Anniversary
                    </p>
                    <p className="text-neutral-600 text-sm">
                      Celebrated 25 years with a special meeting attended by the
                      Provincial Grand Master.
                    </p>
                  </div>

                  {/* 1998 */}
                  <div className="relative pl-8">
                    <div className="absolute left-0 top-1 w-4 h-4 bg-secondary-500 rounded-full"></div>
                    <h4 className="text-lg font-medium text-primary-600">
                      1998
                    </h4>
                    <p className="text-sm font-medium text-secondary-600 mb-1">
                      Golden Jubilee
                    </p>
                    <p className="text-neutral-600 text-sm">
                      Golden Jubilee celebration with commemorative jewels
                      issued to all members.
                    </p>
                  </div>

                  {/* 2023 */}
                  <div className="relative pl-8">
                    <div className="absolute left-0 top-1 w-4 h-4 bg-secondary-500 rounded-full"></div>
                    <h4 className="text-lg font-medium text-primary-600">
                      2023
                    </h4>
                    <p className="text-sm font-medium text-secondary-600 mb-1">
                      75th Anniversary
                    </p>
                    <p className="text-neutral-600 text-sm">
                      Diamond Jubilee celebration and special commemorative
                      meeting.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* end right column */}
          </div>
        </div>
      </section>

      {/* ABOUT FREEMASONRY */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading
            title="About Freemasonry"
            subtitle="Freemasonry is one of the world's oldest secular fraternal societies."
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            <div className="bg-white rounded-lg p-6 shadow-soft">
              <h3 className="text-xl font-heading font-semibold text-primary-600 mb-3">
                Who We Are
              </h3>
              <p className="text-neutral-600">
                Freemasons are a diverse group of men from all walks of life who
                share common values of integrity, kindness, honesty, and
                fairness. We come together to build friendships, support each
                other, and contribute to our communities.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-soft">
              <h3 className="text-xl font-heading font-semibold text-primary-600 mb-3">
                What We Do
              </h3>
              <p className="text-neutral-600">
                We meet regularly in our Lodge to conduct ceremonial rituals
                that teach moral lessons, engage in social activities, support
                charitable causes, and work together on personal development. We
                aim to make a positive impact in our local communities and the
                wider world.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-soft">
              <h3 className="text-xl font-heading font-semibold text-primary-600 mb-3">
                Our Principles
              </h3>
              <p className="text-neutral-600">
                Freemasonry is founded on the principles of Brotherly Love,
                Relief, and Truth. We practice charity, promote tolerance,
                maintain high moral standards, and encourage members to be good
                citizens who contribute positively to society.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/join">
              <Button>Learn How to Join</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* OFFICERS */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading
            title="Current Lodge Officers"
            subtitle="Meet the Brethren who lead and serve Radlett Lodge No. 6652"
            centered
          />

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-600">
              {error}
            </div>
          )}

          {loading ? (
            <LoadingSpinner subtle={true} className="py-4" />
          ) : officers.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 mt-12">
              {officers.map((o) => (
                <OfficerCard key={o.id} officer={convertOfficerData(o)} />
              ))}
            </div>
          ) : (
            <div className="bg-neutral-50 rounded-lg p-8 text-center mt-12">
              <Users className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
              <p className="text-neutral-600">No officers listed.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-20 bg-cover bg-center relative"
        style={{
          backgroundImage: `url(https://neoquuejwgcqueqlcbwj.supabase.co/storage/v1/object/public/cms-media/banners/radlett-lodge.webp)`,
        }}
      >
        <div className="absolute inset-0 bg-primary-900 opacity-80"></div>
        <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
            Experience the Brotherhood of Freemasonry
          </h2>
          <p className="text-lg text-neutral-100 max-w-3xl mx-auto mb-8">
            Radlett Lodge offers a welcoming environment for men seeking
            personal growth.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/join">
              <Button variant="primary" size="lg">
                Begin Your Journey
              </Button>
            </Link>

            <Link to="/contact">
              <Button variant="outline" size="lg">
                Contact Our Secretary
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
