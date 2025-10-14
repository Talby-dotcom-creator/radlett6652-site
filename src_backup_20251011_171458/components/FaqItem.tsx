// src/components/FaqItem.tsx
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItemProps {
  faq: {
    question: string;
    answer: string;
  };
}

const FaqItem: React.FC<FaqItemProps> = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`border-b border-neutral-200 py-5 transition-all duration-300 ${
        isOpen ? "bg-neutral-50 rounded-lg" : ""
      }`}
    >
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left group focus:outline-none"
      >
        <h3 className="text-lg font-medium text-neutral-900 group-hover:text-primary-600 transition-colors">
          {faq.question}
        </h3>
        <ChevronDown
          className={`w-5 h-5 text-neutral-500 transition-transform duration-300 ${
            isOpen ? "rotate-180 text-primary-600" : ""
          }`}
        />
      </button>

      {/* Answer */}
      <div
        className={`overflow-hidden transition-all duration-500 ${
          isOpen ? "max-h-96 opacity-100 mt-3" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-neutral-700 leading-relaxed pl-1 pr-3">
          {faq.answer}
        </p>
      </div>
    </div>
  );
};

export default FaqItem;
