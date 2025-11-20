import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, FileText, Settings, Users, Calendar, LogIn, X } from "lucide-react";
import { optimizedApi, getMemberResources } from "../lib/optimizedApi";
import type { LodgeDocument, MeetingMinutes, Event as LodgeEvent } from "../types";
import HeroWelcome from "../components/members/HeroWelcome";
import QuickActionTile from "../components/members/QuickActionTile";

type MemberDoc = {
  id: string;
  title: string;
  rawCategory: string;
  category: string; // canonical key
  file_url: string;
  date: string | null; // ISO-like string for display/sort
  source: "lodge_documents" | "meeting_minutes" | "member_resources";
};

type LodgeDocumentExt = LodgeDocument & {
  document_date?: string | null;
  publish_date?: string | null;
  url?: string | null;
};

type MemberResourceRow = {
  id: string;
  title: string;
  category?: string | null;
  file_url?: string | null;
  url?: string | null;
  publish_date?: string | null;
  created_at?: string | null;
};

const CATEGORY_DEFS: { key: string; label: string }[] = [
  { key: "grand_lodge", label: "Grand Lodge" },
  { key: "provincial", label: "Provincial" },
  { key: "summons", label: "Summons" },
  { key: "lodge_instruction", label: "Lodge of Instruction" },
  { key: "bylaws", label: "Bylaws" },
  { key: "resources", label: "Resources" },
  { key: "minutes", label: "Meeting Minutes" },
];

