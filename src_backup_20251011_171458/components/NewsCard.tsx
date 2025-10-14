// src/components/NewsCard.tsx
import React from "react";
import { Link } from "react-router-dom";

interface NewsCardProps {
  news: {
    id: string;
    title: string;
    date?: Date;
    summary?: string;
    image?: string;
    isMembers?: boolean; // allow optional for type safety
  };
}

const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  return (
    <div className="bg-white shadow-soft rounded-lg overflow-hidden border border-neutral-100 transition-all duration-300 hover:shadow-medium flex flex-col h-full">
      {/* Image */}
      {news.image ? (
        <div className="h-48 w-full overflow-hidden">
          <img
            src={news.image}
            alt={news.title}
            className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="h-48 w-full bg-neutral-100 flex items-center justify-center text-neutral-400 text-sm">
          No Image
        </div>
      )}

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="text-xl font-heading font-semibold text-primary-600 mb-2 line-clamp-2">
          {news.title}
        </h3>

        {/* Date + Members Only */}
        <p className="text-sm text-neutral-500 mb-3">
          {news.date ? news.date.toLocaleDateString("en-GB") : "No date"}
          {news.isMembers && (
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary-100 text-primary-600">
              Members Only
            </span>
          )}
        </p>

        {/* Summary */}
        <p className="text-neutral-700 flex-grow mb-4 line-clamp-3">
          {news.summary || "Click below to read the full story."}
        </p>

        {/* Read More Button */}
        <div className="mt-auto">
          <Link
            to={`/news/${news.id}`}
            aria-label={`Read full article: ${news.title}`}
            className="inline-block bg-secondary-600 text-white px-4 py-2 rounded-lg shadow hover:bg-secondary-700 transition font-medium"
          >
            Read Full Article →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
