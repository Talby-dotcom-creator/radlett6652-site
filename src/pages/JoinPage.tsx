import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import HeroSection from "../components/HeroSection";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.8 },
  }),
};

const ContactPage: React.FC = () => {
  return (
    <main className="bg-white min-h-screen flex flex-col">
      {/* 🏛️ Hero Section */}
      <HeroSection
        title="Contact Our Lodge"
        subtitle="We welcome your questions, interest, or inquiries about joining Freemasonry."
        backgroundImage="/images/contact-banner.webp"
        overlayOpacity={0.35}
        verticalPosition="center"
      />

      <div className="flex-grow container mx-auto px-4 md:px-8 py-16 max-w-5xl">
        {/* 🟡 Page Title */}
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          custom={0}
          className="text-4xl md:text-5xl font-heading font-bold lodge-heading text-center mb-10"
        >
          Get in Touch
        </motion.h1>

        {/* 📬 Contact Details */}
        <div className="grid md:grid-cols-2 gap-10 mb-16">
          {[
            {
              icon: Mail,
              title: "Email",
              text: "radlettlodge6652@gmail.com",
              link: "mailto:radlettlodge6652@gmail.com",
            },
            {
              icon: Phone,
              title: "Phone",
              text: "+44 (0)1923 123 456",
              link: "tel:+441923123456",
            },
            {
              icon: MapPin,
              title: "Lodge Venue",
              text: "Radlett Masonic Hall, Watling Street, Radlett, WD7 7NQ",
              link: "https://goo.gl/maps/",
            },
            {
              icon: Clock,
              title: "Meetings",
              text: "3rd Thursday in February, April, October, and December.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              variants={fadeIn}
              custom={i + 1}
              initial="hidden"
              animate="visible"
              className="bg-white border border-neutral-200 rounded-2xl shadow-sm p-8 text-center hover:shadow-lg transition"
            >
              <item.icon className="w-10 h-10 mx-auto text-yellow-500 mb-4" />
              <h3 className="text-xl font-semibold text-primary-700 mb-2">
                {item.title}
              </h3>
              {item.link ? (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary-600 hover:text-secondary-800"
                >
                  {item.text}
                </a>
              ) : (
                <p className="text-neutral-700">{item.text}</p>
              )}
            </motion.div>
          ))}
        </div>

        {/* 🔶 Divider */}
        <div className="w-24 h-[3px] bg-yellow-500 mx-auto mb-20 rounded-full"></div>

        {/* ✉️ CTA Section */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          custom={5}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold lodge-heading mb-4">
            Ready to Take the First Step?
          </h2>
          <p className="text-lg text-neutral-700 mb-8 max-w-2xl mx-auto">
            Whether you're curious about membership or would like to attend one
            of our social evenings, we’d love to hear from you.
          </p>
          <a
            href="/join"
            className="inline-block bg-yellow-500 hover:bg-yellow-400 text-oxford-blue font-semibold px-8 py-3 rounded-lg transition"
          >
            Learn About Joining →
          </a>
        </motion.section>
      </div>
    </main>
  );
};

export default ContactPage;
