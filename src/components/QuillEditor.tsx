// src/components/QuillEditor.tsx
import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../styles/quill-overrides.css";

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
  showSnippets?: boolean;
}

const QuillEditor: React.FC<QuillEditorProps> = ({
  value,
  onChange,
  placeholder = "Start writing here…",
  height = 250,
  showSnippets = false,
}) => {
  const insertSnippet = (html: string) => {
    onChange(value + html);
  };

  return (
    <div>
      {showSnippets && (
        <div className="flex gap-2 mb-2 flex-wrap">
          <button
            type="button"
            onClick={() =>
              insertSnippet(
                '<div class="callout-box"><h3>Key Point</h3><p>Your important information here.</p></div>'
              )
            }
            className="px-3 py-1.5 text-sm border border-neutral-300 rounded hover:bg-neutral-50 transition"
          >
            Insert Callout Box
          </button>

          <button
            type="button"
            onClick={() =>
              insertSnippet(
                '<div class="alert-box"><strong>Note:</strong> This section contains important information.</div>'
              )
            }
            className="px-3 py-1.5 text-sm border border-neutral-300 rounded hover:bg-neutral-50 transition"
          >
            Insert Warning Box
          </button>

          <button
            type="button"
            onClick={() =>
              insertSnippet(
                '<div class="info-box"><p>This is an informational block for the admin to highlight content.</p></div>'
              )
            }
            className="px-3 py-1.5 text-sm border border-neutral-300 rounded hover:bg-neutral-50 transition"
          >
            Insert Info Box
          </button>
        </div>
      )}

      <div className="border border-neutral-300 rounded-md bg-white">
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{ height }}
          modules={{
            toolbar: [
              [{ header: [1, 2, 3, false] }],
              ["bold", "italic", "underline"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["blockquote"],
              ["link"],
              ["clean"],
            ],
          }}
        />
      </div>
    </div>
  );
};

export default QuillEditor;
