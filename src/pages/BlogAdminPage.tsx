// src/pages/BlogAdminPage.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase"; // ✅ corrected path
import LoadingSpinner from "../components/LoadingSpinner";
import Button from "../components/Button";

interface BlogPost {
  id: string;
  title: string;
  summary: string | null;
  content: string | null;
  category: string | null;
  tags: string[] | null;
  image_url: string | null;
  is_published: boolean;
  created_at: string | null;
}

const BlogAdminPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        setError("Failed to load blog posts.");
      } else {
        // ✅ normalize is_published
        const normalized: BlogPost[] = (data || []).map((post: any) => ({
          ...post,
          is_published: post.is_published ?? false,
        }));
        setPosts(normalized);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  if (loading) return <LoadingSpinner subtle={true} className="py-10" />;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="container mx-auto px-4 md:px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Blog Admin</h1>

      {posts.length === 0 ? (
        <p>No blog posts found.</p>
      ) : (
        <table className="min-w-full bg-white border border-neutral-200 rounded-lg shadow">
          <thead>
            <tr className="bg-neutral-100 text-left">
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Published</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post: BlogPost) => (
              <tr key={post.id} className="border-t border-neutral-200">
                <td className="px-4 py-2">{post.title}</td>
                <td className="px-4 py-2">{post.category ?? "—"}</td>
                <td className="px-4 py-2">
                  {post.is_published ? "✅ Yes" : "❌ No"}
                </td>
                <td className="px-4 py-2">
                  {post.created_at
                    ? new Date(post.created_at).toLocaleDateString("en-GB")
                    : "—"}
                </td>
                <td className="px-4 py-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => console.log("Edit", post.id)}
                  >
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BlogAdminPage;
