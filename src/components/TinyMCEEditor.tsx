// src/components/TinyMCEEditor.tsx
import React from "react";
import QuillEditor from "./QuillEditor";

interface TinyMCEEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

// Backwards-compatible wrapper: re-use RichTextEditor implementation
const TinyMCEEditor: React.FC<TinyMCEEditorProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div className="rounded-md overflow-hidden border border-neutral-200">
      <QuillEditor
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default TinyMCEEditor;
