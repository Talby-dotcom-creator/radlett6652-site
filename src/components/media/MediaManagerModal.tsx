// PRODUCTION MEDIA MANAGER (Option B) – Modal + Folder Locking
// File: src/components/media/MediaManagerModal.tsx
// Notes:
// - Safe, stable hooks (no conditional hooks)
// - Portal-based modal (esc to close, backdrop click closes)
// - Grid/List toggle, search, breadcrumbs, pagination
// - Drag & drop + file picker uploads
// - Folder locking via `defaultFolder`
// - Copy URL, inline preview for images/PDFs
// - Accessible roles/labels; no external styles required beyond Tailwind

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { supabase } from "../../lib/supabase";
import Button from "../Button";
import {
  X as Close,
  Upload as UploadIcon,
  Search,
  Folder as FolderIcon,
  Image as ImageIcon,
  File as FileIcon,
  ExternalLink,
  RefreshCcw,
  ChevronLeft,
  ChevronRight,
  Copy as CopyIcon,
  Grid as GridIcon,
  List as ListIcon,
} from "lucide-react";

// ------------------------- Types & Constants -------------------------
type Entry = {
  name: string;
  type: "file" | "folder";
  size?: number | null;
  created_at?: string | null;
  path: string;
  url?: string;
};

export interface MediaManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (publicUrl: string) => void;
  /** Lock navigation to a single top-level folder (e.g. "documents") */
  defaultFolder?:
    | "events"
    | "news"
    | "blog-images"
    | "testimonials"
    | "documents"
    | "officers"
    | "images"
    | "resources"
    | "uploads";
  /** Optional starting subpath under the locked folder */
  startPath?: string;
}

const BUCKET = "cms-media" as const;
const PAGE_SIZE = 48;

const ROOT_WHITELIST = [
  "events",
  "news",
  "blog-images",
  "testimonials",
  "documents",
  "officers",
  "images",
  "resources",
  "uploads",
] as const;

const isImage = (name: string) => /\.(png|jpe?g|webp|gif|svg)$/i.test(name);
const isPdf = (name: string) => /\.pdf$/i.test(name);
const formatBytes = (n?: number | null) => {
  if (n === undefined || n === null) return "";
  if (n < 1024) return `${n} B`;
  const kb = n / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
};

