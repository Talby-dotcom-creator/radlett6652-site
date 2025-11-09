import React, { useState, useEffect } from "react";
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
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Document | null>(null);
  const [creating, setCreating] = useState(false);

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
          <h1 className="text-3xl font-bold text-[#0B1831]">
            Lodge Documents ({documents.length})
          </h1>
          <Button onClick={handleCreate} variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Document
          </Button>
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
                documents.map((doc) => (
                  <tr
                    key={doc.id}
                    className="border-b border-neutral-100 hover:bg-neutral-50"
                  >
                    <td className="px-3 py-2 text-sm font-medium text-neutral-900 truncate max-w-xs">
                      {doc.title}
                    </td>
                    <td className="px-3 py-2 text-xs text-neutral-600 truncate max-w-md">
                      {doc.description || "—"}
                    </td>
                    <td className="px-3 py-2 text-xs text-neutral-600">
                      {doc.category || "—"}
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
