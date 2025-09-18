// src/pages/BlogAdminPage.tsx

import React, { useEffect, useState } from 'react';
import { CMSBlogPost } from '../types';             // ✅ adjust to ../../types if nested deeper
import Button from '../components/Button';         // ✅ adjust to ../../components/Button if nested deeper
import { optimizedApi } from '../lib/optimizedApi';
import BlogPostForm from '../components/cms/BlogPostForm';
import { PlusCircle, Edit3 } from 'lucide-react';

const BlogAdminPage: React.FC = () => {
  const [posts, setPosts] = useState<CMSBlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingPost, setEditingPost] = useState<CMSBlogPost | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);

  // Load posts on mount
  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        const data = await optimizedApi.getNewsArticles(); // ✅ uses your lib
        setPosts(data);
      } catch (err) {
        console.error('Error loading posts:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const handleCreateNew = () => {
    setEditingPost(null);
    setShowForm(true);
  };

  const handleEdit = (post: CMSBlogPost) => {
    setEditingPost(post);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingPost(null);
    setShowForm(false);
  };

  const handleSubmit = async (data: Omit<CMSBlogPost, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (editingPost) {
        await optimizedApi.updateBlogPost(editingPost.id, data);
      } else {
        await optimizedApi.createBlogPost(data);
      }

      // reload posts after saving
      const updated = await optimizedApi.getNewsArticles();
      setPosts(updated);

      setShowForm(false);
      setEditingPost(null);
    } catch (err) {
      console.error('Error saving blog post:', err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold text-primary-600">Blog / News Admin</h1>
        <Button variant="primary" onClick={handleCreateNew} className="flex items-center">
          <PlusCircle size={18} className="mr-2" />
          New Post
        </Button>
      </div>

      {showForm ? (
        <BlogPostForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          initialData={editingPost || undefined}
        />
      ) : (
        <>
          {loading ? (
            <p className="text-neutral-500">Loading posts...</p>
          ) : posts.length === 0 ? (
            <p className="text-neutral-500">No posts yet. Click "New Post" to add one.</p>
          ) : (
            <div className="space-y-4">
              {posts.map((t: CMSBlogPost) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between bg-white border border-neutral-200 rounded-lg p-4 shadow-sm"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-primary-600">{t.title}</h2>
                    <p className="text-sm text-neutral-500">{t.summary || 'No summary provided.'}</p>
                    <p className="text-xs text-neutral-400">
                      {t.is_published ? 'Published' : 'Draft'} ·{' '}
                      {new Date(t.publish_date).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(t)}
                    className="flex items-center"
                  >
                    <Edit3 size={16} className="mr-2" />
                    Edit
                  </Button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BlogAdminPage;
