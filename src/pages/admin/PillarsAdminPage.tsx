import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import Button from "../../components/Button";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Pencil, Trash2, Plus, Star } from "lucide-react";
import PillarPostForm from "../../components/cms/PillarPostForm";

type BlogPost = {
  id: string;
  title: string | null;
  summary: string | null;
  content: string | null;
  image_url: string | null;
  publish_date: string | null;
  author_name: string | null;
  category: string | null;
  subcategory: string | null;
  reading_time_minutes: number | null;
  featured: boolean | null;
  is_published: boolean | null;
  slug: string | null;
  created_at?: string;
};

const PillarsAdminPage: React.FC = () => {
  const [rows, setRows] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("category", "blog")
      .order("publish_date", { ascending: false });
    if (error) setError(error.message);
    setRows((data as unknown as BlogPost[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this article?")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) {
      alert(error.message);
      return;
    }
    await load();
  };

  const handleSaved = async () => {
    setCreating(false);
    setEditing(null);
    await load();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-primary-700">The Pillars</h1>
        <Button onClick={() => setCreating(true)} className="flex items-center">
          <Plus className="w-4 h-4 mr-2" /> New Article
        </Button>
      </div>

      {(creating || editing) && (
        <div className="mb-6">
          <PillarPostForm
            initialData={editing || undefined}
            onCancel={() => {
              setCreating(false);
              setEditing(null);
            }}
            onSaved={handleSaved}
          />
        </div>
      )}

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {loading ? (
        <LoadingSpinner />
      ) : rows.length === 0 ? (
        <p className="text-neutral-600">No articles yet.</p>
      ) : (
        <div className="overflow-auto rounded-lg border border-neutral-200">
          <table className="min-w-full text-sm">
            <thead className="bg-neutral-50">
              <tr>
                <th className="text-left px-3 py-2 w-10">★</th>
                <th className="text-left px-3 py-2">Title</th>
                <th className="text-left px-3 py-2">Subcategory</th>
                <th className="text-left px-3 py-2">Author</th>
                <th className="text-left px-3 py-2">Publish date</th>
                <th className="text-left px-3 py-2">Published?</th>
                <th className="text-left px-3 py-2 w-44">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-3 py-2">
                    {r.featured ? (
                      <Star className="w-4 h-4 text-amber-500" />
                    ) : (
                      <span className="text-neutral-300">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2">{r.title || "Untitled"}</td>
                  <td className="px-3 py-2">{r.subcategory || "—"}</td>
                  <td className="px-3 py-2">{r.author_name || "—"}</td>
                  <td className="px-3 py-2">
                    {r.publish_date
                      ? new Date(r.publish_date).toLocaleString()
                      : "—"}
                  </td>
                  <td className="px-3 py-2">{r.is_published ? "Yes" : "No"}</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditing(r)}
                        className="flex items-center"
                      >
                        <Pencil className="w-4 h-4 mr-1" /> Edit
                      </Button>

                      {/* View on public page */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open(
                            `/blog/${r.slug || r.id}`,
                            "_blank",
                            "noopener"
                          )
                        }
                        className="flex items-center"
                      >
                        View
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(r.id)}
                        className="flex items-center text-red-600 border-red-200 hover:border-red-300"
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PillarsAdminPage;
