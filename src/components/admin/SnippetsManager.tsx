// src/components/admin/SnippetsManager.tsx
import React from "react";
import Button from "../Button";
import { Pencil, Trash2, PlusCircle } from "lucide-react";
import type { CMSBlogPost } from "../../types";

interface SnippetsManagerProps {
  snippets: CMSBlogPost[];
  onRefresh?: () => void;
  onEdit?: (snippet: CMSBlogPost) => void;
  onDelete?: (id: string) => void;
  onAdd?: () => void;
  onPreview?: (item: {
    title?: string;
    content?: string;
    image_url?: string | null;
  }) => void;
}

const SnippetsManager: React.FC<SnippetsManagerProps> = ({
  snippets,
  onRefresh,
  onEdit,
  onDelete,
  onAdd,
  onPreview,
}) => {
  const hasSnippets = Array.isArray(snippets) && snippets.length > 0;

  return (
    <div className="space-y-6 bg-white shadow rounded-md p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-neutral-800">
          Snippets Management ({snippets.length})
        </h2>

        {/* ✅ Active button */}
        <Button onClick={() => onAdd?.()} variant="primary">
          <PlusCircle className="w-4 h-4 mr-2 inline" />
          Add Snippet
        </Button>
      </div>

      {/* ✅ List of snippets */}
      {hasSnippets ? (
        <ul className="divide-y divide-neutral-200">
          {snippets.map((snip) => (
            <li
              key={snip.id}
              className="flex justify-between items-center py-3 hover:bg-neutral-50 transition"
            >
              <div>
                <p className="font-medium text-neutral-800">
                  {snip.title || "Untitled Snippet"}
                </p>
                <p className="text-sm text-neutral-500">
                  {snip.publish_date
                    ? new Date(snip.publish_date).toLocaleDateString()
                    : "No date"}{" "}
                  • {snip.is_published ? "Active" : "Inactive"}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    onPreview?.({
                      title: snip.title,
                      content: snip.content,
                      image_url: snip.image_url,
                    })
                  }
                >
                  Preview
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit?.(snip)}
                >
                  <Pencil size={14} />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (confirm(`Delete snippet "${snip.title}"?`)) {
                      onDelete?.(snip.id);
                    }
                  }}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-neutral-600 italic">
          No snippets found in Supabase table.
        </p>
      )}

      {/* ✅ Manual refresh */}
      {onRefresh && (
        <div className="pt-4">
          <Button variant="outline" onClick={onRefresh}>
            Refresh List
          </Button>
        </div>
      )}
    </div>
  );
};

export default SnippetsManager;
