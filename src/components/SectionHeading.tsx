// src/components/SectionHeading.tsx
import React from "react";

/**
 * SectionHeading Component
 * ------------------------------------------------------------
 * Used across Radlett Lodge pages for consistent section headers
 * Supports an optional icon (Lucide icon or SVG), subtitle, and alignment.
 */

export interface SectionHeadingProps {
  /** Main title of the section */
  title: string;
  /** Optional smaller subtitle beneath the title */
  subtitle?: string;
  /** Optional icon (Lucide, SVG, or any React element) */
  icon?: React.ReactNode;
  /** Text alignment, defaults to center */
  align?: "center" | "left" | "right";
  /** Convenience boolean to force centered alignment (keeps older callers working) */
  centered?: boolean;
  /** Additional className overrides */
  className?: string;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  subtitle,
  icon,
  align = "center",
  centered,
  className = "",
}) => {
  // Tailwind text alignment classes
  const effectiveAlign = centered === true ? "center" : align;
  const alignment =
    effectiveAlign === "left"
      ? "text-left items-start"
      : effectiveAlign === "right"
      ? "text-right items-end"
      : "text-center items-center";

  return (
    <div
      className={`flex flex-col ${alignment} justify-center mb-12 ${className}`}
    >
      {/* Optional Icon */}
      {icon && (
        <div className="mb-4 text-yellow-500 flex justify-center text-4xl">
          {icon}
        </div>
      )}

      {/* Section Title */}
      <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-2">
        {title}
      </h2>

      {/* Subtitle / Description */}
      {subtitle && (
        <p className="text-neutral-600 text-lg max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
