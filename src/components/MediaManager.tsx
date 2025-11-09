import React, { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import Button from "./Button";

import {
  Folder as FolderIcon,
  File as FileIcon,
  Image as ImageIcon,
  Upload as UploadIcon,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  RefreshCcw,
  Search,
} from "lucide-react";

interface MediaManagerProps {
  onSelectMedia?: (url: string) => void;
  onUpload?: (url: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
  startPath?: string;
  defaultFolder?: string;
}

type Entry = {
  name: string;
  type: "file" | "folder";
  size?: number | null;
  created_at?: string | null;
  path: string;
  url?: string;
};

const BUCKET = "cms-media";

const ROOT_FOLDERS = [
  "events",
  "news",
  "blog-images",
  "testimonials",
  "documents",
  "officers",
  "resources",
  "lodge_documents",
  "uploads",
];

function isImage(name: string) {
  return /\.(png|jpe?g|webp|gif|svg)$/i.test(name);
}

function isPdf(name: string) {
  return /\.pdf$/i.test(name);
}

function formatBytes(bytes?: number | null) {
  if (!bytes) return "";
  const b = Number(bytes);
  if (b < 1024) return `${b} B`;
  const kb = b / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}

const MediaManager: React.FC<MediaManagerProps> = ({
  onSelectMedia,
  onUpload,
  isOpen = false,
  onClose,
  startPath = "",
  defaultFolder,
}) => {
  // ✅ Modal exit logic
  const handleClose = () => {
    document.body.style.overflow = "auto";
    onClose?.();
  };

  // ✅ Disable scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // ✅ ESC key closes modal
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ✅ Normal Media Manager logic below

  const initial = (defaultFolder ?? startPath ?? "").replace(/^\/+|\/+$/g, "");
  const [cwd, setCwd] = useState<string>(initial);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const pageSize = 50;

  // ✅ Breadcrumbs
  const breadcrumbs = useMemo(() => {
    if (!cwd) return [];
    const parts = cwd.split("/").filter(Boolean);
    return parts.map((seg, idx) => ({
      label: seg,
      path: parts.slice(0, idx + 1).join("/"),
    }));
  }, [cwd]);

  const ensureRootFolders = (listed: Entry[]) => {
    if (defaultFolder) return listed; // locked mode

    if (cwd !== "") return listed;
    const existing = new Set(
      listed.filter((e) => e.type === "folder").map((e) => e.name)
    );

    const injected: Entry[] = ROOT_FOLDERS.filter((f) => !existing.has(f)).map(
      (f) => ({
        name: f,
        type: "folder",
        size: null,
        created_at: null,
        path: f,
      })
    );

    return [...listed, ...injected].sort((a, b) => {
      if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  };

  const load = async () => {
    setLoading(true);
    setError(null);

    try {
      const prefix = cwd;
      const { data, error } = await supabase.storage.from(BUCKET).list(prefix, {
        limit: pageSize,
        offset: (page - 1) * pageSize,
        sortBy: { column: "name", order: "asc" },
      });

      if (error) throw error;

      const mapped: Entry[] =
        data?.map((item) => {
          const isFolder = item.id === null;
          const path = prefix ? `${prefix}/${item.name}` : item.name;

          if (isFolder) {
            return {
              name: item.name,
              type: "folder",
              size: null,
              created_at: null,
              path,
            };
          } else {
            const publicUrl = supabase.storage.from(BUCKET).getPublicUrl(path)
              .data.publicUrl;

            const md = (item as any)?.metadata ?? {};

            return {
              name: item.name,
              type: "file",
              size: typeof md.size === "number" ? md.size : null,
              created_at: (item as any)?.created_at ?? null,
              path,
              url: publicUrl,
            };
          }
        }) ?? [];

      const withRoots = ensureRootFolders(mapped);
      setEntries(withRoots);
    } catch (e: any) {
      console.error("Media load failed:", e);
      setError(e.message || "Failed to load media");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) load();
  }, [cwd, page, isOpen]);

  const onPickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const cleanName = `${Date.now()}_${file.name}`;
      const dest = (cwd || defaultFolder || "").length
        ? `${cwd || defaultFolder}/${cleanName}`
        : cleanName;

      const { error } = await supabase.storage.from(BUCKET).upload(dest, file);
      if (error) throw error;

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(dest);
      const url = data.publicUrl;

      onUpload?.(url);
      onSelectMedia?.(url);
      await load();
    } catch (e: any) {
      alert(`Upload failed: ${e.message || e}`);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const openFolder = (path: string) => {
    setPage(1);
    setCwd(path.replace(/^\/+|\/+$/g, ""));
  };

  const goUp = () => {
    if (!cwd) return;
    if (defaultFolder && cwd === defaultFolder) return;

    const parts = cwd.split("/").filter(Boolean);
    parts.pop();
    const parent = parts.join("/");

    if (defaultFolder && parent && !parent.startsWith(defaultFolder)) {
      setCwd(defaultFolder);
      return;
    }

    setCwd(parent);
  };

  if (!isOpen) return null;

  // ✅ Modal Layout
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="w-[95%] max-w-5xl max-h-[90vh] overflow-hidden bg-[#0B1831] text-white rounded-xl border border-[#BFA76F]/40 shadow-2xl relative
                   animate-[fadeScaleIn_0.25s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-neutral-300 hover:text-white transition"
          title="Close"
        >
          ✕
        </button>

        <div className="p-4 overflow-y-auto max-h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-[#BFA76F]">
              Media Manager
            </h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={load}>
                <RefreshCcw className="w-4 h-4 mr-1" />
                Refresh
              </Button>

              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="primary"
                size="sm"
              >
                <UploadIcon className="w-4 h-4 mr-2" />
                Upload
              </Button>

              <input
                ref={fileInputRef}
                className="hidden"
                type="file"
                accept="image/*,application/pdf"
                onChange={onPickFile}
              />
            </div>
          </div>

          {/* Breadcrumbs */}
          <div className="flex items-center gap-1 text-sm text-neutral-300 mb-3">
            {!defaultFolder && (
              <button
                className={`hover:underline ${
                  !cwd ? "opacity-60 cursor-default" : ""
                }`}
                onClick={() => cwd && openFolder("")}
                disabled={!cwd}
              >
                cms-media
              </button>
            )}

            {breadcrumbs.map((bc, i) => (
              <React.Fragment key={bc.path}>
                <ChevronRight className="w-4 h-4 opacity-60" />
                <button
                  onClick={() => openFolder(bc.path)}
                  className="hover:underline"
                >
                  {bc.label}
                </button>
              </React.Fragment>
            ))}
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 mb-3">
            <Button
              variant="outline"
              size="sm"
              onClick={goUp}
              disabled={!cwd || (!!defaultFolder && cwd === defaultFolder)}
            >
              <ChevronLeft className="w-4 h-4" />
              Up
            </Button>

            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 text-neutral-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search files…"
                className="w-full pl-8 pr-3 py-2 rounded-md bg-[#0F2247] border border-[#BFA76F]/30 text-white placeholder:text-neutral-400"
              />
            </div>
          </div>

          {/* Errors */}
          {error && <div className="text-red-400 mb-3">{error}</div>}
          {loading && <div className="text-neutral-300 mb-3">Loading…</div>}

          {/* File Table */}
          <div className="overflow-auto rounded-lg border border-[#BFA76F]/20">
            <table className="w-full text-sm">
              <thead className="bg-[#0F2247] text-neutral-200">
                <tr>
                  <th className="px-3 py-2 w-8"></th>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2 w-28">Type</th>
                  <th className="px-3 py-2 w-28">Size</th>
                  <th className="px-3 py-2 w-48">Created</th>
                  <th className="px-3 py-2 w-40">Actions</th>
                </tr>
              </thead>

              <tbody>
                {entries
                  .filter((e) =>
                    e.name.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((e) => {
                    const typeLabel =
                      e.type === "folder"
                        ? "Folder"
                        : isPdf(e.name)
                        ? "PDF"
                        : isImage(e.name)
                        ? "Image"
                        : "File";

                    return (
                      <tr
                        key={e.path}
                        className="border-t border-[#BFA76F]/10 transition-all duration-150
                                   hover:bg-[#0F2247]/60 hover:shadow-[0_0_0_1px_#BFA76F40]"
                      >
                        <td className="px-3 py-2">
                          {e.type === "folder" ? (
                            <FolderIcon className="w-5 h-5 text-[#BFA76F]" />
                          ) : isImage(e.name) ? (
                            <img
                              src={e.url}
                              alt=""
                              className="w-10 h-10 object-cover rounded border border-[#BFA76F]/30"
                            />
                          ) : isPdf(e.name) ? (
                            <FileIcon className="w-5 h-5 text-red-400" />
                          ) : (
                            <FileIcon className="w-5 h-5 text-[#BFA76F]" />
                          )}
                        </td>

                        <td className="px-3 py-2">
                          {e.type === "folder" ? (
                            <button
                              onClick={() => openFolder(e.path)}
                              className="text-[#BFA76F] hover:underline"
                            >
                              {e.name}/
                            </button>
                          ) : (
                            <span className="text-neutral-100">{e.name}</span>
                          )}
                        </td>

                        <td className="px-3 py-2">{typeLabel}</td>
                        <td className="px-3 py-2">{formatBytes(e.size)}</td>
                        <td className="px-3 py-2">
                          {e.created_at
                            ? new Date(e.created_at).toLocaleString()
                            : ""}
                        </td>

                        <td className="px-3 py-2">
                          {e.type === "file" ? (
                            <div className="flex gap-2">
                              {isImage(e.name) && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setPreview(e.url!)}
                                >
                                  Preview
                                </Button>
                              )}

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(e.url!, "_blank")}
                              >
                                <ExternalLink className="w-4 h-4 mr-1" />
                                View
                              </Button>

                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => onSelectMedia?.(e.url!)}
                              >
                                Insert
                              </Button>
                            </div>
                          ) : (
                            "—"
                          )}
                        </td>
                      </tr>
                    );
                  })}

                {!loading && entries.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-6 text-neutral-300"
                    >
                      This folder is empty. Upload files above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="w-4 h-4" />
              Prev
            </Button>

            <span className="text-neutral-400 text-sm">Page {page}</span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Image Preview Lightbox */}
      {preview && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60]"
          onClick={() => setPreview(null)}
        >
          <img
            src={preview}
            alt=""
            className="max-w-[90%] max-h-[90%] rounded-lg shadow-xl"
          />
        </div>
      )}
    </div>
  );
};

export default MediaManager;
