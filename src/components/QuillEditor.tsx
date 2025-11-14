// src/components/QuillEditor.tsx
import React, { useEffect, useRef, useMemo, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import MediaManagerModal from "./media/MediaManagerModal";

interface QuillEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  showSnippets?: boolean;
  height?: number;
}

const QUICK_SNIPPETS = [
  {
    label: "Callout",
    markup:
      '<div class="callout-box"><h3>Key Insight</h3><p>Share supporting detail here.</p></div>',
  },
  {
    label: "Warning",
    markup:
      '<div class="alert-box"><strong>Note:</strong> Important cautionary text.</div>',
  },
  {
    label: "Info",
    markup:
      '<div class="info-box"><p>This block highlights supportive context.</p></div>',
  },
];

const getSelectedImage = (quill: any): HTMLImageElement | null => {
  const range = quill?.getSelection?.();
  if (!range) return null;
  const [leaf] = quill.getLeaf(range.index);
  if (!leaf?.domNode || leaf.domNode.tagName !== "IMG") return null;
  return leaf.domNode as HTMLImageElement;
};

const QuillEditor: React.FC<QuillEditorProps> = ({
  value,
  onChange,
  placeholder = "Write…",
  showSnippets = false,
  height = 300,
}) => {
  const quillRef = useRef<any>(null);
  const [showMedia, setShowMedia] = useState(false);
  const [replaceTarget, setReplaceTarget] =
    useState<HTMLImageElement | null>(null);

  const getQuill = () => quillRef.current?.getEditor?.();

  const insertImage = (url: string) => {
    const quill = getQuill();
    if (!quill) return;

    if (replaceTarget) {
      replaceTarget.setAttribute("src", url);
      setReplaceTarget(null);
    } else {
      const range =
        quill.getSelection() ?? { index: quill.getLength(), length: 0 };
      quill.insertEmbed(range.index, "image", url);
      quill.setSelection(range.index + 1);
    }

    setShowMedia(false);
  };

  const generateAltText = async () => {
    const quill = getQuill();
    if (!quill) return;
    const img = getSelectedImage(quill);
    if (!img) return alert("Select an image first.");

    try {
      const res = await fetch("/.netlify/functions/generate-alt-text", {
        method: "POST",
        body: JSON.stringify({ image_url: img.src }),
      });
      const data = await res.json();
      if (data.alt) img.setAttribute("alt", data.alt);
    } catch (err) {
      console.error(err);
      alert("Could not generate alt text.");
    }
  };

  const addCaption = () => {
    const quill = getQuill();
    if (!quill) return;
    const img = getSelectedImage(quill);
    if (!img) return alert("Select an image first.");

    const caption = prompt("Enter caption:");
    if (!caption) return;

    const wrapper = document.createElement("div");
    wrapper.className = "image-caption";
    wrapper.innerText = caption;
    img.insertAdjacentElement("afterend", wrapper);
  };

  const floatImage = (position: "left" | "center" | "right" | "full") => {
    const quill = getQuill();
    if (!quill) return;
    const img = getSelectedImage(quill);
    if (!img) return alert("Select an image first.");

    img.style.display = "block";

    if (position === "left") {
      img.style.margin = "10px 10px 10px 0";
      img.style.float = "left";
      img.style.width = "50%";
      return;
    }
    if (position === "right") {
      img.style.margin = "10px 0 10px 10px";
      img.style.float = "right";
      img.style.width = "50%";
      return;
    }
    if (position === "center") {
      img.style.margin = "0 auto";
      img.style.float = "none";
      img.style.width = "60%";
      return;
    }
    img.style.margin = "10px 0";
    img.style.float = "none";
    img.style.width = "100%";
  };

  const generateAllAltText = async () => {
    const dom = document.createElement("div");
    dom.innerHTML = value;
    const images = Array.from(dom.querySelectorAll("img"));
    if (!images.length) return alert("No images found.");

    for (const img of images) {
      try {
        const res = await fetch("/.netlify/functions/generate-alt-text", {
          method: "POST",
          body: JSON.stringify({ image_url: img.src }),
        });
        const data = await res.json();
        if (data.alt) img.setAttribute("alt", data.alt);
      } catch (err) {
        console.error("Bulk alt text failed", err);
      }
    }

    onChange(dom.innerHTML);
    alert("Alt text generated for all images.");
  };

  useEffect(() => {
    const quill = getQuill();
    if (!quill) return;
    const handler = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName === "IMG") {
        setReplaceTarget(target as HTMLImageElement);
        setShowMedia(true);
      }
    };
    quill.root.addEventListener("dblclick", handler);
    return () => quill.root.removeEventListener("dblclick", handler);
  }, []);

  const insertSnippet = (markup: string) => {
    const quill = getQuill();
    if (!quill) {
      onChange(value + markup);
      return;
    }
    const range =
      quill.getSelection() ?? {
        index: quill.getLength(),
        length: 0,
      };
    quill.clipboard.dangerouslyPasteHTML(range.index, markup);
    quill.setSelection(range.index + markup.length, 0);
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "blockquote"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          ["clean"],
          [
            { floatLeft: "left" },
            { floatCenter: "center" },
            { floatRight: "right" },
            { floatFull: "full" },
            "caption",
            "altText",
            "ocr",
            "bulkAlt",
          ],
        ],
        handlers: {
          image: () => setShowMedia(true),
          floatLeft: () => floatImage("left"),
          floatCenter: () => floatImage("center"),
          floatRight: () => floatImage("right"),
          floatFull: () => floatImage("full"),
          caption: () => addCaption(),
          altText: () => generateAltText(),
          bulkAlt: () => generateAllAltText(),
          ocr: () => alert("OCR feature coming soon."),
        },
      },
    }),
    [value]
  );

  const QuillComponent = ReactQuill as unknown as React.ComponentType<any>;

  return (
    <div className="space-y-2">
      {showSnippets && (
        <div className="flex flex-wrap gap-2">
          {QUICK_SNIPPETS.map((snippet) => (
            <button
              key={snippet.label}
              type="button"
              className="px-3 py-1.5 text-sm border border-neutral-300 rounded hover:bg-neutral-50 transition"
              onClick={() => insertSnippet(snippet.markup)}
            >
              {snippet.label}
            </button>
          ))}
        </div>
      )}

      <QuillComponent
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        modules={modules}
        style={{ minHeight: height }}
      />

      <MediaManagerModal
        isOpen={showMedia}
        onClose={() => setShowMedia(false)}
        onSelect={insertImage}
        defaultFolder="blog-images"
      />
    </div>
  );
};

export default QuillEditor;
