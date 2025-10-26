// src/components/HeroSection.tsx
import React from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import Button from "./Button";
import { Link } from "react-router-dom";

interface HeroSectionProps {
  title: string;
  subtitle?: React.ReactNode;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage: string;
  overlayOpacity?: number;
  verticalPosition?: "top" | "center" | "bottom" | "custom";
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
      : verticalPosition === "custom"
      ? "items-center md:translate-y-12 lg:translate-y-20"
      : "items-center";

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <section
      className={`relative h-screen flex ${positionClass} justify-center text-center text-white overflow-hidden`}
    >
      {/* Background image layer */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          transform: "scale(1.02)",
        }}
      />

      {/* Overlay tint */}
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity }}
      />

      {/* Foreground content */}
      <div
        className={`relative z-10 px-6 md:px-12 ${
          verticalPosition === "custom"
            ? "flex flex-col items-center justify-end h-full pb-[20vh] md:pb-[25vh]"
            : ""
        }`}
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-heading font-bold mb-4"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-lg md:text-xl text-neutral-200 max-w-2xl mx-auto"
        >
          {subtitle}
        </motion.p>

        {ctaText && ctaLink && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mt-8"
          >
            <Link to={ctaLink}>
              <Button variant="primary" size="lg">
                {ctaText}
              </Button>
            </Link>
          </motion.div>
        )}

        {showScrollHint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <ChevronDown className="w-8 h-8 animate-bounce text-neutral-300" />
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