function normaliseCategoryLabel(s: string): string {
  return (s || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

function canonicaliseCategory(s: string): string {
  const k = normaliseCategoryLabel(s);
  const map: Record<string, string> = {
    grand_lodge: "grand_lodge",
    grand_lodge_communications: "grand_lodge",
    provincial: "provincial",
    provincial_communications: "provincial",
    summons: "summons",
    lodge_of_instruction: "lodge_instruction",
    lodge_instruction: "lodge_instruction",
    byelaws: "bylaws",
    bylaws: "bylaws",
    resources: "resources",
    resource: "resources",
    resources_links: "resources",
    resources_and_links: "resources",
    links: "resources",
    meeting_minutes: "minutes",
    minutes: "minutes",
  };
  return map[k] ?? k;
}

function labelFromKey(key: string): string {
  const known = CATEGORY_DEFS.find((c) => c.key === key)?.label;
  if (known) return known;
  return key
    .split("_")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function formatDate(d: string | null | undefined): string {
  if (!d) return "";
  try {
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return d;
    return dt.toLocaleDateString();
  } catch {
    return d;
  }
}

const PAGE_SIZE = 20;

export default function MembersPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [docs, setDocs] = useState<MemberDoc[]>([]);
  const [nextMeetingText, setNextMeetingText] = useState<string | null>(null);
  const [nextMeetingDays, setNextMeetingDays] = useState<number | null>(null);

  const [selected, setSelected] = useState<string[]>([]); // no default selection
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [showRecent, setShowRecent] = useState(false);

  const LS_KEYS = {
    selected: "members.selectedCategories",
    query: "members.searchQuery",
  } as const;

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        // restore persisted filters
        try {
          const s = localStorage.getItem(LS_KEYS.selected);
          if (s) {
            const parsed = JSON.parse(s);
            if (Array.isArray(parsed)) setSelected(parsed.filter((k) => typeof k === "string"));
          }
          const q = localStorage.getItem(LS_KEYS.query);
          if (typeof q === "string") setQuery(q);
        } catch {}
        const [ld, mm, res, ev] = await Promise.all([
          optimizedApi.getLodgeDocuments(),
          optimizedApi.getMeetingMinutes(),
          getMemberResources(),
          optimizedApi.getEvents?.() ?? Promise.resolve([]),
        ]);

        const ldDocs: MemberDoc[] = (ld as LodgeDocumentExt[]).map((d) => ({
          id: d.id,
          title: d.title,
          rawCategory: d.category ?? "",
          category: canonicaliseCategory(d.category ?? ""),
          file_url: d.file_url ?? d.url ?? "",
          date: d.document_date ?? d.publish_date ?? d.created_at ?? null,
          source: "lodge_documents",
        }));

        const mmDocs: MemberDoc[] = (mm as MeetingMinutes[]).map((m) => ({
          id: m.id,
          title: m.title,
          rawCategory: "meeting_minutes",
          category: "minutes",
          file_url: m.file_url,
          date: m.meeting_date ?? m.created_at ?? null,
          source: "meeting_minutes",
        }));

        const resDocs: MemberDoc[] = (res as MemberResourceRow[]).map((r) => ({
          id: r.id,
          title: r.title,
          rawCategory: r.category ?? "resources",
          category: "resources",
          file_url: r.file_url ?? r.url ?? "",
          date: r.publish_date ?? r.created_at ?? null,
          source: "member_resources",
        }));

        if (!alive) return;
        setDocs([...ldDocs, ...mmDocs, ...resDocs]);

        // Compute next meeting chip: prefer Installation, else next Regular Meeting
        try {
          const events = (ev as LodgeEvent[]) || [];
          const now = new Date();
          const isRelevant = (e: LodgeEvent) => {
            const t = (e.title || "").toLowerCase();
            const negate = [
              "loi",
              "instruction",
              "lodge of instruction",
              "gpc",
              "committee",
              "rehearsal",
              "social",
              "practice",
            ];
            if (negate.some((k) => t.includes(k))) return false;
            if (t.includes("installation")) return true;
            if (t.includes("regular meeting") || t.includes("regular")) return true;
            return t.includes("meeting");
          };
          const normalized = events
            .filter(isRelevant)
            .map((e) => ({ e, d: new Date(e.event_date), title: (e.title || "").toLowerCase() }))
            .filter(({ d }) => !Number.isNaN(d.getTime()) && d >= new Date(now.toDateString()))
            .sort((a, b) => a.d.getTime() - b.d.getTime());

          // Prefer Installation
          const installation = normalized.find(({ title }) => title.includes("installation"));
          const regular =
            normalized.find(
              ({ title }) =>
                title.includes("regular meeting") ||
                (title.includes("regular") && title.includes("meeting"))
            ) || normalized[0];

          const pick = installation ?? regular;

          if (pick) {
            const { e, d, title } = pick;
            const dateStr = d.toLocaleDateString(undefined, { day: "2-digit", month: "short" });
            const label = title.includes("installation")
              ? "Installation"
              : title.includes("regular")
              ? "Regular Meeting"
              : "Next Meeting";
            setNextMeetingText(`${label} • ${dateStr}`);
            // Days to go (midnight diff)
            const today = new Date();
            const midnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const meetingMidnight = new Date(d.getFullYear(), d.getMonth(), d.getDate());
            const msPerDay = 24 * 60 * 60 * 1000;
            const days = Math.ceil((meetingMidnight.getTime() - midnight.getTime()) / msPerDay);
            setNextMeetingDays(days);
          } else {
            setNextMeetingText(null);
            setNextMeetingDays(null);
          }
        } catch {
          // ignore; keep chip hidden
          setNextMeetingText(null);
          setNextMeetingDays(null);
        }
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message || "Failed to load documents");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optimizedApi, getMemberResources]);

  // Persist filters
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEYS.selected, JSON.stringify(selected));
      localStorage.setItem(LS_KEYS.query, query);
    } catch {}
  }, [selected, query]);

  // Counts by canonical category
  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const d of docs) {
      map[d.category] = (map[d.category] ?? 0) + 1;
    }
    return map;
  }, [docs]);

  // Build category list = known order + any dynamic categories discovered in data
  const allCategoryDefs = useMemo(() => {
    const discovered = Array.from(new Set(docs.map((d) => d.category)));
    const dynamic = discovered
      .filter((k) => !CATEGORY_DEFS.some((c) => c.key === k))
      .map((k) => ({ key: k, label: labelFromKey(k) }));
    return [...CATEGORY_DEFS, ...dynamic];
  }, [docs]);

  // Derived filtered list
  const filtered = useMemo(() => {
    let list = docs;
    if (showRecent) {
      // ignore selection; just use full list
    } else if (selected.length > 0) {
      const setSel = new Set(selected);
      list = list.filter((d) => setSel.has(d.category));
    } else {
      // No categories selected → show nothing by default
      list = [];
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((d) => d.title.toLowerCase().includes(q));
    }
    // Newest first by date
    return [...list].sort((a, b) => {
      const at = a.date ? new Date(a.date).getTime() : 0;
      const bt = b.date ? new Date(b.date).getTime() : 0;
      return bt - at;
    });
  }, [docs, selected, query, showRecent]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  useEffect(() => {
    // Reset page if filters/search change
    setPage(1);
  }, [selected, query, showRecent]);

  const toggleCategory = (key: string) => {
    setSelected((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  const clearAll = () => {
    setSelected([]);
    setShowRecent(false);
    setQuery("");
    setPage(1);
  };
  const selectAll = () => {
    const keys = allCategoryDefs.map((c) => c.key).filter((k) => (counts[k] ?? 0) > 0);
    setSelected(keys);
  };

  return (
    <div className="min-h-screen pb-16 bg-neutral-50">
      <div className="container mx-auto px-4 md:px-6">
        <header className="pt-6">
          <HeroWelcome
            name={null}
            subtitle="Browse lodge documents and minutes."
            nextMeetingText={nextMeetingText}
            hint="Press / to search • Ctrl/Cmd+K for actions"
            emphasis="strong"
            showBeta
            countdownDays={nextMeetingDays}
          />
          <div className="flex items-center justify-end">
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 px-3 py-2 rounded bg-primary-600 text-white hover:bg-primary-700"
            >
              <LogIn className="w-4 h-4" /> Admin Login
            </Link>
          </div>
        </header>

        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6 text-yellow-800">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar: Categories */}
          <aside className="lg:col-span-1">
            <div className="bg-[#BFA76F]/10 border border-[#BFA76F] rounded-lg p-4 sticky top-4">
              <div className="mb-3">
                <h2 className="text-lg font-semibold text-primary-800">Document Categories</h2>
                <p className="text-xs text-neutral-700">Pick one or more to view</p>
                <div className="mt-3 flex items-center gap-3 flex-wrap">
                  <button
                    type="button"
                    onClick={selectAll}
                    title="Select all categories with documents"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#BFA76F] bg-[#BFA76F]/20 text-[#0B1831] hover:bg-[#BFA76F]/30 focus:outline-none focus:ring-2 focus:ring-[#BFA76F] text-sm font-semibold shadow-sm"
                  >
                    Select all
                  </button>
                  <button
                    type="button"
                    onClick={clearAll}
                    title="Clear all selected categories"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#BFA76F] bg-white text-[#0B1831] hover:bg-[#BFA76F]/10 focus:outline-none focus:ring-2 focus:ring-[#BFA76F] text-sm font-semibold shadow-sm"
                  >
                    Clear all
                  </button>
                </div>
              </div>

              <ul className="space-y-2">
                {allCategoryDefs.map((cat) => {
                  const isSel = selected.includes(cat.key);
                  const count = counts[cat.key] ?? 0;
                  const disabled = count <= 0;
                  return (
                    <li key={cat.key}>
                      <button
                        type="button"
                        onClick={() => !disabled && toggleCategory(cat.key)}
                        title={disabled ? "No documents yet" : undefined}
                        aria-disabled={disabled}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded border transition focus:outline-none focus:ring-2 focus:ring-[#BFA76F] ${
                          isSel
                            ? "bg-[#BFA76F]/20 border-[#BFA76F] text-[#0B1831]"
                            : disabled
                            ? "bg-white border-[#BFA76F]/40 opacity-60 cursor-not-allowed"
                            : "bg-[#BFA76F]/10 border-[#BFA76F] hover:bg-[#BFA76F]/20"
                        }`}
                        aria-pressed={isSel}
                      >
                        <span className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-[#0B1831]" />
                          <span className="text-sm text-[#0B1831]">{cat.label}</span>
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded border border-[#BFA76F] ${
                            isSel ? "bg-[#BFA76F]/40" : "bg-[#BFA76F]/25"
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>

          {/* Main: Document browser */}
          <main className="lg:col-span-3">
            {/* Quick Actions moved here to keep visible and avoid sidebar overlap */}
            <section className="mb-4">
              <h2 className="text-lg font-semibold text-primary-800 mb-2">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <QuickActionTile
                  to="/members/profile"
                  title="Profile & Settings"
                  subtitle="Update your details"
                  Icon={Settings}
                />
                <QuickActionTile to="/events" title="Events Calendar" subtitle="What’s coming up" Icon={Calendar} />
                <QuickActionTile
                  to="/members/directory"
                  title="Member Directory"
                  subtitle="Find and connect"
                  Icon={Users}
                />
              </div>
            </section>

            <div className="bg-white border border-[#BFA76F] rounded-lg">
              <div className="p-4 border-b border-[#BFA76F] bg-[#BFA76F]/10 flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#0B1831] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search within selection…"
                    aria-label="Search documents within selected categories"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded border border-[#BFA76F] focus:outline-none focus:ring-2 focus:ring-[#BFA76F]"
                  />
                </div>
              </div>

              {/* Selected category chips and results count */}
              <div className="px-4 pt-3 pb-2 flex items-center justify-between flex-wrap gap-3" aria-live="polite">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setShowRecent((v) => !v)}
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${
                      showRecent
                        ? "bg-[#BFA76F]/40 border-[#BFA76F] text-[#0B1831]"
                        : "bg-[#BFA76F]/25 border-[#BFA76F] text-[#0B1831]"
                    }`}
                    aria-pressed={showRecent}
                    title="Show the latest items across all categories"
                  >
                    Recent
                  </button>
                  {selected.map((k) => (
                    <span
                      key={k}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#BFA76F]/25 text-[#0B1831] text-xs border border-[#BFA76F]"
                    >
                      {labelFromKey(k)}
                      <button
                        type="button"
                        onClick={() => toggleCategory(k)}
                        className="ml-1 rounded hover:bg-[#BFA76F]/40 p-0.5 focus:outline-none focus:ring-2 focus:ring-[#BFA76F]"
                        aria-label={`Remove ${labelFromKey(k)}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                {(selected.length > 0 || showRecent) && (
                  <div className="text-xs text-neutral-800">
                    {filtered.length} result{filtered.length === 1 ? "" : "s"}
                  </div>
                )}
              </div>

              {loading ? (
                <div className="p-8 text-center text-neutral-800">Loading documents…</div>
              ) : !showRecent && selected.length === 0 ? (
                <div className="p-12 text-center text-neutral-800">
                  <div className="text-lg font-semibold text-neutral-900 mb-1">Document Browser</div>
                  <div className="text-sm text-neutral-800 mb-4">
                    Select one or more categories from the left to load items.
                  </div>
                  <button
                    type="button"
                    onClick={selectAll}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-neutral-300 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-secondary-400 text-sm"
                  >
                    Show all recent
                  </button>
                </div>
              ) : pageItems.length === 0 ? (
                <div className="p-8 text-center text-neutral-800">No documents match your selection.</div>
              ) : (
                <div className="">
                  {pageItems.map((d) => (
                    <div
                      key={`${d.source}:${d.id}`}
                      className="group p-4 flex items-center justify-between gap-4 rounded-xl border border-[#BFA76F] bg-white hover:bg-[#BFA76F]/10 transition shadow-sm hover:shadow-md focus-within:ring-2 focus-within:ring-[#BFA76F] mx-3 my-2"
                    >
                      <div className="min-w-0">
                        <div className="font-medium text-[#0B1831] truncate">{d.title}</div>
                        <div className="text-xs text-[#0B1831] opacity-90">
                          {CATEGORY_DEFS.find((c) => c.key === d.category)?.label || d.rawCategory}
                          {d.date ? ` • ${formatDate(d.date)}` : ""}
                        </div>
                      </div>
                      <a
                        href={d.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm px-3 py-1.5 rounded bg-[#BFA76F] text-[#0B1831] hover:bg-[#BFA76F]/80 border border-[#BFA76F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BFA76F]"
                      >
                        Open
                      </a>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {(selected.length > 0 || showRecent) && filtered.length > 0 && (
                <div className="p-4 border-t border-[#BFA76F] flex items-center justify-between text-sm">
                  <div>
                    Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of{" "}
                    {filtered.length}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className="px-3 py-1.5 rounded border border-[#BFA76F] disabled:opacity-50"
                    >
                      Prev
                    </button>
                    <span>
                      Page {page} / {totalPages}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
                      className="px-3 py-1.5 rounded border border-[#BFA76F] disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
