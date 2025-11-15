// src/components/QuillEditor.tsx
import React, { useCallback, useMemo } from "react";
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

const SNIPPETS = [
  {
    label: "Callout",
    markup:
      '<div class="callout-box"><h3>Key Point</h3><p>Share supporting detail here.</p></div>',
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

const QuillEditor: React.FC<QuillEditorProps> = ({
  value,
  onChange,
  placeholder = "Start writing here…",
  height = 250,
  showSnippets = false,
}) => {
  const insertSnippet = useCallback(
    (html: string) => {
      onChange((value || "") + html);
    },
    [onChange, value]
  );

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        [{ color: [] }, { background: [] }],
        ["clean"],
      ],
    }),
    []
  );

  return (
    <div className="space-y-2">
      {showSnippets && (
        <div className="flex flex-wrap gap-2">
          {SNIPPETS.map((snippet) => (
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

      <div className="border border-neutral-300 rounded-md bg-white">
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          modules={modules}
          style={{ height }}
        />
      </div>
    </div>
  );
};

export default QuillEditor;
