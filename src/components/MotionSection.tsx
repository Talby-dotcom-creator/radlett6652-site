// src/components/MotionSection.tsx
import React from "react";
import { motion } from "framer-motion";
import { fadeUp, staggerChildren } from "../lib/motionPresets";

interface MotionSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  delayChildren?: boolean; // optional delay effect
  direction?: "up" | "left" | "right"; // future flexibility
}

/**
 * 💫 MotionSection — universal fade + stagger wrapper
 * -------------------------------------------------
 * Wrap any <section> or <div> content with this component
 * to apply a consistent Radlett-style animation:
 * - Fades and slides upward on scroll
 * - Staggers child animations
 * - Handles viewport once logic
 */
const MotionSection: React.FC<MotionSectionProps> = ({
  children,
  className = "",
  id,
  delayChildren = false,
}) => {
  return (
    <motion.section
      id={id}
      className={className}
      variants={staggerChildren}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.div
        // merge in delay/stagger options — cast to any so TS accepts custom transition props
        variants={(() => {
          const enhanced: any = {
            ...fadeUp,
            visible: {
              ...((fadeUp as any).visible || {}),
              transition: {
                ...(((fadeUp as any).visible || {}).transition || {}),
                delayChildren: delayChildren ? 0.25 : 0,
                staggerChildren: delayChildren ? 0.15 : 0,
              },
            },
          } as any;
          return enhanced;
        })()}
      >
        {children}
      </motion.div>
    </motion.section>
  );
};

export default MotionSection;
