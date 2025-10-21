// src/lib/motionPresets.ts
import { Variants, Easing } from "framer-motion";

/* -------------------------------------------------------
 * 🎬 Global motion presets for Radlett Lodge site
 * ----------------------------------------------------- */

// Standard easing curve for smooth fade & lift
export const defaultEase: Easing = [0.25, 0.1, 0.25, 1] as const;

// Standard fade-up (used on cards, blocks, text)
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: defaultEase },
  },
};

// Fade in only (used for simple elements like headings)
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: defaultEase },
  },
};

// Slide in from left
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: defaultEase },
  },
};

// Slide in from right
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: defaultEase },
  },
};

// Slight stagger for grouped children
export const staggerChildren = {
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

// Hover shimmer / lift effect for cards
export const hoverLift = {
  whileHover: {
    y: -6,
    scale: 1.02,
    transition: { duration: 0.3, ease: defaultEase },
  },
};
