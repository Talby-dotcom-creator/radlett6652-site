import React, { useEffect, useState } from "react";
import Button from "../Button";
import { useForm } from "react-hook-form";
import { supabase } from "../../lib/supabase";
import QuillEditor from "../QuillEditor";
import MediaManagerModal from "../media/MediaManagerModal";
import { Image, X } from "lucide-react";

// Slug generator (clean, lowercase, hyphens)
function makeSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type FormVals = {
  title: string;
  summary: string;
  content: string;
  image_url: string;
  publish_date: string; // datetime-local
  author: string;
  subcategory: string;
  reading_time_minutes: number | undefined;
  featured: boolean;
  is_published: boolean;
  slug: string;
};

interface Props {
  initialData?: any;
  onCancel: () => void;
  onSaved: () => void;
}

const PillarPostForm: React.FC<Props> = ({
  initialData,
  onCancel,
  onSaved,
}) => {
  const [showMM, setShowMM] = useState(false);
  const [img, setImg] = useState<string>(initialData?.image_url || "");

  // Pillar categories (must match blog_subcategory_enum in database)
  const categories = [
    { slug: "For Those Seeking", label: "seekers" },
    { slug: "History & Heritage", label: "history" },
    { slug: "Member Stories", label: "stories" },
    { slug: "Philosophy & Thought", label: "philosophy" },
    { slug: "Community & Service", label: "community" },
  ];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormVals>({
    defaultValues: {
      title: initialData?.title || "",
      summary: initialData?.summary || "",
      content: initialData?.content || "",
      image_url: initialData?.image_url || "",
      publish_date: initialData?.publish_date
        ? new Date(initialData.publish_date).toISOString().slice(0, 16)
        : "",
      author: initialData?.author || "Radlett Lodge",
      subcategory: initialData?.subcategory || "",
      reading_time_minutes: initialData?.reading_time_minutes ?? undefined,
      featured: Boolean(initialData?.featured),
      is_published: Boolean(initialData?.is_published ?? true),
      slug: initialData?.slug || "",
    },
  });

  // ✅ Auto-generate slug when typing title (only if slug was empty or untouched)
  const title = watch("title");
  const slug = watch("slug");

  useEffect(() => {
    if (!initialData?.slug) {
      const newSlug = makeSlug(title || "");
      setValue("slug", newSlug, { shouldDirty: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);

  const onSelectMedia = (url: string) => {
    setImg(url);
    setValue("image_url", url, { shouldDirty: true });
    setShowMM(false);
  };

  const onSubmit = async (vals: FormVals) => {
    // ✅ Ensure slug is present
    const finalSlug = makeSlug(vals.slug || vals.title || "");
    if (!finalSlug) return alert("Slug could not be generated.");

    // ✅ Check for duplicates
    const { data: existing, error: slugErr } = await supabase
      .from("blog_posts")
      .select("id")
      .eq("slug", finalSlug);

    if (slugErr) return alert(slugErr.message);

    // If creating a new article OR slug belongs to a different article
    if (existing && existing.length > 0 && existing[0].id !== initialData?.id) {
      return alert("This slug already exists. Please edit it.");
    }

    const payload = {
      ...vals,
      slug: finalSlug,
      category: "blog" as const,
      publish_date: vals.publish_date
        ? new Date(vals.publish_date).toISOString()
        : null,
      image_url: img || null,
    };

    if (initialData?.id) {
      const { error } = await supabase
        .from("blog_posts")
        .update(payload as any)
        .eq("id", initialData.id);

      if (error) return alert(error.message);
    } else {
      const { error } = await supabase
        .from("blog_posts")
        .insert(payload as any);
      if (error) return alert(error.message);
    }

    onSaved();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-xl border p-4 md:p-6 space-y-5"
    >
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-primary-700">
            Title
          </label>
          <input
            {...register("title", { required: "Title is required" })}
            className="mt-1 w-full border rounded-md px-3 py-2"
          />
          {errors.title && (
            <p className="text-red-600 text-sm mt-1">
              {errors.title.message as string}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-primary-700">
            Slug
          </label>
          <input
            {...register("slug")}
            placeholder="optional-url-slug"
            className="mt-1 w-full border rounded-md px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-primary-700">
          Summary
        </label>
        <textarea
          {...register("summary")}
          rows={3}
          className="mt-1 w-full border rounded-md px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-primary-700">
          Content
        </label>
        <QuillEditor
          value={watch("content")}
          onChange={(html: string) =>
            setValue("content", html, { shouldDirty: true })
          }
          placeholder="Write your article…"
          showSnippets={true}
        />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-primary-700">
            Author
          </label>
          <input
            {...register("author")}
            className="mt-1 w-full border rounded-md px-3 py-2"
            placeholder="Radlett Lodge"
          />
        </div>
        {/* Category Dropdown */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Category
          </label>
          <select
            {...register("subcategory", { required: true })}
            className="w-full px-3 py-2 border rounded-md bg-white text-neutral-700 focus:ring-secondary-500 focus:border-secondary-500"
          >
            <option value="">Select a category…</option>
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-primary-700">
            Reading time (min)
          </label>
          <input
            type="number"
            min={1}
            {...register("reading_time_minutes", { valueAsNumber: true })}
            className="mt-1 w-full border rounded-md px-3 py-2"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-primary-700">
            Publish date
          </label>
          <input
            type="datetime-local"
            {...register("publish_date")}
            className="mt-1 w-full border rounded-md px-3 py-2"
          />
        </div>
        <div className="flex flex-col gap-2 mt-6">
          <label className="text-sm flex items-center">
            <input type="checkbox" {...register("featured")} className="mr-2" />
            <span>
              <strong>Featured</strong> - Highlight this article on the homepage
            </span>
          </label>
          <label className="text-sm flex items-center">
            <input
              type="checkbox"
              {...register("is_published")}
              className="mr-2"
            />
            <span>
              <strong>Published</strong> - Make this article visible to visitors
            </span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-primary-700">
          Featured image
        </label>
        <div className="flex items-center gap-2 mt-1">
          <input
            {...register("image_url")}
            value={img}
            onChange={(e) => setImg(e.target.value)}
            placeholder="https://… or pick from Media"
            className="flex-1 border rounded-md px-3 py-2"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowMM(true)}
            className="flex items-center"
          >
            <Image className="w-4 h-4 mr-1" /> Browse
          </Button>
          {img && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setImg("")}
              className="text-red-600 border-red-200 hover:border-red-300"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        {img && (
          <div className="mt-3">
            <img src={img} className="w-56 h-36 object-cover rounded border" />
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save"}
        </Button>
      </div>

      {/* ✅ Locked to blog-images */}
      <MediaManagerModal
        isOpen={showMM}
        onClose={() => setShowMM(false)}
        onSelect={onSelectMedia}
        defaultFolder="blog-images"
      />
    </form>
  );
};

export default PillarPostForm;
