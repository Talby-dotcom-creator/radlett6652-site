import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "../../lib/supabase";
import Button from "../Button";
import QuillEditor from "../QuillEditor";
import ModalMediaManager from "../media/MediaManagerModal";

interface Props {
  initialData?: any;
  onCancel: () => void;
  onSaved: () => void;
}

interface FormVals {
  title: string;
  subtitle?: string;
  content: string;
  publish_date?: string;
}

const SnippetForm: React.FC<Props> = ({ initialData, onCancel, onSaved }) => {
  const [showMM, setShowMM] = useState(false);
  const [img, setImg] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<FormVals>({
    defaultValues: {
      title: initialData?.title || "",
      subtitle: initialData?.subtitle || "",
      content: initialData?.content || "",
      publish_date: initialData?.publish_date
        ? new Date(initialData.publish_date).toISOString().slice(0, 16)
        : "",
    },
  });

  const onSelectMedia = (url: string) => {
    setImg(url);
    setValue("content", watch("content") + `<p><img src="${url}" /></p>`);
    setShowMM(false);
  };

  const onSubmit = async (vals: FormVals) => {
    const payload = {
      ...vals,
      publish_date: vals.publish_date
        ? new Date(vals.publish_date).toISOString()
        : null,
    };

    if (initialData?.id) {
      const { error } = await supabase
        .from("snippets")
        .update(payload)
        .eq("id", initialData.id);

      if (error) return alert(error.message);
    } else {
      const { error } = await supabase.from("snippets").insert(payload);
      if (error) return alert(error.message);
    }

    onSaved();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-xl border p-6 space-y-5"
    >
      <div>
        <label className="block text-sm font-medium text-primary-700">
          Title
        </label>
        <input
          {...register("title", { required: true })}
          className="mt-1 w-full border rounded-md px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-primary-700">
          Subtitle <span className="text-red-500">*</span>
        </label>
        <input
          {...register("subtitle", { required: "Subtitle is required" })}
          className="mt-1 w-full border rounded-md px-3 py-2"
        />
        {/* Show validation error for subtitle */}
        {errors.subtitle && (
          <span className="text-red-500 text-sm">
            {errors.subtitle.message}
          </span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-primary-700">
          Publish date (optional)
        </label>
        <input
          type="datetime-local"
          {...register("publish_date")}
          className="mt-1 w-full border rounded-md px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-primary-700">
          Content
        </label>
        <QuillEditor
          value={watch("content")}
          onChange={(html) => setValue("content", html)}
          placeholder="Write your snippet…"
          height={220}
        />
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={() => setShowMM(true)}
        className="w-full"
      >
        Insert Image
      </Button>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save Snippet"}
        </Button>
      </div>

      <ModalMediaManager
        isOpen={showMM}
        onClose={() => setShowMM(false)}
        onSelect={onSelectMedia}
        defaultFolder="uploads"
      />
    </form>
  );
};

export default SnippetForm;
