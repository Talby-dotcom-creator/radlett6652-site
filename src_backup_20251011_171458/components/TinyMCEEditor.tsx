// src/components/TinyMCEEditor.tsx
import React from "react";
import { Editor } from "@tinymce/tinymce-react";

interface TinyMCEEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const TinyMCEEditor: React.FC<TinyMCEEditorProps> = ({ value, onChange }) => {
  const apiKey = import.meta.env.VITE_TINYMCE_API_KEY;

  return (
    <div className="rounded-md overflow-hidden border border-neutral-200">
      <Editor
        apiKey={apiKey}
        value={value}
        init={{
          height: 400,
          menubar: false,
          branding: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "table",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks | bold italic forecolor | " +
            "alignleft aligncenter alignright alignjustify | " +
            "bullist numlist outdent indent | removeformat | help",
          content_style:
            "body { font-family:Open Sans,Arial,sans-serif; font-size:16px; line-height:1.6; }",
        }}
        onEditorChange={(content) => onChange(content)}
      />
    </div>
  );
};

export default TinyMCEEditor;
