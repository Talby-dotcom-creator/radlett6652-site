// src/components/RichTextEditor.tsx
import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";

import "./RichTextEditor.css";

export interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  maxLength?: number; // ✅ optional character limit
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder,
  maxLength = 2000, // default limit
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder || "Start typing here...",
      }),
      CharacterCount.configure({ limit: maxLength }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="rich-text-editor">
      {/* Toolbar */}
      <div className="toolbar">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "active" : ""}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "active" : ""}
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "active" : ""}
        >
          S
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={editor.isActive("heading", { level: 2 }) ? "active" : ""}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "active" : ""}
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "active" : ""}
        >
          1. List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? "active" : ""}
        >
          ❝
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          ―
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setCodeBlock().run()}
          className={editor.isActive("codeBlock") ? "active" : ""}
        >
          {"</>"}
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
        >
          ↺
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
        >
          ↻
        </button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} className="editor-content" />

      {/* Character Count */}
      <div className="char-counter">
        {editor.storage.characterCount.characters()}/{maxLength} characters
      </div>
    </div>
  );
};

export default RichTextEditor;
// src/components/RichTextEditor.tsx