// ------------------------------ Component ------------------------------
const MediaManagerModal: React.FC<MediaManagerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  defaultFolder,
  startPath = "",
}) => {
  // State
  const [rootEl, setRootEl] = useState<HTMLElement | null>(null);
  const [cwd, setCwd] = useState<string>("");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [preview, setPreview] = useState<Entry | null>(null);
  const dropRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Mount portal root once
  useEffect(() => {
    let el = document.getElementById("media-manager-portal");
    if (!el) {
      el = document.createElement("div");
      el.id = "media-manager-portal";
      document.body.appendChild(el);
    }
    setRootEl(el);
    return () => {
      // keep portal around to avoid teardown flicker across openings
    };
  }, []);

  // Reset state on open
  useEffect(() => {
    if (!isOpen) return;
    const base = (defaultFolder ?? "").replace(/^\/+|\/+$/g, "");
    const start = (startPath ?? "").replace(/^\/+|\/+$/g, "");
    const next = base ? (start ? `${base}/${start}` : base) : "";
    setCwd(next);
    setPage(1);
    setPreview(null);
    setQuery("");
  }, [isOpen, defaultFolder, startPath]);

  // Breadcrumbs
  const breadcrumbs = useMemo(() => {
    if (!cwd) return [] as { label: string; path: string }[];
    const parts = cwd.split("/").filter(Boolean);
    return parts.map((seg, i) => ({
      label: seg,
      path: parts.slice(0, i + 1).join("/"),
    }));
  }, [cwd]);

  // Load current directory
  const load = useCallback(async () => {
    if (!isOpen) return;
    setLoading(true);
    setError(null);
    try {
      const prefix = cwd;
      const { data, error } = await supabase.storage.from(BUCKET).list(prefix, {
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE,
        sortBy: { column: "name", order: "asc" },
      });
      if (error) throw error;

      const mapped: Entry[] = (data ?? []).map((i: any) => {
        const isFolder = i.id === null;
        const path = prefix ? `${prefix}/${i.name}` : i.name;
        if (isFolder) {
          return { name: i.name, type: "folder", path };
        }
        const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
        return {
          name: i.name,
          type: "file",
          path,
          url: pub.publicUrl,
          size: i?.metadata?.size ?? null,
          created_at: i?.created_at ?? null,
        };
      });

      // Inject whitelisted roots at true root (when not locked)
      let withRoots = mapped;
      if (!defaultFolder && cwd === "") {
        const existing = new Set(
          mapped.filter((e) => e.type === "folder").map((e) => e.name)
        );
        const inject: Entry[] = ROOT_WHITELIST.filter(
          (f) => !existing.has(f)
        ).map((f) => ({
          name: f,
          type: "folder" as const,
          path: f,
        }));
        withRoots = [...mapped, ...inject];
      }

      withRoots.sort((a, b) => {
        if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
        return a.name.localeCompare(b.name);
      });

      setEntries(withRoots);
    } catch (err: any) {
      setError(err.message || "Failed to load media.");
    } finally {
      setLoading(false);
    }
  }, [cwd, page, isOpen, defaultFolder]);

  useEffect(() => {
    load();
  }, [load]);

  // Navigation helpers
  const openFolder = (path: string) => {
    const next = path.replace(/^\/+|\/+$/g, "");
    if (defaultFolder && !next.startsWith(defaultFolder)) return;
    setPreview(null);
    setPage(1);
    setCwd(next);
  };

  const goUp = () => {
    if (!cwd) return;
    const parts = cwd.split("/").filter(Boolean);
    parts.pop();
    const parent = parts.join("/");
    if (defaultFolder && parent && !parent.startsWith(defaultFolder)) {
      setCwd(defaultFolder);
      return;
    }
    setCwd(parent);
  };

  // Client-side search
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter((e) => e.name.toLowerCase().includes(q));
  }, [entries, query]);

  // Drag & drop upload
  useEffect(() => {
    const el = dropRef.current;
    if (!el) return;
    const prevent = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };
    const onDrop = async (e: DragEvent) => {
      prevent(e);
      const file = e.dataTransfer?.files?.[0];
      if (file) await doUpload(file);
    };
    el.addEventListener("dragover", prevent);
    el.addEventListener("drop", onDrop);
    return () => {
      el.removeEventListener("dragover", prevent);
      el.removeEventListener("drop", onDrop);
    };
  }, [cwd]);

  const doUpload = async (file: File) => {
    const folder = cwd || defaultFolder || "";
    const name = `${Date.now()}_${file.name}`;
    const dest = folder ? `${folder}/${name}` : name;
    const { error } = await supabase.storage.from(BUCKET).upload(dest, file);
    if (error) {
      alert(error.message);
      return;
    }
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(dest);
    onSelect(data.publicUrl);
    await load();
  };

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter" && preview?.url) onSelect(preview.url);
      if (e.key === "Backspace") goUp();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, preview?.url, onClose]);

  if (!isOpen || !rootEl) return null;

  const dialog = (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Dialog */}
      <div
        ref={dropRef}
        role="dialog"
        aria-modal="true"
        aria-label="Media Manager"
        className="relative z-10 w-[min(1120px,95vw)] h-[min(88vh,940px)] bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex"
      >
        {/* Left: Browser */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">Media Manager</h2>
              <span className="text-xs text-neutral-500">Bucket: {BUCKET}</span>
              {defaultFolder && (
                <span className="ml-2 text-xs rounded bg-neutral-100 px-2 py-1 text-neutral-600">
                  Locked to {defaultFolder}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={load}>
                <RefreshCcw className="w-4 h-4 mr-1" /> Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setView(view === "grid" ? "list" : "grid")}
                title={view === "grid" ? "Switch to list" : "Switch to grid"}
              >
                {view === "grid" ? (
                  <ListIcon className="w-4 h-4" />
                ) : (
                  <GridIcon className="w-4 h-4" />
                )}
              </Button>
              <button
                onClick={onClose}
                className="p-2 rounded hover:bg-neutral-100"
                aria-label="Close"
              >
                <Close className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Breadcrumbs + tools */}
          <div className="px-4 py-2 border-b flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goUp}
              disabled={!cwd || (defaultFolder && cwd === defaultFolder)}
              title="Up one level"
            >
              <ChevronLeft className="w-4 h-4" /> Up
            </Button>
            <div className="text-sm text-neutral-600 flex-1">
              {defaultFolder ? (
                <>
                  <span className="opacity-60">{defaultFolder}</span>
                  {breadcrumbs.map((b) => (
                    <span key={b.path} className="ml-1">
                      /&nbsp;
                      <button
                        onClick={() => openFolder(b.path)}
                        className="hover:underline"
                      >
                        {b.label}
                      </button>
                    </span>
                  ))}
                </>
              ) : (
                <>
                  <button
                    className={`hover:underline ${!cwd ? "opacity-60" : ""}`}
                    onClick={() => openFolder("")}
                  >
                    cms-media
                  </button>
                  {breadcrumbs.map((b) => (
                    <span key={b.path} className="ml-1">
                      /&nbsp;
                      <button
                        onClick={() => openFolder(b.path)}
                        className="hover:underline"
                      >
                        {b.label}
                      </button>
                    </span>
                  ))}
                </>
              )}
            </div>
            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-2 top-2.5 text-neutral-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search in folder…"
                className="w-full pl-8 pr-3 py-2 rounded border border-neutral-300"
              />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) doUpload(f);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
            />
            <Button
              variant="primary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadIcon className="w-4 h-4 mr-2" /> Upload
            </Button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-auto">
            {loading && (
              <div className="p-4 text-sm text-neutral-500">Loading…</div>
            )}
            {error && <div className="p-4 text-sm text-red-600">{error}</div>}

            {view === "grid" ? (
              <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {filtered.map((e) => (
                  <div
                    key={e.path}
                    className="group border rounded-lg overflow-hidden hover:shadow transition cursor-pointer"
                    onClick={() =>
                      e.type === "folder" ? openFolder(e.path) : setPreview(e)
                    }
                  >
                    <div className="aspect-video bg-neutral-50 flex items-center justify-center">
                      {e.type === "folder" ? (
                        <FolderIcon className="w-8 h-8 text-neutral-500" />
                      ) : isImage(e.name) ? (
                        <img
                          src={e.url}
                          alt={e.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FileIcon className="w-8 h-8 text-neutral-500" />
                      )}
                    </div>
                    <div className="px-3 py-2 text-sm">
                      <div className="truncate" title={e.name}>
                        {e.name}
                      </div>
                      <div className="text-xs text-neutral-500 mt-0.5">
                        {e.type === "file" ? formatBytes(e.size) : "Folder"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="text-left px-3 py-2 w-8"></th>
                    <th className="text-left px-3 py-2">Name</th>
                    <th className="text-left px-3 py-2 w-24">Type</th>
                    <th className="text-left px-3 py-2 w-28">Size</th>
                    <th className="text-left px-3 py-2 w-44">Created</th>
                    <th className="text-left px-3 py-2 w-44">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((e) => (
                    <tr key={e.path} className="border-t">
                      <td className="px-3 py-2">
                        {e.type === "folder" ? (
                          <FolderIcon className="w-5 h-5 text-neutral-500" />
                        ) : isImage(e.name) ? (
                          <ImageIcon className="w-5 h-5 text-neutral-500" />
                        ) : (
                          <FileIcon className="w-5 h-5 text-neutral-500" />
                        )}
                      </td>
                      <td className="px-3 py-2">
                        {e.type === "folder" ? (
                          <button
                            className="text-primary-600 hover:underline"
                            onClick={() => openFolder(e.path)}
                          >
                            {e.name}/
                          </button>
                        ) : (
                          <button
                            className="hover:underline"
                            onClick={() => setPreview(e)}
                          >
                            {e.name}
                          </button>
                        )}
                      </td>
                      <td className="px-3 py-2 text-neutral-600">
                        {e.type === "folder"
                          ? "Folder"
                          : isPdf(e.name)
                          ? "PDF"
                          : isImage(e.name)
                          ? "Image"
                          : "File"}
                      </td>
                      <td className="px-3 py-2 text-neutral-600">
                        {e.type === "file" ? formatBytes(e.size) : ""}
                      </td>
                      <td className="px-3 py-2 text-neutral-600">
                        {e.type === "file" && e.created_at
                          ? new Date(e.created_at).toLocaleString()
                          : ""}
                      </td>
                      <td className="px-3 py-2">
                        {e.type === "file" ? (
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(e.url!, "_blank")}
                            >
                              <ExternalLink className="w-4 h-4 mr-1" /> View
                            </Button>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => onSelect(e.url!)}
                            >
                              Insert
                            </Button>
                          </div>
                        ) : (
                          <span className="text-neutral-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Footer (pagination) */}
          <div className="px-4 py-3 border-t flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </Button>
            <span className="text-sm text-neutral-600">Page {page}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
            >
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Right: Preview Pane */}
        <aside className="w-[360px] border-l bg-neutral-50 h-full hidden md:flex md:flex-col">
          <div className="px-4 py-3 border-b flex items-center justify-between">
            <h3 className="font-medium">Preview</h3>
            {preview?.url && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigator.clipboard.writeText(preview.url!)}
              >
                <CopyIcon className="w-4 h-4 mr-1" /> Copy URL
              </Button>
            )}
          </div>
          <div className="p-4 overflow-auto flex-1">
            {!preview && (
              <p className="text-sm text-neutral-500">
                Select a file to preview.
              </p>
            )}
            {preview && preview.type === "file" && (
              <div className="space-y-3">
                <div className="rounded border bg-white p-2">
                  {isImage(preview.name) ? (
                    <img
                      src={preview.url}
                      alt={preview.name}
                      className="w-full h-auto rounded"
                    />
                  ) : isPdf(preview.name) ? (
                    <embed
                      src={preview.url}
                      type="application/pdf"
                      className="w-full h-64"
                    />
                  ) : (
                    <div className="p-6 text-center text-neutral-500">
                      <FileIcon className="w-8 h-8 mx-auto mb-2" />
                      <div className="text-sm">No inline preview</div>
                    </div>
                  )}
                </div>
                <div className="text-sm">
                  <div className="font-medium truncate" title={preview.name}>
                    {preview.name}
                  </div>
                  <div className="text-neutral-600 mt-1">
                    {formatBytes(preview.size)}
                  </div>
                  {preview.created_at && (
                    <div className="text-neutral-600">
                      Created {new Date(preview.created_at).toLocaleString()}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(preview.url!, "_blank")}
                  >
                    <ExternalLink className="w-4 h-4 mr-1" /> Open
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onSelect(preview.url!)}
                  >
                    Insert
                  </Button>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );

  return createPortal(dialog, rootEl);
};

export default MediaManagerModal;
