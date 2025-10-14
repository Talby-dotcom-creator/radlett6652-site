// src/components/SnippetCard.tsx
import React from "react";
import { Link } from "react-router-dom";

interface SnippetCardProps {
  snippet: {
    id: string;
    title: string;
    date: Date;
    content: string;
    summary?: string;
    tags?: string[];
  };
}

const SnippetCard: React.FC<SnippetCardProps> = ({ snippet }) => {
  return (
    <div className="bg-neutral-50 shadow-soft rounded-lg overflow-hidden border border-neutral-200 hover:shadow-medium transition-all duration-300 flex flex-col h-full">
      <div className="p-6 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="text-lg font-heading font-semibold text-primary-700 mb-2 line-clamp-2">
          {snippet.title}
        </h3>

        {/* Date */}
        <p className="text-sm text-neutral-500 mb-3">
          {snippet.date.toLocaleDateString("en-GB")}
        </p>

        {/* Preview */}
        <p className="text-neutral-700 flex-grow mb-4 line-clamp-3">
          {snippet.summary ||
            snippet.content.substring(0, 120) + "..."}
        </p>

        {/* Tags */}
        {snippet.tags && snippet.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {snippet.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="text-xs bg-secondary-100 text-secondary-700 px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Read Full Snippet */}
        <div className="mt-auto">
          <Link
            to={`/snippets/${snippet.id}`}
            className="inline-block bg-primary-600 text-white px-4 py-2 rounded-lg shadow hover:bg-primary-700 transition font-medium"
          >
            Read Snippet →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SnippetCard;
