// src/pages/JoinPage.tsx
import React, { useState, useEffect } from "react";
import { Check, HelpCircle, Sparkles, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SectionHeading from "../components/SectionHeading";
import Button from "../components/Button";
import FaqItem from "../components/FaqItem";
import LoadingSpinner from "../components/LoadingSpinner";
import { cmsApi } from "../lib/cmsApi";
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

        const faqData = await cmsApi.getFAQItems();
        const publishedFAQs = (faqData || [])
          .filter((faq: FAQItem) => faq.is_published !== false)
          .sort(
            (a: FAQItem, b: FAQItem) =>
              (a.sort_order ?? 0) - (b.sort_order ?? 0)
          );

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
      {/* DARK HERO SECTION */}
      <section className="relative min-h-[70vh] bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Glowing orbs */}
          <motion.div
            className="absolute top-20 right-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 py-24 md:py-32">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 backdrop-blur-sm border border-amber-500/20 mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-amber-300 text-sm font-medium">
                Join Our Brotherhood
              </span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Begin Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300">
                Masonic Journey
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-amber-100/80 text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Join Radlett Lodge No. 6652 and become part of a tradition
              spanning over seven decades of fellowship, personal growth, and
              service to the community.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <Link to="/contact">
                <Button
                  variant="primary"
                  size="lg"
                  className="group bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300"
                >
                  Start Your Journey
                  <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <a href="#requirements">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-amber-400/30 text-amber-100 hover:bg-amber-400/10 hover:border-amber-400/50 backdrop-blur-sm transition-all duration-300"
                >
                  Learn More
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* INTRODUCTION */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionHeading
              title="Becoming a Freemason"
              subtitle="Freemasonry welcomes men of good character who believe in a Supreme Being and want to contribute to their communities."
            />
            <p className="mb-6 text-neutral-600">
              Joining Radlett Lodge is the beginning of a lifelong journey of
              personal development, fellowship, and service. Our members come
              from all walks of life and professions — united by shared values
              and a desire to make a positive impact on the world.
            </p>
            <p className="text-neutral-600">
              The process of becoming a Freemason is thoughtful and deliberate.
              We take time to get to know potential members, and for them to get
              to know us, ensuring that Freemasonry is the right path for each
              individual.
            </p>
          </div>
          <div className="relative transform transition-transform duration-300 hover:scale-[1.02]">
            {/* Layered shadow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-400/20 to-neutral-600/20 rounded-xl blur-2xl translate-y-4 translate-x-2"></div>
            <img
              src="https://neoquuejwgcqueqlcbwj.supabase.co/storage/v1/object/public/cms-media/banners/1948-minutes.jpg"
              alt="Masonic symbols"
              className="relative rounded-xl w-full h-auto object-cover border-4 border-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4),0_10px_30px_-10px_rgba(0,0,0,0.3)] ring-1 ring-neutral-200"
              style={{
                transform: "translateZ(0)",
                maxHeight: "600px",
                objectFit: "cover",
              }}
            />
            {/* Callout Caption */}
            <div className="mt-6 bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-500 rounded-r-lg p-4 shadow-lg">
              <p className="text-sm font-medium text-amber-900 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <span className="italic">Original Minutes book from 1948</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* REQUIREMENTS */}
      <section id="requirements" className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading
            title="Membership Requirements"
            subtitle="To be eligible for membership in Radlett Lodge No. 6652, you must meet the following criteria:"
            centered
          />
          <div className="max-w-3xl mx-auto mt-12">
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
              <ul className="space-y-4">
                <RequirementItem text="Be a man of at least 21 years of age" />
                <RequirementItem text="Believe in a Supreme Being (all faiths are welcome)" />
                <RequirementItem text="Be of good character and reputation" />
                <RequirementItem text="Have a sincere desire to improve yourself and contribute to your community" />
                <RequirementItem text="Be able to afford the financial commitments without detriment to your family or livelihood" />
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading
            title="The Path to Membership"
            subtitle="The journey to becoming a member of Radlett Lodge involves several steps:"
            centered
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              "Initial Contact",
              "Lodge Visit",
              "Application",
              "Interview",
              "Lodge Ballot",
              "Initiation",
            ].map((title, index) => (
              <div
                key={index}
                className="bg-neutral-50 rounded-lg p-6 relative border border-neutral-200"
              >
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-secondary-500 rounded-full flex items-center justify-center text-neutral-900 font-bold">
                  {index + 1}
                </div>
                <h3 className="text-xl font-heading font-semibold text-primary-600 mt-2 mb-3">
                  {title}
                </h3>
                <p className="text-neutral-600">
                  {index === 0
                    ? "Express your interest through our website or by contacting a current member. We'll arrange an informal meeting."
                    : index === 1
                    ? "Attend a social event to meet members and see if the Lodge feels right for you."
                    : index === 2
                    ? "Complete an application form with a proposer and seconder."
                    : index === 3
                    ? "Meet with a small committee who will discuss your interest and answer questions."
                    : index === 4
                    ? "Your application will be presented for a formal vote of approval."
                    : "Upon approval, you'll be initiated in a traditional ceremony that marks your Masonic journey."}
                </p>
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

      {/* FINANCIAL COMMITMENTS */}
      <section className="py-20 bg-primary-50">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading
            title="Financial Commitments"
            subtitle="Transparency about the financial aspects of membership is important to us."
            centered
          />
          <div className="max-w-3xl mx-auto mt-12">
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
              <p className="mb-6 text-neutral-600">
                Membership in Radlett Lodge, as with all Masonic Lodges,
                involves certain financial obligations. These typically include:
              </p>
              <ul className="space-y-4 mb-6">
                <li className="flex items-start">
                  <span className="text-secondary-500 mr-3 mt-1 flex-shrink-0">
                    <Check size={18} />
                  </span>
                  <div>
                    <span className="font-medium text-primary-600">
                      One-time Initiation Fee:
                    </span>
                    <p className="text-neutral-600">
                      This covers the costs associated with your initiation
                      ceremony and registration with the United Grand Lodge of
                      England.
                    </p>
                  </div>
                </li>

                <li className="flex items-start">
                  <span className="text-secondary-500 mr-3 mt-1 flex-shrink-0">
                    <Check size={18} />
                  </span>
                  <div>
                    <span className="font-medium text-primary-600">
                      Annual Subscription:
                    </span>
                    <p className="text-neutral-600">
                      Yearly dues that support the operation of the Lodge and
                      Provincial/Grand Lodge assessments.
                    </p>
                  </div>
                </li>

                <li className="flex items-start">
                  <span className="text-secondary-500 mr-3 mt-1 flex-shrink-0">
                    <Check size={18} />
                  </span>
                  <div>
                    <span className="font-medium text-primary-600">
                      Dining Fees:
                    </span>
                    <p className="text-neutral-600">
                      The cost of meals when dining with fellow members after
                      Lodge meetings (known as the Festive Board).
                    </p>
                  </div>
                </li>

                <li className="flex items-start">
                  <span className="text-secondary-500 mr-3 mt-1 flex-shrink-0">
                    <Check size={18} />
                  </span>
                  <div>
                    <span className="font-medium text-primary-600">
                      Charitable Donations:
                    </span>
                    <p className="text-neutral-600">
                      Voluntary contributions to Masonic and non-Masonic
                      charities supported by the Lodge.
                    </p>
                  </div>
                </li>
              </ul>

              <p className="text-neutral-600">
                Specific fee amounts will be discussed during your interview
                process. We believe Freemasonry should be accessible to men of
                good character regardless of financial status, and we ensure all
                dues remain reasonable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}

      {/* FAQs */}
      <section id="faq" className="py-20 bg-white">
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

      {/* DARK CTA SECTION */}
      <section className="relative py-24 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 backdrop-blur-sm border border-amber-500/20 mb-6">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-amber-300 text-sm font-medium">
                Take the Next Step
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
              Ready to Begin?
            </h2>
            <p className="text-amber-100/80 text-lg md:text-xl mb-10 max-w-3xl mx-auto leading-relaxed">
              Contact our Secretary to learn more about joining Radlett Lodge
              No. 6652. We'll answer your questions and guide you through the
              first steps of your Masonic journey.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/contact">
                <Button
                  variant="primary"
                  size="lg"
                  className="group bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300"
                >
                  Contact Our Secretary
                  <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/about">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-amber-400/30 text-amber-100 hover:bg-amber-400/10 hover:border-amber-400/50 backdrop-blur-sm transition-all duration-300"
                >
                  Learn About Our History
                </Button>
              </Link>
            </div>

            {/* Additional Info */}
            <motion.p
              className="mt-10 text-amber-200/60 text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Radlett Lodge No. 6652 — Serving the community since 1948
            </motion.p>
          </motion.div>
        </div>
      </section>
    </>
  );
};

// Helper component
const RequirementItem: React.FC<{ text: string }> = ({ text }) => (
  <li className="flex items-center">
    <span className="text-secondary-500 mr-3 flex-shrink-0">
      <Check size={18} />
    </span>
    <span className="text-neutral-600">{text}</span>
  </li>
);

export default JoinPage;
