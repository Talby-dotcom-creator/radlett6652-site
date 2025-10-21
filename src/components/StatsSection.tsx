// src/components/StatsSection.tsx
import React from "react";
import { Users, Calendar, Heart, Award } from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";

const stats = [
  {
    icon: Users,
    value: 28,
    suffix: "+",
    label: "Active Members",
    description: "Dedicated Freemasons",
  },
  {
    icon: Calendar,
    value: 76,
    suffix: "",
    label: "Years of Service",
    description: "Since 1948",
  },
  {
    icon: Heart,
    value: 52,
    suffix: "M+",
    label: "Charitable Donations",
    description: "Annually across UGLE",
  },
  {
    icon: Award,
    value: 5,
    suffix: "",
    label: "Regular Meetings",
    description: "Members Only",
  },
];

const StatsSection: React.FC = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-oxford-blue to-[#071b3d] text-white relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-secondary-500 via-amber-300 to-secondary-500 animate-goldShimmer mb-4">
            Our Lodge by Numbers
          </h2>
          <p className="text-lg text-neutral-200 max-w-2xl mx-auto">
            A testament to our commitment to brotherhood, charity, and community
            service
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group bg-[#0d2249]/70 backdrop-blur-sm rounded-2xl border border-secondary-500/10 hover:border-secondary-500/40 
              p-8 text-center transition-all duration-500 hover:-translate-y-1 
              hover:shadow-[0_0_25px_rgba(245,184,58,0.3)]"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary-500/10 rounded-full mb-6 group-hover:bg-secondary-500/20 transition-all duration-500">
                <stat.icon
                  size={32}
                  className="text-secondary-500 group-hover:text-secondary-400 transition-all duration-300"
                />
              </div>

              <div className="text-3xl md:text-4xl font-heading font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-secondary-400 via-amber-300 to-secondary-500 animate-goldShimmer">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </div>

              <h3 className="text-lg font-semibold mb-1 text-white group-hover:text-secondary-400 transition-colors duration-300">
                {stat.label}
              </h3>
              <p className="text-sm text-neutral-300">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ✨ Gold shimmer animation keyframes */}
      <style>{`
        @keyframes goldShimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-goldShimmer {
          background-size: 200% auto;
          animation: goldShimmer 6s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default StatsSection;
