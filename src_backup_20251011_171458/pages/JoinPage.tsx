// src/pages/JoinPage.tsx
import React, { useState, useEffect } from "react";
import { Check, Users, Heart, Target, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import HeroSection from "../components/HeroSection";
import SectionHeading from "../components/SectionHeading";
import Button from "../components/Button";
import FaqItem from "../components/FaqItem";
import LoadingSpinner from "../components/LoadingSpinner";
import { optimizedApi as cmsApi } from "../lib/optimizedApi";
import { FAQItem } from "../types";

const JoinPage: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFAQs = async () => {
      try {
        setLoading(true);
        setError(null);
        const faqData = await cmsApi.getFAQItems?.();
        const publishedFAQs = (faqData ?? [])
          .filter((faq) => faq.is_published)
          .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
        setFaqs(publishedFAQs);
      } catch (err) {
        console.error("Error loading FAQs:", err);
        setError("Failed to load FAQ items. Please try again later.");
        setFaqs([]);
      } finally {
        setLoading(false);
      }
    };
    loadFAQs();
  }, []);

  const convertFAQData = (cmsFAQ: FAQItem) => ({
    question: cmsFAQ.question,
    answer: cmsFAQ.answer,
  });

  return (
    <>
      {/* SEO */}
      <Helmet>
        <title>
          Join Radlett Lodge No. 6652 – Freemasonry in Hertfordshire
        </title>
        <meta
          name="description"
          content="Learn how to become a Freemason at Radlett Lodge No. 6652. Discover the process, requirements, and values of Freemasonry in Hertfordshire."
        />
      </Helmet>

      {/* Hero */}
      <HeroSection
        title="Join Radlett Lodge No. 6652"
        subtitle="Begin your journey into Freemasonry with our welcoming Lodge community"
        backgroundImage="/images/hero-join.webp"
        overlayOpacity={0.55}
        verticalPosition="bottom"
      />

      {/* Why Join Section */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading
            title="Why Join Radlett Lodge?"
            subtitle="Freemasonry offers friendship, personal growth, and a lifelong sense of belonging."
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              {
                icon: Users,
                title: "Belonging and Brotherhood",
                text: "Share in a centuries-old bond of friendship, built on mutual respect and integrity.",
              },
              {
                icon: Target,
                title: "Personal Growth",
                text: "Develop confidence, leadership, and self-understanding through symbolic lessons and teamwork.",
              },
              {
                icon: Heart,
                title: "Community Impact",
                text: "Help support Masonic and local charities that make a real difference in people’s lives.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg hover:scale-105 transition-transform duration-300"
              >
                <item.icon
                  className="mx-auto mb-4 text-secondary-600"
                  size={42}
                />
                <h3 className="text-xl font-semibold text-primary-700 mb-3">
                  {item.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Becoming a Freemason */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeading
                title="Becoming a Freemason"
                subtitle="Freemasonry welcomes men of good character who believe in a Supreme Being and want to contribute to their communities."
              />
              <p className="mb-6 text-neutral-600">
                Joining Radlett Lodge is the beginning of a lifelong journey of
                personal development, fellowship, and service. Our members come
                from all walks of life, backgrounds, and beliefs, united by
                shared values and a desire to make a positive impact on the
                world.
              </p>
              <p className="text-neutral-600">
                The process of becoming a Freemason is thoughtful and
                deliberate. We take time to get to know potential members, and
                for them to get to know us, ensuring that Freemasonry is the
                right path for each individual.
              </p>
            </div>
            <img
              src="https://neoquuejwgcqueqlcbwj.supabase.co/storage/v1/object/public/cms-media/square%20and%20compassess_1753698024921_8fjcl0.jpg"
              alt="Square and Compass - Masonic Symbols"
              className="rounded-lg shadow-medium w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading
            title="Membership Requirements"
            subtitle="To be eligible for membership in Radlett Lodge No. 6652, you must meet the following criteria:"
            centered
          />

          <div className="max-w-3xl mx-auto mt-12">
            <div className="bg-white rounded-lg shadow-medium p-6 md:p-8">
              <ul className="space-y-4">
                <RequirementItem text="Be a man of at least 21 years of age" />
                <RequirementItem text="Believe in a Supreme Being (all faiths are welcome)" />
                <RequirementItem text="Be of good character and reputation" />
                <RequirementItem text="Have a sincere desire to improve yourself and contribute to your community" />
                <RequirementItem text="Be able to afford the financial commitments without detriment to your family or livelihood" />
                <RequirementItem text="Be free of criminal convictions (minor offenses may be considered on a case-by-case basis)" />
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading
            title="The Path to Membership"
            subtitle="The journey to becoming a member of Radlett Lodge involves several steps:"
            centered
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {[
              "Initial Contact",
              "Lodge Visit",
              "Application",
              "Interview",
              "Lodge Ballot",
              "Initiation",
            ].map((title, i) => (
              <div
                key={i}
                className="bg-neutral-50 rounded-lg p-6 relative transition-transform hover:scale-105 hover:shadow-md"
              >
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-secondary-500 rounded-full flex items-center justify-center text-neutral-900 font-bold">
                  {i + 1}
                </div>
                <h3 className="text-xl font-heading font-semibold text-primary-600 mt-2 mb-3">
                  {title}
                </h3>
                <p className="text-neutral-600">{processDescriptions[i]}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/contact">
              <Button variant="primary" size="lg">
                Inquire About Membership
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Financial Commitments */}
      <section className="py-20 bg-primary-50">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading
            title="Financial Commitments"
            subtitle="Transparency about the financial aspects of membership is important to us."
            centered
          />

          <div className="max-w-3xl mx-auto mt-12">
            <div className="bg-white rounded-lg shadow-medium p-6 md:p-8">
              <p className="mb-6 text-neutral-600">
                Membership in Radlett Lodge, as with all Masonic Lodges,
                involves certain financial obligations. These typically include:
              </p>
              <FinancialList />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <SectionHeading
            title="What Our Members Say"
            subtitle="Hear from brethren who began their Masonic journey at Radlett Lodge."
            centered
          />
          <p className="text-neutral-500 italic mt-6">
            (Testimonials carousel coming soon)
          </p>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading
            title="Frequently Asked Questions"
            subtitle="Answers to common questions about Freemasonry and joining Radlett Lodge"
            centered
          />

          <div className="max-w-3xl mx-auto mt-12">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {loading ? (
              <LoadingSpinner subtle={true} className="py-4" />
            ) : faqs.length > 0 ? (
              <div className="bg-neutral-50 rounded-lg p-6 md:p-8">
                {faqs.map((faq) => (
                  <FaqItem key={faq.id} faq={convertFAQData(faq)} />
                ))}
              </div>
            ) : (
              <div className="bg-neutral-50 rounded-lg p-8 text-center">
                <HelpCircle className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
                <p className="text-neutral-600">
                  No FAQ items available at this time.
                </p>
                <p className="text-sm text-neutral-500 mt-2">
                  Check back soon for answers to common questions!
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-primary-600 text-white text-center">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
            Ready to Begin Your Masonic Journey?
          </h2>
          <p className="text-lg mb-8 max-w-3xl mx-auto text-neutral-100">
            If you're interested in joining Radlett Lodge No. 6652 or have
            additional questions, we'd love to hear from you. Our Secretary will
            be happy to provide more information and guide you through the first
            steps.
          </p>
          <Link to="/contact" className="inline-block mt-4">
            <Button variant="primary" size="lg">
              Contact Us Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer banner */}
      <section className="bg-primary-900 text-white text-center py-6">
        <p>
          Already a Freemason looking for a new Lodge?{" "}
          <Link
            to="/contact?source=join"
            className="underline hover:text-secondary-400"
          >
            Contact our Secretary
          </Link>{" "}
          to arrange a visit.
        </p>
      </section>
    </>
  );
};

/* ---------------- Helper Components ---------------- */

const RequirementItem: React.FC<{ text: string }> = ({ text }) => (
  <li className="flex items-center">
    <span className="text-secondary-500 mr-3 flex-shrink-0">
      <Check size={18} />
    </span>
    <span className="text-neutral-600">{text}</span>
  </li>
);

const FinancialList: React.FC = () => (
  <ul className="space-y-4 mb-6">
    {[
      {
        title: "One-time Initiation Fee",
        desc: "Covers your initiation ceremony and registration with the United Grand Lodge of England.",
      },
      {
        title: "Annual Subscription",
        desc: "Yearly dues that support the operation of the Lodge and Provincial/Grand Lodge assessments.",
      },
      {
        title: "Dining Fees",
        desc: "Covers the cost of meals at the Festive Board after Lodge meetings.",
      },
      {
        title: "Charitable Donations",
        desc: "Voluntary contributions to Masonic and local charities supported by the Lodge.",
      },
    ].map((item, i) => (
      <li key={i} className="flex items-start">
        <span className="text-secondary-500 mr-3 mt-1 flex-shrink-0">
          <Check size={18} />
        </span>
        <div>
          <span className="font-medium text-primary-600">{item.title}:</span>
          <p className="text-neutral-600">{item.desc}</p>
        </div>
      </li>
    ))}
  </ul>
);

const processDescriptions = [
  "Express your interest through our website or by contacting a current member. We'll arrange an informal meeting to discuss your interest in Freemasonry.",
  "Attend a social function to meet Lodge members and get a feel for our community. This gives both you and us a chance to determine if there's a good fit.",
  "Complete an application form, endorsed by two members who will serve as your proposer and seconder.",
  "Meet with a committee of Lodge members who will discuss your interest and answer any questions.",
  "Your application will be presented to the Lodge for a unanimous ballot of approval.",
  "Upon approval, you'll be initiated into the Lodge in a traditional ceremony marking your Masonic journey.",
];

export default JoinPage;
