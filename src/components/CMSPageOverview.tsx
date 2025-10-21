import React, { useEffect, useState } from "react";
import { cmsApi } from "../lib/cmsApi";
import { PageContent } from "../types";
import LoadingSpinner from "./LoadingSpinner";
import Button from "./Button";

const CMSPageOverview: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState<PageContent[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<string>("");

  const load = async () => {
    setLoading(true);
    const data = await cmsApi.getPageContent("about");
    setSections(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

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
    await cmsApi.updatePageContent(editingId, { content: draft });
    await load();
    setEditingId(null);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {sections.length === 0 && (
        <p className="text-sm text-neutral-600">
          No page content found for this page.
        </p>
      )}
      <ul className="space-y-3">
        {sections.map((s) => (
          <li key={s.id} className="border rounded p-3">
            <div className="flex justify-between items-center">
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
                  <Button size="sm" onClick={save}>
                    Save
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
