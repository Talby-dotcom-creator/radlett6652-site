import React from "react";
import Button from "./ui/Button"; // ✅ fixed import

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full border p-2 rounded h-40"
      />
      <Button onClick={() => alert("Preview not implemented yet")}>Preview</Button>
    </div>
  );
};

export default RichTextEditor;
