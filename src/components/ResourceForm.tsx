// src/components/ResourceForm.tsx
import React, { useState } from "react";
import Button from "./Button";
import QuillEditor from "./QuillEditor";
import MediaManagerModal from "./media/MediaManagerModal";

interface ResourceFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

const ResourceForm: React.FC<ResourceFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
}) => {
  const [showMM, setShowMM] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    category: initialData?.category || "byelaws",
    description: initialData?.description || "",
    content: initialData?.content || "",
    file_url: initialData?.file_url || "",
    publish_date: initialData?.publish_date
      ? initialData.publish_date.slice(0, 10)
      : "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpload = (url: string) => {
    setFormData({ ...formData, file_url: url });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-[#0B1831] text-white border border-[#BFA76F]/30 rounded-xl p-6"
    >
      <div>
        <label className="block mb-1 text-sm font-medium text-[#BFA76F]">
          Title
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full p-2 rounded bg-[#142850] border border-[#BFA76F]/20"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-[#BFA76F]">
          Category
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-2 rounded bg-[#142850] border border-[#BFA76F]/20"
        >
          <option value="byelaws">Byelaws</option>
          <option value="forms">Forms</option>
          <option value="ritual">Ritual</option>
          <option value="resources">Resources</option>
          <option value="others">Others</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-[#BFA76F]">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full p-2 rounded bg-[#142850] border border-[#BFA76F]/20"
        />
      </div>

      {/* File upload */}
      <div>
        <label className="block mb-1 text-sm font-medium text-[#BFA76F]">
          Upload File (PDF, DOCX, etc.)
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={formData.file_url}
            readOnly
            className="flex-1 p-2 rounded bg-[#142850] border border-[#BFA76F]/20"
            placeholder="Select a file..."
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowMM(true)}
          >
            Browse
          </Button>
        </div>
        {formData.file_url && (
          <p className="text-sm mt-2 text-green-400">
            ✅ File uploaded:{" "}
            <a
              href={formData.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-[#BFA76F]"
            >
              View file
            </a>
          </p>
        )}
      </div>

      {/* Rich text content */}
      <div>
        <label className="block mb-1 text-sm font-medium text-[#BFA76F]">
          Additional Notes or Content
        </label>
        <QuillEditor
          value={formData.content}
          onChange={(html: string) =>
            setFormData({ ...formData, content: html })
          }
        />
      </div>

      {/* Publish date */}
      <div>
        <label className="block mb-1 text-sm font-medium text-[#BFA76F]">
          Publish Date
        </label>
        <input
          type="date"
          name="publish_date"
          value={formData.publish_date}
          onChange={handleChange}
          className="w-full p-2 rounded bg-[#142850] border border-[#BFA76F]/20"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" type="submit">
          Save Resource
        </Button>
      </div>

      <MediaManagerModal
        isOpen={showMM}
        onClose={() => setShowMM(false)}
        onSelect={(url) => {
          setFormData({ ...formData, file_url: url });
          setShowMM(false);
        }}
        defaultFolder="resources"
      />
    </form>
  );
};

export default ResourceForm;
