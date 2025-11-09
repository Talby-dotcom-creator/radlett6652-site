import React, { useState } from "react";
import MediaManager from "./MediaManager";

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
  };

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

      {/* Media Manager locked to blog-images and wired to setValue("image_url", url) */}
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
