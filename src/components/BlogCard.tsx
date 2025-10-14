// src/components/BlogCard.tsx
import React from "react";
import { Link } from "react-router-dom";

interface BlogCardProps {
  blog: {
    id: string;
    title: string;
    date: Date;
    summary: string;
    content: string;
    image?: string;
    isMembers?: boolean;
  };
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition flex flex-col">
      {/* Image */}
      {blog.image && (
        <div className="h-56 w-full overflow-hidden">
          <img
            src={blog.image}
            alt={blog.title}
            className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="p-6 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="text-2xl font-bold text-primary-700 mb-3 line-clamp-2">
          {blog.title}
        </h3>

        {/* Date + Members Only */}
        <p className="text-sm text-gray-500 mb-4">
          {blog.date.toLocaleDateString("en-GB")}
          {blog.isMembers && (
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-indigo-100 text-indigo-600">
              Members Only
            </span>
          )}
        </p>

        {/* Summary */}
        <p className="text-gray-700 flex-grow mb-5 line-clamp-4">
          {blog.summary || "Click below to read the full blog post."}
        </p>

        {/* Continue Reading Button */}
        <div className="mt-auto">
          <Link
            to={`/blog/${blog.id}`}
            className="inline-block px-5 py-2 bg-primary-600 text-white rounded-lg shadow hover:bg-primary-700 transition font-medium"
          >
            Continue Reading →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
