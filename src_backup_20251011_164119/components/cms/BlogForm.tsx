// src/components/cms/BlogForm.tsx
import React, { useState } from "react";
import RichTextEditor from "../RichTextEditor";
import Button from "../Button";

export interface BlogFormValues {
  title: string;
  content: string;
  summary?: string; // strict, no nulls
  category: string;
  tags?: string[];
  publish_date?: string;
  is_published?: boolean;
}

export interface BlogFormProps {
  initialValues?: Partial<BlogFormValues>;
  onSubmit: (values: BlogFormValues) => void;
  onCancel?: () => void; // 👈 added so CMSAdminPage compiles
}

const BlogForm: React.FC<BlogFormProps> = ({ initialValues, onSubmit, onCancel }) => {
  const [formValues, setFormValues] = useState<BlogFormValues>({
    title: initialValues?.title || "",
    content: initialValues?.content || "",
    summary: initialValues?.summary || "",
    category: initialValues?.category || "news",
    tags: initialValues?.tags || [],
    publish_date: initialValues?.publish_date || new Date().toISOString(),
    is_published: initialValues?.is_published ?? false,
  });

  const handleChange = (field: keyof BlogFormValues, value: any) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formValues);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium">Title</label>
        <input
          type="text"
          value={formValues.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      {/* Summary */}
      <div>
        <label className="block text-sm font-medium">Summary</label>
        <textarea
          value={formValues.summary}
          onChange={(e) => handleChange("summary", e.target.value)}
          className="w-full border rounded px-3 py-2"
          rows={2}
        />
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium">Content</label>
        <RichTextEditor
          value={formValues.content}
          onChange={(html) => handleChange("content", html)}
          placeholder="Write your article..."
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium">Category</label>
        <select
          value={formValues.category}
          onChange={(e) => handleChange("category", e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="news">News</option>
          <option value="blog">Blog</option>
          <option value="charity">Charity</option>
          <option value="snippets">Snippets</option>
        </select>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium">Tags (comma-separated)</label>
        <input
          type="text"
          value={formValues.tags?.join(", ") || ""}
          onChange={(e) =>
            handleChange(
              "tags",
              e.target.value.split(",").map((tag) => tag.trim())
            )
          }
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Published toggle */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={formValues.is_published}
          onChange={(e) => handleChange("is_published", e.target.checked)}
        />
        <label className="text-sm">Published</label>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">Save Post</Button>
      </div>
    </form>
  );
};

export default BlogForm;
