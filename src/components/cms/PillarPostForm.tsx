import React, { useEffect, useState } from "react";
import Button from "../Button";
import { useForm } from "react-hook-form";
import { supabase } from "../../lib/supabase";
import QuillEditor from "../QuillEditor";
import MediaManagerModal from "../media/MediaManagerModal";
import { Image, X } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Slug generator (clean, lowercase, hyphens)
function makeSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type FormVals = {
  title: string;
  summary: string; // merged excerpt + meta preview text
  seo_description?: string;
  content: string;
  image_url: string;
  publish_date: string; // stored as ISO string
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

  // Subcategories – MUST match actual DB values in blog_posts.subcategory
  const categories = [
    { label: "For Those Seeking", value: "For Those Seeking" },
    { label: "History & Heritage", value: "History & Heritage" },
    { label: "Member Stories", value: "Member Stories" },
    { label: "Philosophy & Thought", value: "Philosophy & Thought" },
    { label: "Community & Service", value: "Community & Service" },
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
      seo_description: initialData?.seo_description || "",
      content: initialData?.content || "",
      image_url: initialData?.image_url || "",
      // keep whatever is in DB; DatePicker will parse it
      publish_date: initialData?.publish_date || "",
      author: initialData?.author || "Radlett Lodge",
      subcategory: initialData?.subcategory || "",
      reading_time_minutes: initialData?.reading_time_minutes ?? undefined,
      featured: Boolean(initialData?.featured),
      is_published: Boolean(initialData?.is_published ?? true),
      slug: initialData?.slug || "",
    },
  });

  const title = watch("title");
  const slug = watch("slug");
  const publishDate = watch("publish_date");
  const isPublished = watch("is_published");

  // Auto-generate slug when typing title
  useEffect(() => {
    if (!initialData?.slug) {
      const newSlug = makeSlug(title || "");
      setValue("slug", newSlug, { shouldDirty: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);

  // SEO Score (0–3)
  const calculateSeoScore = () => {
    const t = watch("title") || "";
    const d = watch("seo_description") || watch("summary") || "";
    const c = watch("content") || "";

    let score = 0;
    if (t.length > 20 && t.length < 70) score++;
    if (d.length > 50 && d.length < 160) score++;
    if (c.replace(/<[^>]+>/g, "").length > 300) score++;

    return score;
  };

  const onSelectMedia = (url: string) => {
    setImg(url);
    setValue("image_url", url, { shouldDirty: true });
    setShowMM(false);
  };

  const onSubmit = async (vals: FormVals) => {
    const finalSlug = makeSlug(vals.slug || vals.title || "");
    if (!finalSlug) return alert("Slug could not be generated.");

    // Check duplicate slug
    const { data: existing, error: slugError } = await supabase
      .from("blog_posts")
      .select("id")
      .eq("slug", finalSlug);

    if (slugError) return alert(slugError.message);

    if (existing && existing.length > 0 && existing[0].id !== initialData?.id) {
      return alert("This slug already exists.");
    }

    const payload = {
      ...vals,
      slug: finalSlug,
      category: "blog" as const,
      seo_description: vals.seo_description || vals.summary || "",
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

  // Helper: turn ISO string into Date for DatePicker
  const getPublishDateAsDate = () => {
    if (!publishDate) return null;
    const d = new Date(publishDate);
    return isNaN(d.getTime()) ? null : d;
  };

  // Friendly human preview of publish date
  const publishDatePreview = publishDate
    ? new Date(publishDate).toLocaleString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Not scheduled yet";

  // Publish immediately: now + set is_published true
  const handlePublishNow = () => {
    const now = new Date();
    setValue("publish_date", now.toISOString(), { shouldDirty: true });
    setValue("is_published", true, { shouldDirty: true });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-xl border p-4 md:p-6 space-y-6"
    >
      {/* TITLE + SLUG */}
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
            <p className="text-xs text-red-600 mt-1">
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
            className="mt-1 w-full border rounded-md px-3 py-2"
          />
        </div>
      </div>

      {/* SUMMARY */}
      <div>
        <label className="block text-sm font-medium text-primary-700">
          Summary (also used as excerpt)
        </label>
        <textarea
          {...register("summary")}
          rows={3}
          className="mt-1 w-full border rounded-md px-3 py-2"
        />
      </div>

      {/* SEO DESCRIPTION FIELD */}
      <div>
        <label className="block text-sm font-medium text-primary-700">
          SEO Description (optional)
        </label>
        <textarea
          {...register("seo_description")}
          rows={3}
          placeholder="Google search result description…"
          className="mt-1 w-full border rounded-md px-3 py-2"
        />
      </div>

      {/* SEO PREVIEW PANEL */}
      <div className="mt-2 p-4 border rounded-md bg-gray-50">
        <h3 className="text-md font-semibold mb-2">SEO Preview</h3>
        <div className="bg-white p-4 rounded-md shadow-sm border">
          <p className="text-sm text-blue-700 font-medium">
            radlettlodge.org.uk/pillars/{slug || "your-post-slug"}
          </p>

          <p className="text-lg text-blue-800 font-bold mt-1">
            {title || "Post Title Preview"}
          </p>

          <p className="text-sm text-gray-700 mt-1">
            {watch("seo_description")?.length
              ? watch("seo_description")
              : watch("summary") || "Meta description will appear here…"}
          </p>

          {/* SEO SCORE DOT */}
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm font-medium">SEO Score:</span>
            <div
              className={`w-3 h-3 rounded-full ${
                calculateSeoScore() === 3
                  ? "bg-green-500"
                  : calculateSeoScore() === 2
                  ? "bg-yellow-400"
                  : "bg-red-500"
              }`}
            />
            <span className="text-sm">{calculateSeoScore()} / 3</span>
          </div>
        </div>
      </div>

      {/* CONTENT */}
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

      {/* META (AUTHOR / SUBCATEGORY / READING TIME) */}
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-primary-700">
            Author
          </label>
          <input
            {...register("author")}
            className="mt-1 w-full border rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Category
          </label>
          <select
            {...register("subcategory", { required: true })}
            className="w-full px-3 py-2 border rounded-md bg-white"
          >
            <option value="">Select…</option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
          {errors.subcategory && (
            <p className="text-xs text-red-600 mt-1">
              Please choose a category.
            </p>
          )}
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

      {/* PUBLISH OPTIONS */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Date picker */}
        <div>
          <label className="block text-sm font-medium text-primary-700">
            Publish date
          </label>
          <DatePicker
            selected={getPublishDateAsDate()}
            onChange={(date: Date | null) => {
              if (date) {
                setValue("publish_date", date.toISOString(), {
                  shouldDirty: true,
                });
              } else {
                setValue("publish_date", "", { shouldDirty: true });
              }
            }}
            showTimeSelect
            timeIntervals={15}
            dateFormat="dd/MM/yyyy HH:mm"
            placeholderText="Select publish date…"
            className="mt-1 w-full border rounded-md px-3 py-2"
          />
          <p className="text-xs text-neutral-600 mt-1">
            Publishing on: <strong>{publishDatePreview}</strong>
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-2 text-xs"
            onClick={handlePublishNow}
          >
            Publish immediately (set to now)
          </Button>
        </div>

        {/* Featured / Published */}
        <div className="flex flex-col gap-2 mt-6">
          <label className="text-sm flex items-center">
            <input type="checkbox" {...register("featured")} className="mr-2" />
            <span>
              <strong>Featured</strong> – highlight on homepage
            </span>
          </label>

          <label className="text-sm flex items-center">
            <input
              type="checkbox"
              {...register("is_published")}
              className="mr-2"
            />
            <span>
              <strong>Published</strong> – visible on website (
              {isPublished ? "Yes" : "No"})
            </span>
          </label>
        </div>
      </div>

      {/* FEATURED IMAGE */}
      <div>
        <label className="block text-sm font-medium text-primary-700">
          Featured image
        </label>
        <div className="flex items-center gap-2 mt-1">
          <input
            {...register("image_url")}
            value={img}
            onChange={(e) => setImg(e.target.value)}
            className="flex-1 border rounded-md px-3 py-2"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowMM(true)}
          >
            <Image className="w-4 h-4 mr-1" /> Browse
          </Button>
          {img && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setImg("")}
              className="text-red-600 border-red-200"
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

      {/* BUTTONS */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save"}
        </Button>
      </div>

      {/* MEDIA MANAGER */}
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
