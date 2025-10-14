// src/components/NewsCard.tsx
import React from "react";
import { Calendar, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { CMSBlogPost } from "../types";
import { format } from "date-fns";

interface NewsCardProps {
  news: CMSBlogPost;
  featured?: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({ news, featured = false }) => {
  const formattedDate = news.publish_date
    ? format(new Date(news.publish_date), "dd MMM yyyy")
    : "Date TBA";

  const maxLength = featured ? 220 : 150;
  const summary =
    news.summary && news.summary.length > maxLength
      ? news.summary.substring(0, maxLength) + "..."
      : news.summary || "Read the full story.";

  return (
    <Link
      to={`/news/${news.slug}`}
      className={`card-glow rounded-lg p-6 flex flex-col justify-between transition-all duration-300 group ${
        featured
          ? "bg-gradient-to-br from-white via-amber-50 to-white shadow-lg border border-amber-300 md:col-span-2"
          : "bg-white shadow-soft hover:translate-y-[-4px]"
      }`}
    >
      {/* Title */}
      <h3
        className={`font-semibold text-primary-700 mb-3 group-hover:text-secondary-600 transition-colors ${
          featured ? "text-2xl" : "text-xl"
        }`}
      >
        {news.title}
      </h3>

      {/* Summary */}
      <p
        className={`text-neutral-600 mb-4 ${
          featured ? "text-base" : "text-sm line-clamp-3"
        }`}
      >
        {summary}
      </p>

      {/* Footer Info */}
      <div className="text-sm text-neutral-500 flex items-center justify-between mt-auto pt-2 border-t border-neutral-100">
        <div className="flex items-center">
          <Calendar size={16} className="mr-2 text-secondary-500" />
          {formattedDate}
        </div>
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-secondary-500" />
          <span className="text-secondary-600 font-medium group-hover:text-secondary-700">
            Read full story →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;
