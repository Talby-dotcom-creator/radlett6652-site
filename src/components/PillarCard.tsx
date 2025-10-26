import React from "react";
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";

interface PillarCardProps {
  pillar: {
    id: string;
    title: string;
    date: Date;
    summary: string;
    image?: string;
    author?: string;
    category?: string;
    readingTime?: number;
  };
}

const PillarCard: React.FC<PillarCardProps> = ({ pillar }) => {
  return (
    <article className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 border border-stone-200">
      {/* Image */}
      {pillar.image && (
        <div className="relative h-56 overflow-hidden">
          <img
            src={pillar.image}
            alt={pillar.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-500"></div>
          {pillar.category && (
            <span className="absolute top-4 left-4 bg-amber-600/90 text-white text-xs font-semibold tracking-wide uppercase px-3 py-1.5 rounded-full shadow">
              {pillar.category}
            </span>
          )}
        </div>
      )}

      {/* Text Content */}
      <div className="p-6 flex flex-col h-full">
        {/* Title */}
        <h3 className="text-2xl font-serif font-bold text-stone-800 mb-3 leading-snug group-hover:text-amber-700 transition-colors duration-300">
          {pillar.title}
        </h3>

        {/* Date & Author */}
        <div className="flex items-center justify-between text-sm text-stone-500 mb-4">
          <span>
            {pillar.date.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
          {pillar.readingTime && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{pillar.readingTime} min</span>
            </div>
          )}
        </div>

        {/* Summary */}
        <p className="text-stone-600 flex-grow mb-5 line-clamp-4 leading-relaxed">
          {pillar.summary ||
            "Continue reading this reflective piece on Masonic philosophy and insight."}
        </p>

        {/* Footer */}
        <div className="mt-auto border-t border-stone-100 pt-4 flex justify-between items-center">
          {pillar.author && (
            <span className="text-sm text-stone-500 italic">
              By {pillar.author}
            </span>
          )}
          <Link
            to={`/pillars/${pillar.id}`}
            className="text-amber-700 font-semibold hover:text-amber-900 transition-colors duration-300 flex items-center gap-1"
          >
            Read Article →
          </Link>
        </div>
      </div>
    </article>
  );
};

export default PillarCard;
