// src/pages/admin/SnippetsAdminPage.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import Button from "../../components/Button";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Pencil, Trash2, Plus, Star } from "lucide-react";
import SnippetForm from "../../components/cms/SnippetForm";

export interface Snippet {
  id: string;
  title: string;
  subtitle: string | null;
  content: string;
  publish_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const SnippetsAdminPage: React.FC = () => {
  const [rows, setRows] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Snippet | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("snippets")
      .select("*")
      .order("publish_date", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) setError(error.message);

    setRows((data as Snippet[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this snippet?")) return;
    const { error } = await supabase.from("snippets").delete().eq("id", id);
    if (error) return alert(error.message);
    await load();
  };

  const activateSnippet = async (id: string) => {
    const { error } = await supabase.rpc("snippet_activate_one", {
      p_id: id,
    });
    if (error) return alert(error.message);
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
        <h1 className="text-2xl font-semibold text-primary-700">
          Snippet Manager
        </h1>
        <Button onClick={() => setCreating(true)} className="flex items-center">
          <Plus className="w-4 h-4 mr-2" /> New Snippet
        </Button>
      </div>

      {(creating || editing) && (
        <div className="mb-6">
          <SnippetForm
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
        <p className="text-neutral-600">No snippets available.</p>
      ) : (
        <div className="overflow-auto rounded-lg border border-neutral-200">
          <table className="min-w-full text-sm">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-3 py-2 text-left w-10">★</th>
                <th className="px-3 py-2 text-left">Title</th>
                <th className="px-3 py-2 text-left w-40">Publish Date</th>
                <th className="px-3 py-2 text-left w-40">Updated</th>
                <th className="px-3 py-2 text-left w-44">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-3 py-2">
                    {r.is_active ? (
                      <Star className="w-4 h-4 text-amber-500" />
                    ) : (
                      <span className="text-neutral-300">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2">{r.title}</td>
                  <td className="px-3 py-2">
                    {r.publish_date
                      ? new Date(r.publish_date).toLocaleDateString("en-GB")
                      : "—"}
                  </td>
                  <td className="px-3 py-2">
                    {new Date(r.updated_at).toLocaleString()}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditing(r)}
                      >
                        <Pencil className="w-4 h-4 mr-1" /> Edit
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => activateSnippet(r.id)}
                        className="text-amber-600 border-amber-300 hover:border-amber-400"
                      >
                        <Star className="w-4 h-4 mr-1" /> Activate
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(r.id)}
                        className="text-red-600 border-red-200 hover:border-red-300"
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

export default SnippetsAdminPage;
