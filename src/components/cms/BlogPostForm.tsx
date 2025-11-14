import React, { useState, useEffect } from "react";
import MediaManager from "./MediaManager";

// Automatic excerpt generator
const generateExcerpt = (html: string, length = 140) => {
  const stripped = html.replace(/<[^>]+>/g, "");
  return stripped.length > length
    ? stripped.substring(0, length) + "..."
    : stripped;
};

// SEO score calculator
const calculateSeoScore = (
  getValue: (field: string) => string | undefined
): number => {
  const title = getValue("title") || "";
  const desc = getValue("seo_description") || "";
  const content = getValue("content") || "";

  let score = 0;
  if (title.length > 20 && title.length < 70) score++;
  if (desc.length > 50 && desc.length < 160) score++;
  if (content.replace(/<[^>]*>/g, "").length > 300) score++;
  return score;
};

// Minimal BlogPostForm placeholder used by the CMS routes.
// This file ensures the MediaManager used here is locked to the `blog-images` folder
// and will set the `image_url` value when an image is selected.
const BlogPostForm: React.FC<any> = (_props) => {
  // local image value (the real CMS form will manage this via react-hook-form)
  const [imageUrl, setImageUrl] = useState<string>("");
  const [showMedia, setShowMedia] = useState(false);

  // lightweight stand-in for react-hook-form's setValue used in the snippet you provided
  const setValue = (field: string, url: string) => {
    if (field === "image_url") setImageUrl(url);
    // For excerpt auto-generation
    if (field === "excerpt") {
      // In a real form, you'd update form state here
    }
  };

  // Placeholder watch/getValue function for preview
  const getValue = (field: string) => {
    if (field === "slug") return "your-post-slug";
    if (field === "title") return "Post Title Preview";
    if (field === "seo_description") {
      return "Meta description will appear here...";
    }
    if (field === "excerpt") return "Meta description will appear here...";
    return "";
  };

  const contentValue = getValue("content") || "";
  const excerptValue = getValue("excerpt") || "";

  // Automatic excerpt generation effect (replace with real form logic if using react-hook-form)
  useEffect(() => {
    if (!excerptValue || excerptValue.length < 5) {
      const autoExcerpt = generateExcerpt(contentValue);
      setValue("excerpt", autoExcerpt);
    }
  }, [contentValue, excerptValue]);

  return (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Featured image URL</label>
        <div className="flex items-center gap-2 mt-1">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="flex-1 rounded-md border px-3 py-2"
            placeholder="https://example.com/image.jpg"
          />
          <button
            type="button"
            onClick={() => setShowMedia(true)}
            className="px-3 py-2 border rounded text-sm"
          >
            Browse
          </button>
        </div>
      </div>

      <label className="block text-sm font-medium text-gray-700 mt-4">
        SEO Description (optional)
      </label>
      <textarea
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        name="seo_description"
        rows={3}
        placeholder="Short description for Google search results..."
      />

      <div className="mt-6 p-4 border rounded-md bg-gray-50">
        <h3 className="text-md font-semibold mb-2">SEO Preview</h3>
        <div className="bg-white p-4 rounded-md shadow-sm border">
          <p className="text-sm text-blue-700 font-medium">
            radlettlodge.org.uk/pillars/{getValue("slug") || "your-post-slug"}
          </p>
          <p className="text-lg text-blue-800 font-bold mt-1">
            {getValue("title") || "Post Title Preview"}
          </p>
          <p className="text-sm text-gray-700 mt-1">
            {getValue("seo_description") &&
            getValue("seo_description")!.length > 0
              ? getValue("seo_description")
              : getValue("excerpt") || "Meta description will appear here..."}
          </p>

          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm font-medium">SEO Score:</span>
            <div
              className={`w-3 h-3 rounded-full ${
                calculateSeoScore(getValue) === 3
                  ? "bg-green-500"
                  : calculateSeoScore(getValue) === 2
                  ? "bg-yellow-400"
                  : "bg-red-500"
              }`}
            />
            <span className="text-sm">
              {calculateSeoScore(getValue)} / 3
            </span>
          </div>
        </div>
      </div>

      <MediaManager
        isOpen={showMedia}
        onSelectMedia={(url: string) => setValue("image_url", url)}
        onClose={() => setShowMedia(false)}
        defaultFolder="blog-images"
      />
    </div>
  );
};

export default BlogPostForm;
