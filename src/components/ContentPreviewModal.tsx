// src/components/ContentPreviewModal.tsx
import React from "react";
import { X } from "lucide-react";
import DOMPurify from "dompurify";

interface ContentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  htmlContent?: string;
  imageUrl?: string | null;
}

const ContentPreviewModal: React.FC<ContentPreviewModalProps> = ({
  isOpen,
  onClose,
  title,
  htmlContent,
  imageUrl,
}) => {
  if (!isOpen) return null;

  const cleanHtml = htmlContent ? DOMPurify.sanitize(htmlContent) : "";

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="relative bg-[#0B1831] border border-[#BFA76F]/40 rounded-2xl shadow-2xl text-white max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-[#BFA76F]/10 hover:bg-[#BFA76F]/30 text-[#BFA76F] p-1.5 rounded-full transition"
        >
          <X size={20} />
        </button>

        {/* Header */}
        {title && (
          <h2 className="text-2xl font-semibold text-[#BFA76F] mb-4 pr-8">
            {title}
          </h2>
        )}

        {/* Optional Cover Image */}
        {imageUrl && (
          <div className="mb-4">
            <img
              src={imageUrl}
              alt="Preview"
              className="w-full max-h-[300px] object-cover rounded-lg border border-[#BFA76F]/30"
            />
          </div>
        )}

        {/* Rich Text Content */}
        <div
          className="prose prose-invert max-w-none leading-relaxed text-[#EAEAEA]"
          dangerouslySetInnerHTML={{ __html: cleanHtml }}
        />

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#BFA76F] text-[#0B1831] rounded-md hover:bg-[#D8C48C] transition"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentPreviewModal;
