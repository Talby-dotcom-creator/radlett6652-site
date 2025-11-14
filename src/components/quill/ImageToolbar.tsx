import React, { useState } from "react";

interface ImageToolbarProps {
  target: HTMLImageElement;
}

const ImageToolbar: React.FC<ImageToolbarProps> = ({ target }) => {
  const [hasCaption, setHasCaption] = useState(false);

  const applyStyle = (style: string) => {
    target.style.display = "block";
    target.style.height = "auto";

    if (style === "left") {
      target.style.margin = "0";
      target.style.float = "left";
      target.style.maxWidth = "45%";
    } else if (style === "center") {
      target.style.margin = "1rem auto";
      target.style.float = "none";
      target.style.maxWidth = "60%";
    } else if (style === "right") {
      target.style.margin = "0 0 0 auto";
      target.style.float = "right";
      target.style.maxWidth = "45%";
    } else if (style === "full") {
      target.style.float = "none";
      target.style.maxWidth = "100%";
      target.style.margin = "1rem 0";
    }
  };

  const toggleRounded = () => {
    if (target.style.borderRadius === "12px") {
      target.style.borderRadius = "0";
    } else {
      target.style.borderRadius = "12px";
    }
  };

  const toggleShadow = () => {
    if (target.style.boxShadow) {
      target.style.boxShadow = "";
    } else {
      target.style.boxShadow = "0 2px 12px rgba(0,0,0,0.15)";
    }
  };

  const toggleBorder = () => {
    if (target.style.border) {
      target.style.border = "";
    } else {
      target.style.border = "2px solid #eee";
    }
  };

  const resize = (size: string) => {
    target.style.float = "none";
    if (size === "small") target.style.maxWidth = "30%";
    if (size === "medium") target.style.maxWidth = "50%";
    if (size === "large") target.style.maxWidth = "70%";
    if (size === "full") target.style.maxWidth = "100%";
    target.style.margin = "1rem auto";
  };

  const addCaption = () => {
    if (hasCaption) return;

    const caption = document.createElement("div");
    caption.contentEditable = "true";
    caption.innerText = "Write a caption…";
    caption.style.fontSize = "0.9rem";
    caption.style.textAlign = "center";
    caption.style.color = "#666";
    caption.style.marginTop = "6px";
    caption.style.outline = "none";

    target.insertAdjacentElement("afterend", caption);
    setHasCaption(true);
  };

  return (
    <div className="absolute z-50 bg-white shadow-xl border rounded-lg p-3 flex flex-wrap gap-2 w-[310px]">
      {/* Alignment */}
      <button
        className="px-2 py-1 border rounded"
        onClick={() => applyStyle("left")}
      >
        Left
      </button>
      <button
        className="px-2 py-1 border rounded"
        onClick={() => applyStyle("center")}
      >
        Center
      </button>
      <button
        className="px-2 py-1 border rounded"
        onClick={() => applyStyle("right")}
      >
        Right
      </button>
      <button
        className="px-2 py-1 border rounded"
        onClick={() => applyStyle("full")}
      >
        Full
      </button>

      {/* Resize */}
      <button
        className="px-2 py-1 border rounded"
        onClick={() => resize("small")}
      >
        S
      </button>
      <button
        className="px-2 py-1 border rounded"
        onClick={() => resize("medium")}
      >
        M
      </button>
      <button
        className="px-2 py-1 border rounded"
        onClick={() => resize("large")}
      >
        L
      </button>
      <button
        className="px-2 py-1 border rounded"
        onClick={() => resize("full")}
      >
        XL
      </button>

      {/* Effects */}
      <button className="px-2 py-1 border rounded" onClick={toggleRounded}>
        Rounded
      </button>
      <button className="px-2 py-1 border rounded" onClick={toggleShadow}>
        Shadow
      </button>
      <button className="px-2 py-1 border rounded" onClick={toggleBorder}>
        Border
      </button>

      {/* Caption */}
      <button className="px-2 py-1 border rounded" onClick={addCaption}>
        Caption
      </button>

      {/* Delete */}
      <button
        className="px-2 py-1 border rounded text-red-600"
        onClick={() => target.remove()}
      >
        Delete
      </button>
    </div>
  );
};

export default ImageToolbar;
