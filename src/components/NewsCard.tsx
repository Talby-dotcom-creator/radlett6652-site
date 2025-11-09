import React from "react";
import { Link } from "react-router-dom";
import { CMSBlogPost } from "../types";

interface NewsCardProps {
  news: CMSBlogPost;
  onOpen?: (news: CMSBlogPost) => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ news, onOpen }) => {
  const date = news.publish_date
    ? new Date(news.publish_date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <div className="radlett-card group">
      {news.image_url && (
        <img
          src={news.image_url}
          alt={news.title}
          className="w-full h-48 object-cover rounded-t-2xl"
        />
      )}
      <div className="radlett-card-content">
        <h3 className="text-lg font-heading font-semibold text-primary-700 mb-2 group-hover:text-secondary-500 transition-colors">
          {news.title}
        </h3>
        <p className="text-sm text-neutral-500 mb-2">{date}</p>
        {news.summary && (
          <div
            className="prose prose-invert max-w-none line-clamp-4"
            dangerouslySetInnerHTML={{ __html: news.summary ?? "" }}
          />
        )}
        {onOpen ? (
          <button
            onClick={() => onOpen(news)}
            className="text-secondary-500 font-medium hover:underline"
          >
            Read More →
          </button>
        ) : (
          <Link
            to={`/news/${news.slug}`}
            className="text-secondary-500 font-medium hover:underline"
          >
            Read More →
          </Link>
        )}
      </div>
    </div>
  );
};

export default NewsCard;
