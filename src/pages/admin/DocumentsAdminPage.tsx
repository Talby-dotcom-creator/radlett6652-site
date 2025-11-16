import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import Button from "../../components/Button";
import { Pencil, Trash2, Plus, ExternalLink } from "lucide-react";
import DocumentForm from "../../components/cms/DocumentForm";

interface Document {
  id: string;
  title: string;
  description?: string | null;
  url: string;
  category?: string;
  created_at: string | null;
  updated_at: string | null;
}

const DocumentsAdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Document | null>(null);
  const [creating, setCreating] = useState(false);
  const [sortMode, setSortMode] = useState<"date" | "category">("date");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("lodge_documents")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (err) {
      console.error("Error loading documents:", err);
      alert("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const sortedDocuments = useMemo(() => {
    const arr = [...documents];
    if (sortMode === "category") {
      arr.sort((a, b) => {
        const ca = (a.category || "").toLowerCase();
        const cb = (b.category || "").toLowerCase();
        if (ca !== cb) return ca.localeCompare(cb, "en", { sensitivity: "base" });
        const ta = (a.title || "").toLowerCase();
        const tb = (b.title || "").toLowerCase();
        if (ta !== tb) return ta.localeCompare(tb, "en", { sensitivity: "base" });
        const da = a.created_at ? new Date(a.created_at).getTime() : 0;
        const db = b.created_at ? new Date(b.created_at).getTime() : 0;
        return db - da;
      });
    } else {
      arr.sort((a, b) => {
        const da = a.created_at ? new Date(a.created_at).getTime() : 0;
        const db = b.created_at ? new Date(b.created_at).getTime() : 0;
        return db - da;
      });
    }
    return arr;
  }, [documents, sortMode]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      const { error } = await supabase
        .from("lodge_documents")
        .delete()
        .eq("id", id);

      if (error) throw error;
      await loadDocuments();
    } catch (err) {
      console.error("Error deleting document:", err);
      alert("Failed to delete document");
    }
  };

  const handleEdit = (doc: Document) => {
    setEditing(doc);
    setCreating(false);
  };

  const handleCreate = () => {
    setCreating(true);
    setEditing(null);
  };

  const handleClose = () => {
    setCreating(false);
    setEditing(null);
    loadDocuments();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="container mx-auto">
          <p className="text-neutral-600">Loading documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/admin")}
              className="px-3 py-1.5 rounded-md border border-neutral-300 hover:bg-neutral-50 text-sm"
            >
              â† Back to Admin
            </button>
            <button
              onClick={() => navigate("/members")}
              className="px-3 py-1.5 rounded-md border border-neutral-300 hover:bg-neutral-50 text-sm"
            >
              â† Back to Members
            </button>
          </div>
          <h1 className="text-3xl font-bold text-[#0B1831]">
            Lodge Documents ({documents.length})
          </h1>
          <div className="flex items-center gap-4"><div className="flex items-center gap-3 text-sm text-neutral-700"><span className="font-medium">Sort by:</span><label className="inline-flex items-center gap-1"><input type="radio" name="doc-sort" value="date" checked={sortMode === "date"} onChange={() => setSortMode("date")} /><span>Newest</span></label><label className="inline-flex items-center gap-1"><input type="radio" name="doc-sort" value="category" checked={sortMode === "category"} onChange={() => setSortMode("category")} /><span>Category</span></label></div><Button onClick={handleCreate} variant="primary"><Plus className="w-4 h-4 mr-2" />Add Document</Button></div>
        </div>

        {/* Document Form */}
        {(creating || editing) && (
          <div className="mb-8">
            <DocumentForm
              initialData={editing || undefined}
              onClose={handleClose}
            />
          </div>
        )}
        {/* Filter Controls */}
        <div className="flex items-center justify-end gap-2 mb-3">
          <label htmlFor="doc-cat-filter" className="text-sm text-neutral-700">Category:</label>
          <select
            id="doc-cat-filter"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-2 py-1.5 border border-neutral-300 rounded-md bg-white text-sm"
          >
            <option value="all">All categories</option>
            {[...new Set(documents.map(d => (d.category || "").trim())).values()]
              .filter(Boolean)
              .sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }))
              .map(c => (<option key={c} value={c}>{c}</option>))}
          </select>
        </div>

        {/* Documents List */}
        <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="text-left px-3 py-2 text-xs font-semibold text-neutral-700 w-1/4">
                  Title
                </th>
                <th className="text-left px-3 py-2 text-xs font-semibold text-neutral-700 w-1/3">
                  Description
                </th>
                <th className="text-left px-3 py-2 text-xs font-semibold text-neutral-700 w-1/6">
                  Category
                </th>
                <th className="text-left px-3 py-2 text-xs font-semibold text-neutral-700 w-20">
                  File
                </th>
                <th className="text-right px-3 py-2 text-xs font-semibold text-neutral-700 w-20">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {documents.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-6 text-center text-neutral-500 text-sm"
                  >
                    No documents yet. Click "Add Document" to create one.
                  </td>
                </tr>
              ) : (
                (
                  (filterCategory === "all"
                    ? sortedDocuments
                    : sortedDocuments.filter(
                        (d) => (d.category || "").trim() === filterCategory
                      ))
                ).map((doc) => (
                  <tr
                    key={doc.id}
                    className="border-b border-neutral-100 hover:bg-neutral-50"
                  >
                    <td className="px-3 py-2 text-sm font-medium text-neutral-900 truncate max-w-xs">
                      {doc.title}
                    </td>
                    <td className="px-3 py-2 text-xs text-neutral-600 truncate max-w-md">
                      {doc.description || "â€”"}
                    </td>
                    <td className="px-3 py-2 text-xs text-neutral-600">
                      {doc.category || "â€”"}
                    </td>
                    <td className="px-3 py-2 text-xs">
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#BFA76F] hover:underline flex items-center gap-1"
                      >
                        View
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                    <td className="px-3 py-2 text-xs text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(doc)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DocumentsAdminPage;















