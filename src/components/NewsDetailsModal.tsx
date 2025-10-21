import React from "react";
import { X } from "lucide-react";
import { CMSBlogPost } from "../types";

interface NewsDetailsModalProps {
  news: CMSBlogPost | null;
  onClose: () => void;
}

const NewsDetailsModal: React.FC<NewsDetailsModalProps> = ({
  news,
  onClose,
}) => {
  if (!news) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white max-w-3xl w-full rounded-xl shadow-xl overflow-y-auto max-h-[90vh] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-500 hover:text-primary-600 transition"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        {news.image_url && (
          <img
            src={news.image_url}
            alt={news.title}
            className="w-full h-64 object-cover rounded-t-xl"
          />
        )}

        <div className="p-8">
          <h2 className="text-3xl font-heading font-bold text-primary-700 mb-2">
            {news.title}
          </h2>
          {news.publish_date && (
            <p className="text-sm text-neutral-500 mb-6">
              {new Date(news.publish_date).toLocaleDateString("en-GB", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}

          <div className="border-b border-[#FCA311]/30 w-24 mb-6"></div>

          <div
            className="prose prose-neutral max-w-none text-neutral-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: news.content ?? "" }}
          />

          <div className="mt-8 text-center">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-[#FCA311] text-[#FCA311] rounded-full hover:bg-[#FCA311] hover:text-white transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailsModal;
