import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const WelcomeToOurLodge: React.FC = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Premium Dark Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900" />

      {/* Texture Overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.3'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Floating Masonic Symbols */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute opacity-5"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.03, 0.08, 0.03],
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          >
            <div className="text-amber-400 text-6xl">⚖️</div>
          </motion.div>
        ))}
      </div>

      {/* Golden Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-400/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -120, 0],
              opacity: [0, 1, 0],
              scale: [0, 2, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-6 py-2 mb-6 bg-amber-500/10 border border-amber-500/30 rounded-full backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300 text-sm font-medium tracking-wider uppercase">
              Step Into Tradition
            </span>
          </motion.div>

          <h2 className="text-5xl md:text-6xl font-serif font-bold mb-4">
            <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 text-transparent bg-clip-text">
              Radlett Lodge 6652
            </span>
          </h2>

          <p className="text-amber-100/70 text-xl max-w-3xl mx-auto leading-relaxed">
            A fellowship of brothers united in the pursuit of wisdom, strength,
            and beauty
          </p>
        </motion.div>

        {/* The Illuminated Image */}
        <div className="relative max-w-5xl mx-auto mb-16">
          {/* Radial Glow */}
          <div className="absolute inset-0 -z-10">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 rounded-full blur-3xl"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative"
          >
            {/* Simple Frame Container */}
            <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border-2 border-amber-500/30 rounded-3xl p-8 md:p-12 shadow-2xl">
              {/* Lodge Image - Simple */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.4 }}
                className="relative"
              >
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <img
                    src="https://neoquuejwgcqueqlcbwj.supabase.co/storage/v1/object/public/cms-media/banners/radlett-lodge.webp"
                    alt="Radlett Masonic Centre"
                    className="w-full h-64 md:h-96 object-cover"
                  />

                  {/* Subtle Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Single Content Card with Original Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-md border border-amber-500/20 rounded-2xl p-8 md:p-12 shadow-xl">
            {/* Top Accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-serif font-bold text-white mb-6 text-center"
            >
              Welcome to Our Lodge
            </motion.h3>

            {/* Animated gold line */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: "6rem", opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              viewport={{ once: true }}
              className="h-1 bg-gradient-to-r from-amber-400 to-yellow-600 rounded-full mx-auto mb-8"
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="text-lg text-amber-100/80 leading-relaxed mb-6"
            >
              <span className="font-semibold text-amber-300">
                Radlett Lodge
              </span>{" "}
              is a welcoming and forward-thinking Masonic Lodge where men from
              all walks of life come together in friendship, learning, and
              shared purpose. Our members represent a wide range of trades,
              skills, and professions — each contributing to a vibrant and
              supportive community built on respect, integrity, and service.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-lg text-amber-100/80 leading-relaxed mb-6"
            >
              We understand that modern life can be demanding, so our Lodge
              meets on{" "}
              <span className="font-semibold text-amber-300">Saturdays</span>,
              offering a perfect balance between Masonic fellowship and weekday
              commitments. This flexibility enables both established and future
              members to participate fully while maintaining a healthy work-life
              balance.
            </motion.p>

            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="list-disc list-inside text-amber-100/80 text-lg mb-8 space-y-2"
            >
              <li>
                Warm, inclusive atmosphere — open to all backgrounds and ages
              </li>
              <li>Opportunities to grow in confidence, knowledge, and skill</li>
              <li>Tradition blended with a modern, approachable spirit</li>
            </motion.ul>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="italic text-amber-400 text-xl text-center"
            >
              Freemasonry that works for modern life.
            </motion.p>

            {/* Bottom Accent */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WelcomeToOurLodge;
