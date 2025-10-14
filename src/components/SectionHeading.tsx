import React, { useEffect, useRef, useState } from "react";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  subtitle,
  centered,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (headingRef.current) observer.observe(headingRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={headingRef}
      className={`mb-10 px-4 ${
        typeof centered === "undefined" || centered ? "text-center" : ""
      }`}
    >
      <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-900 mb-2">
        {title}
      </h2>

      {/* ✨ Animated Gold Shimmer Divider */}
      <div className="relative w-32 h-[2px] mx-auto my-3 rounded-full overflow-hidden bg-gradient-to-r from-transparent via-secondary-500 to-transparent">
        {isVisible && (
          <span className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/80 to-transparent" />
        )}
      </div>

      {subtitle && (
        <p className="text-lg text-neutral-700 max-w-2xl mx-auto">{subtitle}</p>
      )}
    </div>
  );
};

export default SectionHeading;
