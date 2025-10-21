// src/components/ScrollToTopButton.tsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronUp } from "lucide-react";

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show when user scrolls 400px down
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0,
      }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-6 right-6 z-50 bg-yellow-500 hover:bg-yellow-400 text-oxford-blue font-bold p-3 rounded-full shadow-lg transition-all duration-300 focus:outline-none"
      aria-label="Scroll to top"
    >
      <ChevronUp className="w-6 h-6" />
    </motion.button>
  );
};

export default ScrollToTopButton;
