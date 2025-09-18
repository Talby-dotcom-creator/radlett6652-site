// src/components/cms/BlogForm.tsx
import React, { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import RichTextEditor from '../RichTextEditor' // ✅ use your existing Tiptap editor

export type BlogFormValues = {
  id?: string
  title: string
  slug: string
  excerpt: string
  content: string
  category?: string
  tags: string[]
  coverImageUrl?: string
  published: boolean
}

type BlogFormProps = {
  defaultValues?: Partial<BlogFormValues>
  onSubmit: (values: BlogFormValues) => Promise<void> | void
  onCancel?: () => void
  submitLabel?: string
  isSubmitting?: boolean
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export default function BlogForm({
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel = 'Save',
  isSubmitting = false,
}: BlogFormProps) {
  const initialValues: BlogFormValues = useMemo(
    () => ({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: '',
      tags: [],
      coverImageUrl: '',
      published: false,
      ...defaultValues,
    }),
    [defaultValues]
  )

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { errors, isDirty },
  } = useForm<BlogFormValues>({
    defaultValues: initialValues,
    mode: 'onBlur',
  })

  const title = watch('title')
  const slug = watch('slug')

  // auto-generate slug from title
  useEffect(() => {
    if (!title) return
    const auto = slugify(title)
    if (!slug || slugify(slug) === slugify(initialValues.title ?? '')) {
      setValue('slug', auto, { shouldDirty: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title])

  // tags as CSV input
  const tagsCsv = (watch('tags') || []).join(', ')
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const arr = e.target.value
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
    setValue('tags', arr, { shouldDirty: true })
  }

  const onFormSubmit = (values: BlogFormValues) => {
    const payload: BlogFormValues = {
      ...values,
      slug: values.slug?.trim() ? slugify(values.slug) : slugify(values.title ?? ''),
      content: values.content || '<p></p>',
      tags: Array.isArray(values.tags) ? values.tags : [],
    }
    return onSubmit(payload)
  }

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="space-y-6 max-w-3xl mx-auto"
    >
      {/* Title */}
      <div>
        <label className="block text-sm font-medium mb-1">Title *</label>
        <input
          className="w-full rounded-xl border px-3 py-2"
          placeholder="e.g. Our Installation Night"
          {...register('title', { required: 'Title is required' })}
        />
        {errors.title && (
          <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-medium mb-1">Slug</label>
        <input
          className="w-full rounded-xl border px-3 py-2"
          placeholder="our-installation-night"
          {...register('slug')}
        />
        <p className="text-xs text-gray-500 mt-1">
          Example: <code>/news/{slug || slugify(title || 'post')}</code>
        </p>
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-sm font-medium mb-1">Excerpt *</label>
        <textarea
          className="w-full rounded-xl border px-3 py-2 min-h-[80px]"
          placeholder="Short summary shown in lists…"
          {...register('excerpt', {
            required: 'Excerpt is required',
            minLength: { value: 10, message: 'At least 10 characters' },
          })}
        />
        {errors.excerpt && (
          <p className="text-sm text-red-600 mt-1">{errors.excerpt.message}</p>
        )}
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium mb-1">Content *</label>
        <RichTextEditor
          value={getValues('content') || ''}
          onChange={(html) => setValue('content', html, { shouldDirty: true })}
          placeholder="Write your post…"
        />
        {errors.content && (
          <p className="text-sm text-red-600 mt-1">{errors.content.message}</p>
        )}
      </div>

      {/* Category & Cover Image */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <input
            className="w-full rounded-xl border px-3 py-2"
            placeholder="e.g. Lodge News"
            {...register('category')}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Cover Image URL</label>
          <input
            className="w-full rounded-xl border px-3 py-2"
            placeholder="https://…/image.jpg"
            {...register('coverImageUrl')}
          />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Tags (comma-separated)
        </label>
        <input
          className="w-full rounded-xl border px-3 py-2"
          placeholder="installation, charity, events"
          value={tagsCsv}
          onChange={handleTagsChange}
        />
      </div>

      {/* Published toggle */}
      <div className="flex items-center gap-3">
        <input
          id="published"
          type="checkbox"
          className="h-4 w-4"
          {...register('published')}
        />
        <label htmlFor="published" className="text-sm select-none">
          Published
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-2xl px-4 py-2 border bg-black text-white disabled:opacity-60"
        >
          {isSubmitting ? 'Saving…' : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-2xl px-4 py-2 border"
          >
            Cancel
          </button>
        )}
        {!isDirty && <span className="text-xs text-gray-500">No changes</span>}
      </div>
    </form>
  )
}
