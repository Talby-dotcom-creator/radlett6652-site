import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../Button";
import MediaManagerModal from "../media/MediaManagerModal";
import { supabase } from "../../lib/supabase";

interface FormValues {
  title: string;
  meeting_date: string;
  content: string;
}

interface Props {
  initialData?: any;
  onCancel: () => void;
  onSaved: () => void;
}

export default function MinutesForm({ initialData, onCancel, onSaved }: Props) {
  const [showMM, setShowMM] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      title: initialData?.title || "",
      meeting_date: initialData?.meeting_date || "",
      content: initialData?.content || "",
    },
  });

  const url = watch("content");

  const onSubmit = async (vals: FormValues) => {
    const payload = {
      ...vals,
      updated_at: new Date().toISOString(),
    };

    let error;

    if (initialData) {
      ({ error } = await supabase
        .from("meeting_minutes")
        .update(payload)
        .eq("id", initialData.id));
    } else {
      ({ error } = await supabase.from("meeting_minutes").insert(payload));
    }

    if (error) return alert(error.message);
    onSaved();
    onCancel();
  };

  return (
    <div className="mb-6 p-4 border rounded-xl bg-neutral-50">
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="block text-sm font-medium">Meeting Date</label>
          <input
            type="date"
            {...register("meeting_date", { required: true })}
            className="mt-1 w-full border rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            {...register("title", { required: true })}
            className="mt-1 w-full border rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">File</label>
          <div className="flex gap-2">
            <input
              {...register("content")}
              value={url}
              onChange={(e) => setValue("content", e.target.value)}
              className="flex-1 border rounded-md px-3 py-2"
            />
            <Button type="button" onClick={() => setShowMM(true)}>
              Browse
            </Button>
          </div>

          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener"
              className="block mt-2 text-sm text-blue-600 underline"
            >
              View current file
            </a>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Save
          </Button>
        </div>
      </form>

      <MediaManagerModal
        isOpen={showMM}
        onClose={() => setShowMM(false)}
        onSelect={(url) => {
          setValue("content", url);
          setShowMM(false);
        }}
        defaultFolder="documents"
      />
    </div>
  );
}
