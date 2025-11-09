import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import QuillEditor from "../components/QuillEditor";
import { CMSBlogPost } from "../types";

const BlogAdminPage: React.FC = () => {
  // ...existing code...
  // supabase client is now a singleton imported above
  const [posts, setPosts] = useState<CMSBlogPost[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    summary: "",
    content: "",
    category: "news",
    author: "",
    is_published: true,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Load all posts on mount
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    setMessage("");
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("publish_date", { ascending: false });
    if (error) {
      console.error("Error loading posts:", error.message);
      setMessage("Error loading posts.");
    } else {
      // Map posts to CMSBlogPost shape and fix types
      const posts: CMSBlogPost[] = (data ?? []).map((post: any) => ({
        id: post.id,
        title: post.title ?? "",
        content: post.content ?? "",
        summary: post.summary ?? "",
        category:
          post.category === "news" ||
          post.category === "blog" ||
          post.category === "snippet"
            ? post.category
            : "news",
        author: post.author ?? "",
        image_url: post.image_url ?? null,
        featured: !!post.featured,
        publish_date: post.publish_date ?? "",
        is_published: !!post.is_published,
        is_members_only: !!post.is_members_only,
        view_count: post.view_count ?? 0,
        created_at: post.created_at ?? "",
        updated_at: post.updated_at ?? "",
      }));
      setPosts(posts);
    }
    setLoading(false);
  };

  // ✅ Handle form changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  // ✅ Save or update post
  const handleSave = async () => {
    if (!form.title || !form.content) {
      setMessage("Please fill in Title and Content.");
      return;
    }

    setLoading(true);
    setMessage("");
    const payload = {
      title: form.title,
      summary: form.summary, // keep for type compatibility, even if not in DB
      content: form.content,
      category: form.category,
      author: form.author || "W. Bro. Reflections Editor",
      is_published: form.is_published,
      publish_date: editingId ? undefined : new Date().toISOString(),
    };

    let error;
    if (editingId) {
      // Don't update publish_date on edit
      const { error: updateError } = await supabase
        .from("blog_posts")
        .update({ ...payload, publish_date: undefined })
        .eq("id", editingId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from("blog_posts")
        .insert([{ ...payload }]);
      error = insertError;
    }

    setLoading(false);
    if (error) {
      console.error(error.message);
      setMessage("Error saving post.");
    } else {
      setMessage("Post saved successfully!");
      resetForm();
      loadPosts();
    }
  };

  // ✅ Edit existing post
  const handleEdit = (post: CMSBlogPost) => {
    setEditingId(post.id);
    setForm({
      title: post.title || "",
      summary: (post as any).summary || "",
      content: post.content || "",
      category: post.category || "news",
      author: post.author || "",
      is_published: post.is_published ?? true,
    });
  };

  // ✅ Delete post
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) {
      console.error(error.message);
      setMessage("Error deleting post.");
    } else {
      setMessage("Post deleted.");
      loadPosts();
    }
  };

  // ✅ Reset form
  const resetForm = () => {
    setEditingId(null);
    setForm({
      title: "",
      summary: "",
      content: "",
      category: "news",
      author: "",
      is_published: true,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-heading font-bold mb-6 text-primary-800">
        CMS Blog / Reflections Admin
      </h1>

      {message && <div className="mb-4 text-sm text-green-700">{message}</div>}

      <div className="bg-white shadow-md rounded-xl p-6 mb-10 border border-neutral-200">
        <div className="grid gap-4 mb-4">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            className="border rounded-lg p-2"
            disabled={loading}
          />
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="border rounded-lg p-2"
            disabled={loading}
          >
            <option value="news">News</option>
            <option value="event">Event</option>
            <option value="snippet">Reflections in Stone (Snippet)</option>
          </select>
          <input
            name="author"
            value={form.author}
            onChange={handleChange}
            placeholder="Author"
            className="border rounded-lg p-2"
            disabled={loading}
          />

          <QuillEditor
            value={form.content}
            onChange={(html: string) =>
              setForm((s) => ({ ...s, content: html }))
            }
            placeholder="Write your article…"
          />

          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
            >
              {editingId ? "Update" : "Create"} Post
            </button>
            <button
              onClick={resetForm}
              disabled={loading}
              className="bg-neutral-100 text-neutral-800 px-4 py-2 rounded-lg hover:bg-neutral-200"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Existing Posts</h2>
      {loading ? (
        <p>Loading…</p>
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="border rounded-lg p-4 bg-neutral-50 flex flex-col md:flex-row md:justify-between md:items-start gap-2"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-primary-700 truncate">
                  {post.title}
                </h3>
                <p className="text-sm text-neutral-600 mb-1">
                  {post.category === "snippet"
                    ? "🪨 Reflections in Stone"
                    : post.category}
                </p>
                {/* No summary field in CMSBlogPost, so nothing to show here */}
                {post.publish_date && (
                  <p className="text-xs text-neutral-400">
                    Published:{" "}
                    {new Date(post.publish_date).toLocaleDateString("en-GB")}
                  </p>
                )}
              </div>
              <div className="flex gap-3 mt-2 md:mt-0">
                <button
                  onClick={() => handleEdit(post)}
                  className="text-blue-600 hover:underline"
                  disabled={loading}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="text-red-600 hover:underline"
                  disabled={loading}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogAdminPage;
