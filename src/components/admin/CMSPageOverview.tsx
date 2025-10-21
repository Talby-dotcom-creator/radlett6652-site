import React, { useEffect, useState } from "react";
import { cmsApi } from "../../lib/cmsApi";
import LoadingSpinner from "../LoadingSpinner";
import Button from "../Button";
import { PageContent } from "../../types";

interface CMSPage {
  page_name: string;
  section_count: number;
  sections: string[];
}

const CMSPageOverview: React.FC = () => {
  const [pages, setPages] = useState<CMSPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // view/edit state
  const [activePage, setActivePage] = useState<string | null>(null);
  const [sections, setSections] = useState<PageContent[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<string>("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadPages = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await cmsApi.getPageSummaries();
        setPages(data ?? []);
      } catch (err) {
        console.error("❌ Error loading CMS pages:", err);
        setError("Failed to load CMS page list");
      } finally {
        setLoading(false);
      }
    };

    loadPages();
  }, []);

  const openPage = async (pageName: string) => {
    setActivePage(pageName);
    setLoading(true);
    try {
      const data = await cmsApi.getPageContent(pageName);
      setSections(data ?? []);
    } catch (err) {
      console.error("Error loading page sections:", err);
      setError("Failed to load page sections");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (section: PageContent) => {
    setEditingId(section.id);
    setDraft(section.content || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft("");
  };

  const save = async () => {
    if (!editingId) return;
    setSaving(true);
    try {
      await cmsApi.updatePageContent(editingId, { content: draft });
      // refresh sections for the page
      if (activePage) {
        const refreshed = await cmsApi.getPageContent(activePage);
        setSections(refreshed ?? []);
      }
      setEditingId(null);
      setDraft("");
    } catch (err) {
      console.error("Failed to save section:", err);
      setError("Failed to save section");
    } finally {
      setSaving(false);
    }
  };

  const closePage = () => {
    setActivePage(null);
    setSections([]);
    setEditingId(null);
    setDraft("");
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-600">{error}</p>;

  // List view
  if (!activePage) {
    return (
      <div className="border rounded-lg divide-y divide-neutral-200 bg-white shadow-sm">
        {pages.map((p) => (
          <div
            key={p.page_name}
            className="flex flex-col md:flex-row md:items-center justify-between px-4 py-3"
          >
            <div>
              <h3 className="font-semibold text-primary-700 capitalize">
                {p.page_name.replace(/-/g, " ")}
              </h3>
              <p className="text-sm text-neutral-600">
                {p.section_count} sections:{" "}
                <span className="text-neutral-500">
                  {p.sections.join(", ")}
                </span>
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => openPage(p.page_name)}
            >
              View / Edit
            </Button>
          </div>
        ))}
      </div>
    );
  }

  // Detail / edit view for a page
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            {activePage.replace(/-/g, " ")}
          </h2>
          <p className="text-sm text-neutral-600">Editing page sections</p>
        </div>
        <div className="space-x-2">
          <Button size="sm" variant="outline" onClick={closePage}>
            Back
          </Button>
        </div>
      </div>

      <ul className="space-y-3">
        {sections.map((s) => (
          <li key={s.id} className="border rounded p-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium">{s.section_name}</div>
                <div className="text-sm text-neutral-600">{s.content_type}</div>
              </div>
              <div className="space-x-2">
                <Button size="sm" onClick={() => startEdit(s)}>
                  Edit
                </Button>
              </div>
            </div>

            {editingId === s.id && (
              <div className="mt-3">
                <textarea
                  className="w-full border rounded p-2 min-h-[120px]"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                />
                <div className="mt-2 space-x-2">
                  <Button size="sm" onClick={save} disabled={saving}>
                    {saving ? "Saving..." : "Save"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={cancelEdit}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {editingId !== s.id && (
              <div className="mt-2 text-sm text-neutral-700">{s.content}</div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CMSPageOverview;
