import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { CMSNewsArticle } from '../../types';
import Button from '../Button';
import MediaManager from './MediaManager';
import { Image, X, Eye, EyeOff, Calendar, Tag, FileText, Info } from 'lucide-react';

// Custom Quill toolbar with image handler
const imageHandler = function () {
  // @ts-ignore
  if (this.quill && window.openMediaManagerForQuill) {
    window.openMediaManagerForQuill(this.quill);
  }
};

const quillModules = {
  toolbar: {
    container: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['blockquote'],
      ['clean'],
    ],
    handlers: {
      image: imageHandler,
    },
  },
};

const quillFormats = [
  'header',
  'bold', 'italic', 'underline',
  'list', 'bullet',
  'link', 'image',
  'blockquote',
];

interface BlogPostFormProps {
  onSubmit: (data: Omit<CMSNewsArticle, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<CMSNewsArticle>;
}

const BlogPostForm: React.FC<BlogPostFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [showMediaManager, setShowMediaManager] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState(initialData?.image_url || '');
  const [previewMode, setPreviewMode] = useState(false);
  const [quillInstance, setQuillInstance] = useState<any>(null);

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      title: initialData?.title || '',
      summary: initialData?.summary || '',
      content: initialData?.content || '',
      image_url: initialData?.image_url || '',
      publish_date: initialData?.publish_date || new Date().toISOString().split('T')[0],
      is_members_only: initialData?.is_members_only || false,
      is_published: initialData?.is_published !== undefined ? initialData.is_published : false,
    },
  });

  const watchedContent = watch('content');
  const watchedTitle = watch('title');
  const watchedSummary = watch('summary');
  const watchedIsPublished = watch('is_published');

  // Hook MediaManager into Quill toolbar
  useEffect(() => {
    window.openMediaManagerForQuill = (editorInstance: any) => {
      setQuillInstance(editorInstance);
      setShowMediaManager(true);
    };
  }, []);

  const handleMediaSelect = (url: string) => {
    if (quillInstance) {
      const range = quillInstance.getSelection();
      if (range) {
        quillInstance.insertEmbed(range.index, 'image', url, 'user');
      }
    }
    setSelectedImageUrl(url);
    setValue('image_url', url, { shouldDirty: true });
    setShowMediaManager(false);
  };

  const handleClearImage = () => {
    setSelectedImageUrl('');
    setValue('image_url', '', { shouldDirty: true });
  };

  const handleFormSubmit = async (data: any) => {
    await onSubmit({
      ...data,
      image_url: selectedImageUrl || data.image_url,
    });
  };

  const renderPreview = () => (
    <div className="bg-white rounded-lg border border-neutral-200 p-6">
      <h2 className="text-2xl font-heading font-bold text-primary-600 mb-4">Blog Post Preview</h2>
      {selectedImageUrl && (
        <img
          src={selectedImageUrl}
          alt={watchedTitle || 'Blog post preview'}
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
      )}
      <h1 className="text-3xl font-heading font-bold text-primary-600 mb-4">
        {watchedTitle || 'Blog Post Title'}
      </h1>
      <div className="flex items-center space-x-4 text-sm text-neutral-500 mb-6">
        <span className="flex items-center">
          <Calendar size={16} className="mr-1" />
          {new Date().toLocaleDateString('en-GB')}
        </span>
        <span className="flex items-center">
          <Tag size={16} className="mr-1" />
          Blog Post
        </span>
      </div>
      <div className="bg-neutral-50 p-4 rounded-lg mb-6">
        <p className="text-lg font-medium text-neutral-700">
          {watchedSummary || 'Blog post summary will appear here...'}
        </p>
      </div>
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: watchedContent || '<p>Blog post content will appear here...</p>' }}
      />
    </div>
  );

  return (
    <>
      <div className="space-y-6">
        {/* Header with Preview Toggle */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-heading font-bold text-primary-600">
            {initialData ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h2>
          <div className="flex items-center space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center"
            >
              {previewMode ? <EyeOff size={16} className="mr-2" /> : <Eye size={16} className="mr-2" />}
              {previewMode ? 'Edit Mode' : 'Preview'}
            </Button>
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${watchedIsPublished ? 'text-green-600' : 'text-yellow-600'}`}>
                {watchedIsPublished ? 'Published' : 'Draft'}
              </span>
              <div className={`w-3 h-3 rounded-full ${watchedIsPublished ? 'bg-green-500' : 'bg-yellow-500'}`} />
            </div>
          </div>
        </div>

        {previewMode ? (
          renderPreview()
        ) : (
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold text-primary-600 mb-6 flex items-center">
                <FileText size={20} className="mr-2" />
                Basic Information
              </h3>
              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-primary-600 mb-2">
                    Blog Post Title *
                  </label>
                  <input
                    id="title"
                    {...register('title', { required: 'Title is required' })}
                    className="w-full px-4 py-3 text-lg border border-neutral-300 rounded-md focus:border-secondary-500 focus:ring-secondary-500"
                    placeholder="Enter an engaging title for your blog post"
                  />
                  {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message as string}</p>}
                </div>
                <div>
                  <label htmlFor="summary" className="block text-sm font-medium text-primary-600 mb-2">
                    Summary/Excerpt *
                  </label>
                  <textarea
                    id="summary"
                    {...register('summary', { required: 'Summary is required' })}
                    rows={3}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-md focus:border-secondary-500 focus:ring-secondary-500"
                    placeholder="Write a compelling summary..."
                  />
                  {errors.summary && <p className="mt-1 text-sm text-red-600">{errors.summary.message as string}</p>}
                </div>
              </div>
            </div>

            {/* Content with Rich Text Editor */}
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold text-primary-600 mb-6 flex items-center">
                Content
              </h3>
              <ReactQuill
                theme="snow"
                value={watchedContent}
                onChange={(value) => setValue('content', value, { shouldDirty: true })}
                placeholder="Write your blog post content here..."
                modules={quillModules}
                formats={quillFormats}
              />
              <p className="mt-2 text-xs text-neutral-500">
                {watchedContent?.replace(/<[^>]+>/g, '').length || 0} characters
              </p>
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700 flex items-start">
                <Info size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                <p>
                  <strong>Tips for Admins:</strong> Use <em>Headings</em> for structure, keep paragraphs short, and
                  insert images using the toolbar button (opens the Media Manager). Always write a clear summary for
                  better previews on the website and social media.
                </p>
              </div>
            </div>

            {/* Media Section */}
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold text-primary-600 mb-6 flex items-center">
                <Image size={20} className="mr-2" />
                Featured Image
              </h3>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <input
                    id="image_url"
                    type="url"
                    {...register('image_url')}
                    value={selectedImageUrl}
                    onChange={(e) => {
                      setSelectedImageUrl(e.target.value);
                      setValue('image_url', e.target.value, { shouldDirty: true });
                    }}
                    className="flex-1 px-4 py-3 border border-neutral-300 rounded-md focus:border-secondary-500 focus:ring-secondary-500"
                    placeholder="https://example.com/image.jpg or use Media Manager"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowMediaManager(true)}
                    className="flex items-center px-4"
                  >
                    <Image size={16} className="mr-2" />
                    Browse Media
                  </Button>
                  {selectedImageUrl && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClearImage}
                      className="flex items-center px-3 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                    >
                      <X size={16} />
                    </Button>
                  )}
                </div>
                {selectedImageUrl && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-neutral-700 mb-3">Featured Image Preview:</p>
                    <div className="relative inline-block">
                      <img
                        src={selectedImageUrl}
                        alt="Featured image preview"
                        className="w-full max-w-md h-48 object-cover rounded-lg border border-neutral-200"
                      />
                      <button
                        type="button"
                        onClick={handleClearImage}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                        title="Remove image"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Publishing Options */}
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold text-primary-600 mb-6 flex items-center">
                <Calendar size={20} className="mr-2" />
                Publishing Options
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="publish_date" className="block text-sm font-medium text-primary-600 mb-2">
                    Publish Date
                  </label>
                  <input
                    id="publish_date"
                    type="date"
                    {...register('publish_date', { required: 'Publish date is required' })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-md focus:border-secondary-500 focus:ring-secondary-500"
                  />
                  {errors.publish_date && <p className="mt-1 text-sm text-red-600">{errors.publish_date.message as string}</p>}
                </div>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id="is_published"
                      type="checkbox"
                      {...register('is_published')}
                      className="h-4 w-4 text-secondary-600 focus:ring-secondary-500 border-neutral-300 rounded"
                    />
                    <label htmlFor="is_published" className="ml-3 block text-sm font-medium text-neutral-700">
                      Publish immediately
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="is_members_only"
                      type="checkbox"
                      {...register('is_members_only')}
                      className="h-4 w-4 text-secondary-600 focus:ring-secondary-500 border-neutral-300 rounded"
                    />
                    <label htmlFor="is_members_only" className="ml-3 block text-sm font-medium text-neutral-700">
                      Members only content
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-between items-center pt-6 border-t border-neutral-200">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <div className="flex space-x-4">
                <Button
                  type="submit"
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={() => setValue('is_published', false)}
                >
                  {isSubmitting ? 'Saving...' : 'Save as Draft'}
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={() => setValue('is_published', true)}
                >
                  {isSubmitting ? 'Publishing...' : 'Publish Blog Post'}
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Media Manager Modal */}
      <MediaManager
        isOpen={showMediaManager}
        onClose={() => setShowMediaManager(false)}
        onSelectMedia={handleMediaSelect}
      />
    </>
  );
};

export default BlogPostForm;
