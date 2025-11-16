import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "../../lib/supabase";
import Button from "../Button";
import MediaManagerModal from "../media/MediaManagerModal";

interface FormValues {
  title: string;
  description: string;
  category: string;
  url: string;
}

interface DocumentFormProps {
  initialData?: {
    id: string;
    title: string;
    description?: string | null;
    category?: string;
    url: string;
  };
  onClose: () => void;
}

const DocumentForm: React.FC<DocumentFormProps> = ({
  initialData,
  onClose,
}) => {
  const [showMediaManager, setShowMediaManager] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sourceMode, setSourceMode] = useState<"media" | "url">("media");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      category: initialData?.category || "",
      url: initialData?.url || "",
    },
  });

  const urlValue = watch("url");

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    try {
      const payload = {
        title: data.title,
        description: data.description || null,
        category: data.category || "",
        url: data.url,
        updated_at: new Date().toISOString(),
      };

      if (initialData) {
        // Update existing document
        const { error } = await supabase
          .from("lodge_documents")
          .update(payload as any)
          .eq("id", initialData.id);

        if (error) throw error;
        alert("Document updated successfully!");
      } else {
        // Create new document
        const { error } = await supabase
          .from("lodge_documents")
          .insert([payload as any]);

        if (error) throw error;
        alert("Document created successfully!");
      }

      onClose();
    } catch (err) {
      console.error("Error saving document:", err);
      alert("Failed to save document");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-[#0B1831] mb-4">
        {initialData ? "Edit Document" : "New Document"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Title *
          </label>
          <input
            {...register("title", { required: "Title is required" })}
            type="text"
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#BFA76F] focus:border-transparent"
            placeholder="Document title"
          />
          {errors.title && (
            <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Description
          </label>
          <textarea
            {...register("description")}
            rows={3}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#BFA76F] focus:border-transparent"
            placeholder="Brief description of the document"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Category
          </label>
          {(() => {
            const categories = [
              "Grand Lodge Communications",
              "Provincial Communications",
              "Summons",
              "Meeting Minutes",
              "GPC Minutes",
              "Lodge of Instruction",
              "Resources",
              "Solomon",
              "Bylaws",
              "Forms",
              "Ritual",
              "Other",
            ];
            const sorted = [...categories].sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));
            return (
              <select
                {...register("category")}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#BFA76F] focus:border-transparent bg-white"
              >
                <option value="">Select a category</option>
                {sorted.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            );
          })()}
        </div>

        {/* Source + File URL */}
        <div>
          <span className="block text-sm font-medium text-neutral-700 mb-1">
            Source
          </span>
          <div className="flex items-center gap-6 mb-3">
            <label className="inline-flex items-center gap-2 text-sm text-neutral-700">
              <input
                type="radio"
                name="sourceMode"
                value="media"
                checked={sourceMode === "media"}
                onChange={() => setSourceMode("media")}
              />
              Select from Media
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-neutral-700">
              <input
                type="radio"
                name="sourceMode"
                value="url"
                checked={sourceMode === "url"}
                onChange={() => setSourceMode("url")}
              />
              Paste external link
            </label>
          </div>

          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Document URL *
          </label>
          <div className="flex gap-2">
            <input
              {...register("url", { required: "Document URL is required" })}
              type="text"
              className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#BFA76F] focus:border-transparent"
              placeholder={
                sourceMode === "media"
                  ? "Select from media or paste a link"
                  : "https://example.com/file.pdf"
              }
              value={urlValue}
              readOnly={sourceMode === "media"}
              onChange={(e) => setValue("url", e.target.value)}
            />
            {sourceMode === "media" && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowMediaManager(true)}
              >
                Browse
              </Button>
            )}
          </div>
          {errors.url && (
            <p className="text-red-600 text-sm mt-1">{errors.url.message}</p>
          )}
        </div>

        {/* Media Manager Modal */}
        <MediaManagerModal
          isOpen={showMediaManager}
          onClose={() => setShowMediaManager(false)}
          onSelect={(url) => {
            setValue("url", url);
            setShowMediaManager(false);
          }}
          defaultFolder="documents"
        />

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? "Saving..." : initialData ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DocumentForm;
