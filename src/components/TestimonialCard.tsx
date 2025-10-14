import React from "react";
import { Quote } from "lucide-react";
import { Testimonial } from "../types";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  return (
    <div className="card-glow bg-white rounded-lg shadow-soft p-6 flex flex-col justify-between transition-all duration-300 hover:translate-y-[-4px] text-center max-w-lg mx-auto">
      <Quote className="w-10 h-10 mx-auto mb-4 text-secondary-500 opacity-70" />

      {/* Full testimonial text, no clamping */}
      <p className="text-neutral-700 italic mb-6 leading-relaxed whitespace-pre-line">
        “
        {testimonial.quote ||
          "Freemasonry has been a life-changing experience for me, fostering personal growth, integrity, and brotherhood."}
        ”
      </p>

      <div>
        <h4 className="font-semibold text-primary-700">{testimonial.name}</h4>
        {testimonial.role && (
          <p className="text-sm text-neutral-500">{testimonial.role}</p>
        )}
      </div>
    </div>
  );
};

export default TestimonialCard;
