// src/components/HeroSection.tsx
import React from "react";
import { ChevronDown } from "lucide-react";
import Button from "./Button";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage: string;
  overlayOpacity?: number;
  verticalPosition?: "top" | "center" | "bottom";
  showScrollHint?: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  ctaText,
  ctaLink,
  backgroundImage,
  overlayOpacity = 0.6,
  verticalPosition = "center",
  showScrollHint = false,
}) => {
  const positionClass =
    verticalPosition === "top"
      ? "items-start pt-32 md:pt-40"
      : verticalPosition === "bottom"
      ? "items-end pb-32 md:pb-40"
      : "items-center";

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <section
      className={`relative min-h-[90vh] flex ${positionClass} justify-center text-center text-white overflow-visible`}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* 🔹 Gradient Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"
        style={{ opacity: overlayOpacity }}
      />

      {/* 🔹 Main Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 max-w-3xl">
        {/* Lodge Logo */}
        <img
          src="/lodge-logo.png"
          alt="Radlett Lodge No. 6652"
          className="w-32 md:w-44 mb-6 drop-shadow-lg"
        />

        {/* Title and Subtitle */}
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-3 drop-shadow-md">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-neutral-100 mb-6 opacity-95 leading-relaxed">
          {subtitle}
        </p>

        {ctaText && ctaLink && (
          <a href={ctaLink}>
            <Button
              variant="primary"
              size="lg"
              className="shadow-md hover:shadow-lg transition"
            >
              {ctaText}
            </Button>
          </a>
        )}
      </div>

      {/* 🔹 Counters Area */}
      <div className="absolute bottom-10 w-full flex justify-center z-10">
        <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-center">
          {[
            { label: "Founded", value: "1948" },
            { label: "Active Members", value: "24" },
            { label: "Charity Raised", value: "£1,200+" },
          ].map((counter, i) => (
            <div
              key={i}
              className="bg-black/40 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/20 shadow-sm"
            >
              <div className="text-2xl md:text-3xl font-bold text-secondary-400">
                {counter.value}
              </div>
              <div className="text-sm md:text-base text-neutral-100">
                {counter.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Optional scroll hint */}
      {showScrollHint && (
        <button
          onClick={scrollToContent}
          aria-label="Scroll down"
          className="absolute bottom-4 text-white/80 animate-bounce"
        >
          <ChevronDown size={36} />
        </button>
      )}
    </section>
  );
};

export default HeroSection;
