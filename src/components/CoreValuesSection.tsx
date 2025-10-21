import React from "react";
import { Shield, Users, Handshake, HeartHandshake } from "lucide-react";
import { motion } from "framer-motion";

const values = [
  {
    icon: Shield,
    title: "Integrity",
    text: "Honesty, trust, honour, reliability, and conscience are the pillars of good character. They build integrity, earn trust, and reflect a life guided by strong values and consistent actions.",
  },
  {
    icon: Users,
    title: "Friendship",
    text: "Freemasonry offers lifelong friendships with like-minded individuals, creating a strong sense of belonging, enjoyment, and fulfilment.",
  },
  {
    icon: Handshake,
    title: "Respect",
    text: "Freemasonry has always valued its members' beliefs, promoting inclusivity, diversity, and mutual respect.",
  },
  {
    icon: HeartHandshake,
    title: "Service",
    text: "Helping others is at the heart of Freemasonry. Whether it's fundraising, volunteering, or supporting local causes, Freemasons are committed to making a difference.",
  },
];

const CoreValuesSection: React.FC = () => {
  return (
    <section className="py-24 bg-neutral-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-heading font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-oxford-blue via-oxford-blue to-secondary-500"
          >
            Our Core Values
          </motion.h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            The timeless principles that guide every Freemason.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group bg-white border border-secondary-500/10 hover:border-secondary-500/40 rounded-2xl p-8 shadow-[0_4px_10px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_20px_rgba(245,184,58,0.25)] transition-all duration-500 hover:-translate-y-1 flex flex-col items-center text-center h-full"
            >
              {/* Icon */}
              <div className="relative inline-flex items-center justify-center w-16 h-16 bg-secondary-500/10 rounded-full mb-6 group-hover:bg-secondary-500/20 transition-all duration-500">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,184,58,0.25),transparent_70%)] opacity-0 group-hover:opacity-100 transition duration-500" />
                <value.icon
                  size={32}
                  className="text-secondary-500 group-hover:text-secondary-400 transition-all duration-300"
                />
              </div>

              {/* Title */}
              <h3 className="text-xl font-heading font-semibold mb-4 text-oxford-blue group-hover:text-secondary-500 transition-all duration-500">
                {value.title}
              </h3>

              {/* Description */}
              <p className="text-neutral-600 leading-relaxed">{value.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreValuesSection;
