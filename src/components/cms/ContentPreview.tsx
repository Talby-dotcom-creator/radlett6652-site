import React from "react";
import { X, ExternalLink, Copy } from "lucide-react";
import Button from "../Button";
import { useToast } from "../../hooks/useToast";

interface ContentPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  content: any;
  contentType:
    | "event"
    | "news"
    | "blog"
    | "snippet"
    | "officer"
    | "testimonial"
    | "faq"
    | "page_content";
}

const ContentPreview: React.FC<ContentPreviewProps> = ({
  isOpen,
  onClose,
  content,
  contentType,
}) => {
  const { success, error } = useToast();

  if (!isOpen || !content) return null;

  // Decide where the "View Live" and "Copy Link" buttons should link
  const getLiveUrl = (): string | null => {
    switch (contentType) {
      case "news":
        return `/news/${content.id}`;
      case "blog":
        return `/blog/${content.id}`;
      case "snippet":
        return `/snippets`; // or `/snippets/${content.id}` if you add detail pages
      case "event":
        return `/events/${content.id}`;
      default:
        return null;
    }
  };

  const handleCopyLink = () => {
    const url = getLiveUrl();
    if (url) {
      const fullUrl = `${window.location.origin}${url}`;
      navigator.clipboard
        .writeText(fullUrl)
        .then(() => success("Link copied to clipboard!"))
        .catch(() => error("Failed to copy link"));
    }
  };

  const renderPreview = () => {
    switch (contentType) {
      case "event":
        return (
          <div className="space-y-4">
            <div className="bg-neutral-50 p-4 rounded-lg">
              <h3 className="text-xl font-semibold text-primary-600 mb-2">
                {content.title}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-neutral-600 mb-3">
                <span>{new Date(content.event_date).toLocaleDateString()}</span>
                <span>{new Date(content.event_date).toLocaleTimeString()}</span>
                <span>{content.location}</span>
              </div>
              {content.is_members_only && (
                <span className="inline-block bg-primary-100 text-primary-600 text-xs px-2 py-1 rounded mb-3">
                  Members Only
                </span>
              )}
              <p className="text-neutral-700">{content.description}</p>
            </div>
          </div>
        );

      case "news":
      case "blog":
      case "snippet":
        return (
          <div className="space-y-4">
            {content.image_url && (
              <img
                src={content.image_url}
                alt={content.title}
                className="w-full h-48 object-cover rounded-lg"
              />
            )}
            <div>
              <h3 className="text-xl font-semibold text-primary-600 mb-2">
                {content.title}
              </h3>
              <p className="text-neutral-600 mb-3">{content.summary}</p>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: content.content }}
              />
            </div>
          </div>
        );

      // ... other cases unchanged
      default:
        return <p>Preview not available for this content type.</p>;
    }
  };

  const liveUrl = getLiveUrl();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <h2 className="text-xl font-semibold text-primary-600">
            Content Preview
          </h2>
          <div className="flex items-center space-x-2">
            {liveUrl && (
              <>
                <a
                  href={liveUrl ?? undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center"
                  >
                    <ExternalLink size={16} className="mr-1" />
                    View Live
                  </Button>
                </a>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyLink}
                  className="flex items-center"
                >
                  <Copy size={16} className="mr-1" />
                  Copy Link
                </Button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-1 text-neutral-500 hover:text-neutral-700 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          {renderPreview()}
        </div>
      </div>
    </div>
  );
};

export default ContentPreview;
