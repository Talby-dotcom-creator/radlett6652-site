// src/pages/MembersPage.tsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { optimizedApi as api } from "../lib/optimizedApi";
import { LodgeDocument, MemberProfile, MeetingMinutes } from "../types";
import Button from "../components/Button";
import LoadingSpinner from "../components/LoadingSpinner";
import VirtualizedList from "../components/VirtualizedList";
import PaginationControls from "../components/PaginationControls";
import DashboardCard from "../components/DashboardCard";
import ProfileSummaryCard from "../components/dashboard/ProfileSummaryCard";
import RecentDocumentsCard from "../components/dashboard/RecentDocumentsCard";
import QuickActionCard from "../components/dashboard/QuickActionCard";
import {
  FileText,
  Clock,
  Users,
  AlertTriangle,
  BookOpen,
  ScrollText,
  Archive,
  LogOut,
  Search,
  X,
  ExternalLink,
  Settings,
  Calendar,
} from "lucide-react";

/* ---------------- CATEGORY CONFIG ---------------- */

// Sidebar categories & labels
const DOCUMENT_CATEGORIES = [
  { key: "grand_lodge", label: "Grand Lodge Communications", icon: FileText },
  { key: "provincial", label: "Provincial Communications", icon: FileText },
  { key: "summons", label: "Summons", icon: ScrollText },
  { key: "minutes", label: "Meeting Minutes", icon: Clock },
  { key: "gpc_minutes", label: "GPC Minutes", icon: Clock },
  { key: "lodge_instruction", label: "Lodge of Instruction", icon: BookOpen },
  { key: "resources", label: "Resources", icon: Archive },
  { key: "solomon", label: "Solomon", icon: BookOpen },
  { key: "bylaws", label: "Bylaws", icon: FileText },
  { key: "forms", label: "Forms", icon: FileText },
  { key: "ritual", label: "Ritual", icon: BookOpen },
  { key: "other", label: "Other", icon: FileText },
];

// Keys used in the sidebar → valid canonical categories from DB/API
const CATEGORY_MAP: Record<string, string[]> = {
  grand_lodge: ["grand_lodge"],
  provincial: ["provincial"],
  summons: ["summons"],
  minutes: ["minutes"], // we've normalised all variants to "minutes" in optimizedApi
  gpc_minutes: ["gpc_minutes"],
  lodge_instruction: ["lodge_instruction"],
  resources: ["resources"],
  solomon: ["solomon"],
  bylaws: ["bylaws"],
  forms: ["forms"],
  ritual: ["ritual"],
  other: ["other"],
};

// Local normaliser (belt and braces)
const normaliseCategory = (c: string | null | undefined): string => {
  if (!c) return "";
  return c
    .toLowerCase()
    .trim()
    .replace(/[\s-]+/g, "_");
};

const membersDocMatchesCategory = (
  doc: LodgeDocument,
  categoryKey: string
): boolean => {
  const allowed = CATEGORY_MAP[categoryKey] ?? [categoryKey];
  const cat = normaliseCategory((doc as any).category);
  return allowed.includes(cat);
};

const MONTH_MAP: Record<string, number> = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
};

const normaliseYear = (value: string): number => {
  let year = parseInt(value, 10);
  if (Number.isNaN(year)) return 0;
  if (year < 100) {
    year += year >= 50 ? 1900 : 2000;
  }
  return year;
};

const buildTimestamp = (year: number, month: number, day: number): number => {
  const date = new Date(year, month, day);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
};

const parseDateFromText = (text?: string | null): number => {
  if (!text) return 0;
  const cleaned = text.replace(/(\d)(st|nd|rd|th)/gi, "$1");

  const iso = cleaned.match(/(\d{4})[\/\-.](\d{1,2})[\/\-.](\d{1,2})/);
  if (iso) {
    return buildTimestamp(
      normaliseYear(iso[1]),
      parseInt(iso[2], 10) - 1,
      parseInt(iso[3], 10)
    );
  }

  const dmy = cleaned.match(/(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})/);
  if (dmy) {
    return buildTimestamp(
      normaliseYear(dmy[3]),
      parseInt(dmy[2], 10) - 1,
      parseInt(dmy[1], 10)
    );
  }

  const dayMonthName = cleaned.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{2,4})/i);
  if (dayMonthName) {
    const month = MONTH_MAP[dayMonthName[2].toLowerCase()] ?? -1;
    if (month >= 0) {
      return buildTimestamp(
        normaliseYear(dayMonthName[3]),
        month,
        parseInt(dayMonthName[1], 10)
      );
    }
  }

  const monthNameDay = cleaned.match(
    /([A-Za-z]+)\s+(\d{1,2})(?:,)?\s+(\d{2,4})/i
  );
  if (monthNameDay) {
    const month = MONTH_MAP[monthNameDay[1].toLowerCase()] ?? -1;
    if (month >= 0) {
      return buildTimestamp(
        normaliseYear(monthNameDay[3]),
        month,
        parseInt(monthNameDay[2], 10)
      );
    }
  }

  return 0;
};

