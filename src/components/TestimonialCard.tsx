import React from "react";
import { Testimonial } from "../types";
import { Quote } from "lucide-react";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  return (
    <div className="radlett-card text-center p-8 relative">
      <Quote className="w-8 h-8 text-secondary-400 mx-auto mb-4 opacity-80" />
      <p className="text-neutral-700 italic mb-6">
        “{testimonial.content || testimonial.quote}”
      </p>
      <h4 className="font-semibold text-primary-700">
        {testimonial.name || testimonial.member_name}
      </h4>
      {testimonial.role && (
        <p className="text-sm text-neutral-500">{testimonial.role}</p>
      )}
    </div>
  );
};

export default TestimonialCard;
