// src/pages/SnippetsPage.tsx
import React, { useState } from "react";
import { AnimatedBook } from "../components";
import { motion, AnimatePresence } from "framer-motion";

const SnippetsPage: React.FC = () => {
  const [showFullSheetGlobal, setShowFullSheetGlobal] = useState(false);

  return (
    <main className="relative min-h-screen bg-black text-white flex flex-col items-center px-4 pt-16 overflow-visible">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-2 text-center">
        The Pillars — Weekly Snippets
      </h1>

      <p className="text-lg text-gray-300 mb-10 text-center max-w-2xl">
        Short, thoughtful pieces from our Lodge
      </p>

      <AnimatePresence>
        {showFullSheetGlobal && (
          <motion.div
            className="fixed inset-0 bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{ zIndex: 10, pointerEvents: "none" }}
          />
        )}
      </AnimatePresence>

      {/* BOOK + ANIMATIONS MUST BE ABOVE EVERYTHING */}
      <div className="relative z-50 mb-10">
        <AnimatedBook onSheetOpenChange={setShowFullSheetGlobal} />
      </div>

      <p className="text-gray-300 text-center max-w-2xl mb-20">
        Each Monday we feature a short reflective piece from our Lodge. Tap the
        book to read this week’s snippet.
      </p>
    </main>
  );
};

export default SnippetsPage;