const getDocumentRecency = (doc: LodgeDocument): number => {
  const explicitDate =
    ((doc as any).document_date as string | undefined) ??
    doc.created_at ??
    doc.updated_at;
  const parsedFromText = parseDateFromText(
    `${doc.title ?? ""} ${((doc as any).description ?? "").toString()}`
  );
  if (parsedFromText) return parsedFromText;
  return explicitDate ? new Date(explicitDate).getTime() : 0;
};

/* ---------------- COMPONENT ---------------- */

const MembersPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    user,
    isAdmin,
    signOut,
    profile: userProfile,
    loading: authLoading,
    needsPasswordReset,
  } = useAuth();

  // Basic state
  const [allDocuments, setAllDocuments] = useState<LodgeDocument[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Filtering state
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categoriesInitialized, setCategoriesInitialized] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  /* ---------------- AUTH REDIRECTS ---------------- */

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", { replace: true });
      return;
    }

    if (!authLoading && user && userProfile?.status === "pending") {
      navigate("/members/pending", { replace: true });
      return;
    }

    if (!authLoading && user && needsPasswordReset) {
      navigate("/password-reset", { replace: true });
      return;
    }
  }, [authLoading, user, userProfile?.status, needsPasswordReset, navigate]);

  /* ---------------- LOAD DATA ---------------- */

  useEffect(() => {
    if (!user || authLoading || dataLoaded) return;

    const loadData = async () => {
      try {
        setError(null);
        setDataLoading(true);

        const [resources, minutes, lodgeDocs] = await Promise.all([
          api.getMemberResources(),
          api.getMeetingMinutes(),
          api.getLodgeDocuments(),
        ]);

        // Map meeting_minutes to LodgeDocument format
        const minuteDocs: LodgeDocument[] = (minutes ?? [])
          .filter((minute: MeetingMinutes) => minute.file_url)
          .map((minute: MeetingMinutes) => {
            const readableDate = minute.meeting_date
              ? new Date(minute.meeting_date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : null;
            return {
              id: `minutes-${minute.id}`,
              title:
                minute.title ||
                (readableDate
                  ? `Meeting Minutes - ${readableDate}`
                  : "Meeting Minutes"),
              category: "minutes",
              description: readableDate
                ? `Meeting minutes for ${readableDate}`
                : "Meeting minutes",
              file_url: minute.file_url || "",
              created_at: minute.created_at ?? minute.meeting_date ?? undefined,
              updated_at: minute.updated_at ?? minute.meeting_date ?? undefined,
            };
          });

        // Combine all document sources
        const combinedDocs = [
          ...(lodgeDocs ?? []),
          ...(resources ?? []),
          ...minuteDocs,
        ];

        // Extra safety: normalise categories again on the client
        const normalisedDocs = combinedDocs.map((d: any) => ({
          ...d,
          category: normaliseCategory(d.category),
        }));

        setAllDocuments(normalisedDocs);
      } catch (err) {
        console.error("Error loading member documents:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load member data"
        );
      } finally {
        setDataLoading(false);
        setDataLoaded(true);
      }
    };

    const timer = setTimeout(() => loadData(), 100);
    return () => clearTimeout(timer);
  }, [user, authLoading, dataLoaded]);

  /* ---------------- INITIAL CATEGORY SELECTION ---------------- */

  const categoryRecency = useMemo(() => {
    const map: Record<string, number> = {};
    allDocuments.forEach((doc) => {
      const timestamp = getDocumentRecency(doc);
      Object.keys(CATEGORY_MAP).forEach((key) => {
        if (membersDocMatchesCategory(doc, key)) {
          map[key] = Math.max(map[key] ?? 0, timestamp);
        }
      });
    });
    return map;
  }, [allDocuments]);

  const sortedDocumentCategories = useMemo(() => {
    const baseOrder = DOCUMENT_CATEGORIES.reduce<Record<string, number>>(
      (acc, cat, index) => {
        acc[cat.key] = index;
        return acc;
      },
      {}
    );
    return [...DOCUMENT_CATEGORIES].sort((a, b) => {
      const aTime = categoryRecency[a.key] ?? 0;
      const bTime = categoryRecency[b.key] ?? 0;
      if (bTime !== aTime) return bTime - aTime;
      return (baseOrder[a.key] ?? 0) - (baseOrder[b.key] ?? 0);
    });
  }, [categoryRecency]);

  useEffect(() => {
    if (categoriesInitialized || allDocuments.length === 0) return;

    const categoriesWithDocs = sortedDocumentCategories
      .map((c) => c.key)
      .filter((key) =>
        allDocuments.some((doc) => membersDocMatchesCategory(doc, key))
      );

    setSelectedCategories(
      categoriesWithDocs.length ? categoriesWithDocs : ["summons"]
    );
    setCategoriesInitialized(true);
  }, [allDocuments, categoriesInitialized, sortedDocumentCategories]);

  /* ---------------- HELPERS ---------------- */

  const getCategoryCount = (categoryKey: string) => {
    return allDocuments.filter((doc) =>
      membersDocMatchesCategory(doc, categoryKey)
    ).length;
  };

  const getTextForSearch = (d: LodgeDocument) => {
    const title = (d.title ?? "").toString();
    const desc = ((d as any).description ?? "").toString();
    return `${title} ${desc}`;
  };

  const getTimestamp = (d: LodgeDocument) => {
    const parsedFromText = parseDateFromText(
      `${d.title ?? ""} ${(d as any).description ?? ""} ${
        (d as any).summary ?? ""
      }`
    );
    if (parsedFromText) return parsedFromText;

    const source = ((d as any).document_date ??
      d.created_at ??
      (d as any).updated_at) as string | undefined;
    return source ? new Date(source).getTime() : 0;
  };

  /* ---------------- FILTER + PAGINATION ---------------- */

  const filteredAndPaginatedDocuments = useMemo(() => {
    if (selectedCategories.length === 0) {
      return { documents: [] as LodgeDocument[], total: 0, totalPages: 0 };
    }

    let docs = allDocuments.filter((doc) =>
      selectedCategories.some((categoryKey) =>
        membersDocMatchesCategory(doc, categoryKey)
      )
    );

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      docs = docs.filter((doc) => {
        const title = (doc.title ?? "").toLowerCase();
        const text = getTextForSearch(doc).toLowerCase();
        return title.includes(search) || text.includes(search);
      });
    }

    docs.sort((a, b) => {
      const ta = getTimestamp(a);
      const tb = getTimestamp(b);
      return tb - ta;
    });

    const total = docs.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const documents = docs.slice(start, end);

    return { documents, total, totalPages };
  }, [selectedCategories, allDocuments, searchTerm, currentPage, pageSize]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategories, searchTerm]);

  /* ---------------- EVENT HANDLERS ---------------- */

  const handleSignOut = async () => {
    try {
      setError(null);
      setIsSigningOut(true);
      await signOut();
    } catch (err) {
      console.error("Error signing out:", err);
      setError("Failed to sign out. Please try again.");
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleCategoryToggle = (
    categoryKey: string,
    additive: boolean = false
  ) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryKey)) {
        if (prev.length === 1) return prev; // don't deselect the last one
        return prev.filter((c) => c !== categoryKey);
      } else {
        if (additive) return [...prev, categoryKey];
        return [categoryKey];
      }
    });
  };

  const handleClearAllCategories = () => {
    setSelectedCategories([]);
    setSearchTerm("");
    setCategoriesInitialized(true);
  };

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  /* ---------------- DOCUMENT ROW ---------------- */

  const DocumentRow = ({
    index,
    style,
    data,
  }: {
    index: number;
    style: React.CSSProperties;
    data: LodgeDocument[];
  }) => {
    const doc = data[index];

    const categoryLabel = (() => {
      const cat = normaliseCategory((doc as any).category);
      const entry = DOCUMENT_CATEGORIES.find((c) =>
        (CATEGORY_MAP[c.key] ?? [c.key]).includes(cat)
      );
      return (entry?.label ?? (cat || "Document")).toUpperCase();
    })();

    const url =
      (doc as any).file_url || (doc as any).url || (doc as any).document_url;

    return (
      <div style={style} className="px-4">
        <div className="bg-white rounded-lg border border-neutral-200 p-4 flex items-center justify-between hover:shadow-soft transition-shadow">
          <div className="flex-grow">
            <h3 className="font-medium text-primary-600">
              {doc.title || "Untitled document"}
            </h3>

            {(doc as any).description && (
              <p className="text-sm text-neutral-600 mt-1 line-clamp-2">
                {(doc as any).description}
              </p>
            )}

            <div className="flex items-center mt-2">
              <span className="text-xs font-medium bg-neutral-100 text-neutral-600 px-2 py-1 rounded">
                {categoryLabel}
              </span>
              <span className="text-xs text-neutral-500 ml-4">
                Added{" "}
                {doc.created_at
                  ? new Date(doc.created_at as any).toLocaleDateString("en-GB")
                  : "Unknown"}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 ml-4">
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-neutral-500 hover:text-primary-600 transition-colors"
                title="Open document"
              >
                <ExternalLink size={18} />
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };

  /* ---------------- LOADING GUARDS ---------------- */

  if (authLoading) {
    return (
      <div className="min-h-screen pt-28 pb-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 text-center pt-12">
          <LoadingSpinner subtle />
        </div>
      </div>
    );
  }

  if (user && dataLoading) {
    return (
      <div className="min-h-screen pt-28 pb-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 text-center pt-12">
          <LoadingSpinner subtle />
        </div>
      </div>
    );
  }

  if (!user) return null;

  /* ---------------- RENDER ---------------- */

  return (
    <div className="min-h-screen pb-20 bg-neutral-50">
      <div className="container mx-auto px-4 md:px-6">
        {/* Error Notice */}
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <h3 className="font-medium text-yellow-800 mb-1">Notice</h3>
                <p className="text-yellow-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar: Document Categories */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-soft p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-heading font-semibold text-primary-600">
                    Document Categories
                  </h2>
                  <p className="text-sm text-neutral-500">
                    Select categories to view
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="flex items-center"
                >
                  <LogOut size={16} className="mr-2" />
                  {isSigningOut ? "Signing Out..." : "Sign Out"}
                </Button>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-neutral-500 mb-3">
                  Click to select. Hold Ctrl/Cmd to select multiple.
                </p>

                {sortedDocumentCategories.map((category) => {
                  const count = getCategoryCount(category.key);
                  const IconComponent = category.icon;
                  const isSelected = selectedCategories.includes(category.key);

                  return (
                    <label
                      key={category.key}
                      className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? "border-secondary-500 bg-secondary-50"
                          : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleCategoryToggle(
                          category.key,
                          e.ctrlKey || e.metaKey
                        );
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="sr-only"
                      />
                      <div
                        className={`w-4 h-4 rounded border-2 mr-3 flex items-center justify-center ${
                          isSelected
                            ? "border-secondary-500 bg-secondary-500"
                            : "border-neutral-300"
                        }`}
                      >
                        {isSelected && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <IconComponent
                        size={16}
                        className="text-neutral-500 mr-2"
                      />
                      <div className="flex-grow">
                        <span className="text-sm font-medium text-neutral-700">
                          {category.label}
                        </span>
                        <span className="text-xs text-neutral-500 ml-2">
                          ({count})
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>

              {selectedCategories.length > 0 && (
                <div className="mt-6 pt-4 border-t border-neutral-200">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearAllCategories}
                    className="w-full flex items-center justify-center"
                  >
                    <X size={16} className="mr-2" />
                    Clear All Selections
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3">
            {/* Overview cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
              <ProfileSummaryCard
                profile={userProfile as MemberProfile | null}
                userEmail={user?.email ?? undefined}
              />

              <RecentDocumentsCard
                documents={allDocuments}
                onViewAllDocuments={() =>
                  setSelectedCategories([
                    "grand_lodge",
                    "provincial",
                    "summons",
                    "resources",
                  ])
                }
              />

              <section className="md:col-span-2 lg:col-span-2">
                <h2 className="text-xl font-semibold text-primary-700 mb-3">
                  Quick Actions
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <QuickActionCard
                    icon={<Settings className="w-5 h-5 text-white" />}
                    label="Update Profile"
                    description="Review and update your membership details"
                    onClick={() => navigate("/members/profile")}
                  />

                  <QuickActionCard
                    icon={<Users className="w-5 h-5 text-white" />}
                    label="Member Directory"
                    description="Find and connect with lodge members"
                    onClick={() => navigate("/members/directory")}
                  />

                  <QuickActionCard
                    icon={<Calendar className="w-5 h-5 text-white" />}
                    label="Lodge Calendar"
                    description="View meetings and lodge events"
                    onClick={() => navigate("/events")}
                  />

                  <QuickActionCard
                    icon={<BookOpen className="w-5 h-5 text-white" />}
                    label="Meeting Minutes"
                    description="View past minutes from lodge meetings"
                    onClick={() => navigate("/members/meeting-minutes")}
                  />

                  {(isAdmin || userProfile?.role === "admin") && (
                    <QuickActionCard
                      icon={<Settings className="w-5 h-5 text-[#0B1831]" />}
                      label="Admin Dashboard"
                      description="Manage lodge content and administration"
                      admin
                      onClick={() => navigate("/admin")}
                    />
                  )}
                </div>
              </section>
            </div>

            {/* Document Browser */}
            <DashboardCard
              title="Document Browser"
              icon={FileText}
              headerAction={
                selectedCategories.length > 0 && (
                  <span className="text-sm text-neutral-500">
                    {filteredAndPaginatedDocuments.total} documents found
                  </span>
                )
              }
            >
              {selectedCategories.length > 0 && (
                <div className="mb-6">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search within selected documents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 pr-10 border border-neutral-300 rounded-md focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                    />
                    <Search
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400"
                      size={20}
                    />
                  </div>
                </div>
              )}

              {selectedCategories.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-12 h-12 text-neutral-300" />
                  </div>
                  <h3 className="text-lg font-medium text-neutral-600 mb-2">
                    Select Document Categories
                  </h3>
                  <p className="text-neutral-500 max-w-md mx-auto">
                    Choose one or more categories from the left sidebar to view
                    documents. You can select multiple categories to see a
                    combined view.
                  </p>
                </div>
              ) : filteredAndPaginatedDocuments.documents.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-12 h-12 text-neutral-300" />
                  </div>
                  <h3 className="text-lg font-medium text-neutral-600 mb-2">
                    No Documents Found
                  </h3>
                  <p className="text-neutral-500 max-w-md mx-auto">
                    {searchTerm
                      ? `No documents match your search "${searchTerm}" in the selected categories.`
                      : "No documents found for your current selection. Try selecting different categories."}
                  </p>
                  {searchTerm && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSearchTerm("")}
                      className="mt-4"
                    >
                      Clear Search
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <VirtualizedList
                    items={filteredAndPaginatedDocuments.documents}
                    height={600}
                    itemHeight={120}
                    renderItem={DocumentRow}
                    className="border border-neutral-200 rounded-lg"
                  />

                  {filteredAndPaginatedDocuments.total > pageSize && (
                    <PaginationControls
                      currentPage={currentPage}
                      totalPages={filteredAndPaginatedDocuments.totalPages}
                      pageSize={pageSize}
                      totalItems={filteredAndPaginatedDocuments.total}
                      onPageChange={handlePageChange}
                      onPageSizeChange={handlePageSizeChange}
                      canGoNext={
                        currentPage < filteredAndPaginatedDocuments.totalPages
                      }
                      canGoPrev={currentPage > 1}
                      onFirstPage={() => setCurrentPage(1)}
                      onLastPage={() =>
                        setCurrentPage(filteredAndPaginatedDocuments.totalPages)
                      }
                      onNextPage={() =>
                        setCurrentPage((prev) =>
                          Math.min(
                            prev + 1,
                            filteredAndPaginatedDocuments.totalPages
                          )
                        )
                      }
                      onPrevPage={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                    />
                  )}
                </div>
              )}
            </DashboardCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembersPage;
