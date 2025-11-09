// src/components/cms/PageContentForm.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { PageContent } from "../../types";
import Button from "../Button";
import QuillEditor from "../QuillEditor";

interface PageContentFormProps {
  onSubmit: (data: Omit<PageContent, "id" | "updated_at">) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<PageContent>;
}

const PageContentForm: React.FC<PageContentFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      page_name: initialData?.page_name || "",
      section_name: initialData?.section_name || "",
      content: initialData?.content || "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-primary-600">
          Page Key
        </label>
        <input
          {...register("page_name", { required: "Page key is required" })}
          className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2"
        />
        {errors.page_name && (
          <p className="mt-1 text-sm text-red-600">
            {errors.page_name.message as string}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-primary-600">
          Section Name
        </label>
        <input
          {...register("section_name")}
          className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-primary-600">
          Content
        </label>
        <QuillEditor
          value={watch("content")}
          onChange={(html: string) =>
            setValue("content", html, { shouldDirty: true })
          }
          placeholder="Page HTML or content"
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">
            {errors.content.message as string}
          </p>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
};

export default PageContentForm;
