// src/components/CoreValuesSection.tsx
import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Users, HeartHandshake, HelpingHand } from "lucide-react";

const coreValues = [
  {
    icon: <ShieldCheck className="w-10 h-10 text-yellow-500 mb-3" />,
    title: "Integrity",
    text: "Honesty, trust, honour, reliability, and conscience are the pillars of good character. They build integrity, earn trust, and reflect a life guided by strong values and consistent actions.",
  },
  {
    icon: <Users className="w-10 h-10 text-yellow-500 mb-3" />,
    title: "Friendship",
    text: "Freemasonry offers lifelong friendships with like-minded individuals, creating a strong sense of belonging, enjoyment, and fulfilment.",
  },
  {
    icon: <HeartHandshake className="w-10 h-10 text-yellow-500 mb-3" />,
    title: "Respect",
    text: "Freemasonry has always valued its members' beliefs, promoting inclusivity, diversity, and mutual respect.",
  },
  {
    icon: <HelpingHand className="w-10 h-10 text-yellow-500 mb-3" />,
    title: "Service",
    text: "Helping others is at the heart of Freemasonry. Whether it's fundraising, volunteering, or supporting local causes, Freemasons are committed to making a difference.",
  },
];

const CoreValuesSection: React.FC = () => {
  return (
    <section className="relative py-24 bg-gradient-to-b from-white via-neutral-50 to-white text-center">
      {/* Soft top divider for continuity */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent"></div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-yellow-500 mb-6"
        >
          Our Core Values
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-neutral-600 max-w-2xl mx-auto mb-16 text-base md:text-lg"
        >
          Principles that guide every Mason of Radlett Lodge.
        </motion.p>

        {/* Core Value Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {coreValues.map((value, i) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{
                scale: 1.05,
                boxShadow:
                  "0 0 25px rgba(255, 215, 0, 0.25), 0 12px 25px rgba(0,0,0,0.1)",
              }}
              className="p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-yellow-100 shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="flex flex-col items-center">
                {value.icon}
                <h3 className="text-xl font-semibold text-neutral-800 mb-3 tracking-wide">
                  {value.title}
                </h3>
                <p className="text-neutral-700 text-sm leading-relaxed">
                  {value.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreValuesSection;
