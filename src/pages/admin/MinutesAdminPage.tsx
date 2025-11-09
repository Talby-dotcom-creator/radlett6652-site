import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import Button from "../../components/Button";
import { Pencil, Trash2, Plus } from "lucide-react";
import MinutesForm from "../../components/cms/MinutesForm";

interface Minute {
  id: string;
  meeting_date: string;
  title: string;
  content: string;
  created_at: string | null;
  updated_at: string | null;
}

const MinutesAdminPage: React.FC = () => {
  const [rows, setRows] = useState<Minute[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Minute | null>(null);
  const [creating, setCreating] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("meeting_minutes")
      .select("*")
      .order("meeting_date", { ascending: false });

    if (error) console.error(error);
    setRows((data as Minute[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this meeting minute?")) return;

    const { error } = await supabase
      .from("meeting_minutes")
      .delete()
      .eq("id", id);

    if (error) alert(error.message);
    else load();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold text-primary-700">
          Meeting Minutes
        </h1>

        <Button onClick={() => setCreating(true)} className="flex items-center">
          <Plus className="w-4 h-4 mr-2" /> Add Minutes
        </Button>
      </div>

      {(creating || editing) && (
        <MinutesForm
          initialData={editing || undefined}
          onCancel={() => {
            setCreating(false);
            setEditing(null);
          }}
          onSaved={load}
        />
      )}

      {loading ? (
        <p>Loading…</p>
      ) : (
        <div className="overflow-auto rounded-lg border border-neutral-200">
          <table className="min-w-full text-sm">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-3 py-2">Meeting Date</th>
                <th className="px-3 py-2">Title</th>
                <th className="px-3 py-2">File</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-3 py-2">
                    {new Date(r.meeting_date).toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-3 py-2">{r.title}</td>
                  <td className="px-3 py-2">
                    {r.content ? (
                      <a
                        href={r.content}
                        target="_blank"
                        rel="noopener"
                        className="text-blue-600 underline"
                      >
                        View
                      </a>
                    ) : (
                      "—"
                    )}
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
                        className="text-red-600 border-red-200"
                        onClick={() => handleDelete(r.id)}
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

export default MinutesAdminPage;
