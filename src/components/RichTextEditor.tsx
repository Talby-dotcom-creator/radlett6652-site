// src/components/RichTextEditor.tsx
import React, { useRef, useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { uploadMedia } from "../lib/supabaseUpload";
import MediaManager from "./MediaManager";
import Button from "./Button";

interface RichTextEditorProps {
  name?: string;
  initialValue?: string;
  value?: string;
  placeholder?: string;
  onChange?: (content: string) => void;
  height?: number;
  defaultFolder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  name,
  initialValue = "",
  value,
  placeholder = "Start typing here...",
  onChange,
  height = 350,
  defaultFolder,
}) => {
  const [showMediaManager, setShowMediaManager] = useState(false);
  const quillRef = useRef<any>(null);

  /* ✅ Force Left-to-Right typing */
  useEffect(() => {
    const forceLTR = () => {
      const editor = document.querySelector(".ql-editor") as HTMLElement;
      if (editor) {
        editor.style.direction = "ltr";
        editor.style.textAlign = "left";
        editor.setAttribute("dir", "ltr");
      }
    };
    forceLTR();
    const interval = setInterval(forceLTR, 1000);
    return () => clearInterval(interval);
  }, []);

  /* ✅ Toolbar: handle image upload (paste / drag-drop) */
  const handleImageUpload = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*,application/pdf";

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      try {
        const url = await uploadMedia(file, "cms-media");
        const editor = quillRef.current?.getEditor();
        if (editor) {
          const range = editor.getSelection(true);

          if (file.name.toLowerCase().endsWith(".pdf")) {
            editor.insertEmbed(
              range.index,
              "text",
              `📄 PDF: ${file.name}\n${url}\n`
            );
          } else {
            editor.insertEmbed(range.index, "image", url);
          }
        }
      } catch (err) {
        alert("Upload failed");
      }
    };

    input.click();
  };

  /* ✅ Insert media selected from MediaManager */
  const handleMediaSelect = (url: string) => {
    const editor = quillRef.current?.getEditor();
    if (editor) {
      const range = editor.getSelection(true);

      if (url.toLowerCase().endsWith(".pdf")) {
        editor.insertEmbed(range.index, "text", `📄 PDF File\n${url}\n`);
      } else {
        editor.insertEmbed(range.index, "image", url);
      }
    }
    setShowMediaManager(false);
  };

  /* ✅ Quill toolbar setup */
  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        [{ font: [] }],
        [{ size: [] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["blockquote", "code-block"],
        ["link", "image"],
        ["clean"],
      ],
      handlers: {
        image: handleImageUpload,
      },
    },
  };

  // Workaround: cast ReactQuill to any so we can attach a ref in JSX without
  // fighting the ReactQuillProps typing.
  const ReactQuillAny: any = ReactQuill;

  return (
    <div className="relative border border-neutral-300 rounded-md bg-white">
      {/* ✅ Media Library Button */}
      <div className="flex justify-end p-2 bg-[#0B1831]/80">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowMediaManager(true)}
        >
          📁 Insert from Media Library
        </Button>
      </div>

      {/* ✅ React Quill Editor */}
      <ReactQuillAny
        ref={quillRef}
        value={value ?? initialValue}
        modules={modules}
        placeholder={placeholder}
        onChange={(content: string) => onChange?.(content)}
        style={{ height: height, background: "white" }}
      />

      {/* ✅ Hidden form input */}
      <textarea name={name || undefined} defaultValue={initialValue} hidden />

      {/* ✅ Media Manager Modal */}
      {showMediaManager && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#0B1831] border border-[#BFA76F]/40 rounded-xl shadow-2xl p-4 max-w-4xl w-full mx-4">
            <MediaManager
              isOpen={true}
              onClose={() => setShowMediaManager(false)}
              onSelectMedia={handleMediaSelect}
              defaultFolder={defaultFolder}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
