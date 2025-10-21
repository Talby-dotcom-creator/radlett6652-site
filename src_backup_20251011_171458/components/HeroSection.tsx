// src/components/HeroSection.tsx
import React from "react";
import { ChevronDown } from "lucide-react";
import Button from "./Button";
import { Link } from "react-router-dom";

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
  // 🧠 Debug log – helps confirm the background image is being passed correctly
  console.log("🖼️ HeroSection backgroundImage URL:", backgroundImage);

  const positionClass =
    verticalPosition === "top"
      ? "items-start pt-32 md:pt-40"
      : verticalPosition === "bottom"
      ? "items-end pb-44 md:pb-52" // Adjusted spacing for bottom placement
      : "items-center";

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <section
      className={`relative h-screen flex ${positionClass} justify-center text-center text-white`}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})` }}
      />

      {/* Main content */}
      <div className="relative z-10 max-w-3xl px-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
          {title}
        </h1>
        <p className="text-lg md:text-xl mb-8 drop-shadow-md">{subtitle}</p>

        {/* Optional call-to-action button */}
        {ctaText &&
          ctaLink &&
          (ctaLink.startsWith("http") ? (
            <a href={ctaLink} target="_blank" rel="noopener noreferrer">
              <Button variant="primary">{ctaText}</Button>
            </a>
          ) : (
            <Link to={ctaLink}>
              <Button variant="primary">{ctaText}</Button>
            </Link>
          ))}
      </div>

      {/* Scroll hint icon */}
      {showScrollHint && (
        <div
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 cursor-pointer text-gray-200 hover:text-white transition-colors"
          onClick={scrollToContent}
        >
          <ChevronDown className="w-8 h-8 animate-bounce" />
        </div>
      )}
    </section>
  );
};

export default HeroSection;
