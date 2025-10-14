import React from "react";

interface SectionDividerProps {
  variant?: "thin" | "bold";
  shimmer?: boolean;
}

const SectionDivider: React.FC<SectionDividerProps> = ({
  variant = "thin",
  shimmer = true,
}) => {
  const thickness = variant === "bold" ? "h-[4px]" : "h-[2px]";
  const baseClasses = `relative w-full ${thickness} my-12 overflow-hidden bg-gradient-to-r from-transparent via-secondary-500 to-transparent`;
  const opacityAndGlow =
    variant === "bold"
      ? "opacity-90 shadow-[0_0_15px_rgba(255,215,0,0.4)]"
      : "opacity-70";

  return (
    <div className={`${baseClasses} ${opacityAndGlow}`}>
      {shimmer && (
        <span className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      )}
    </div>
  );
};

export default SectionDivider;
