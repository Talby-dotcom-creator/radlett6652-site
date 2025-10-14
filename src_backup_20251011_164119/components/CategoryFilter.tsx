import { useState, useMemo, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import Button from "./Button";

export interface CategoryFilterProps<T extends {
  title: string;
  content?: string | null;
  summary?: string | null;
  publish_date?: string | null;
  tags?: string[] | null;
}> {
  items: T[];
  onFilter: (filtered: T[]) => void;
}

const CategoryFilter = <T extends {
  title: string;
  content?: string | null;
  summary?: string | null;
  publish_date?: string | null;
  tags?: string[] | null;
}>({ items, onFilter }: CategoryFilterProps<T>) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");

  // Extract years safely
  const availableYears = useMemo(() => {
    return [...new Set(
      items
        .map(i =>
          i.publish_date
            ? new Date(i.publish_date).getFullYear().toString()
            : undefined
        )
        .filter((y): y is string => Boolean(y)) // ✅ ensures only strings
    )].sort((a, b) => parseInt(b) - parseInt(a));
  }, [items]);

  const availableTags = useMemo(() => {
    return [...new Set(
      items.flatMap(i => (Array.isArray(i.tags) ? i.tags : []))
    )].sort();
  }, [items]);

  // Apply filters
  const filtered = useMemo(() => {
    return items.filter(i => {
      const text = `${i.title} ${i.summary ?? ""} ${i.content ?? ""}`.toLowerCase();
      const matchesSearch = !searchTerm || text.includes(searchTerm.toLowerCase());

      const year = i.publish_date
        ? new Date(i.publish_date).getFullYear().toString()
        : undefined;
      const matchesYear = selectedYear === "all" || year === selectedYear;

      const matchesTag =
        selectedTag === "all" || (Array.isArray(i.tags) && i.tags.includes(selectedTag));

      return matchesSearch && matchesYear && matchesTag;
    });
  }, [items, searchTerm, selectedYear, selectedTag]);

  // Push results up to parent
  useEffect(() => {
    onFilter(filtered);
  }, [filtered, onFilter]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedYear("all");
    setSelectedTag("all");
  };

  return (
    <div className="bg-neutral-50 rounded-lg p-6 mb-8 shadow-soft">
      {/* Search */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-primary-600 mb-2">
          Search
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by title or content..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pr-10 border border-neutral-300 rounded-md focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
        </div>
      </div>

      {/* Year + Tag filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Year Filter */}
        <div>
          <label className="block text-sm font-medium text-primary-600 mb-2">Year</label>
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
          >
            <option value="all">All Years</option>
            {availableYears.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Tag Filter */}
        <div>
          <label className="block text-sm font-medium text-primary-600 mb-2">Topic</label>
          <select
            value={selectedTag}
            onChange={e => setSelectedTag(e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
          >
            <option value="all">All Topics</option>
            {availableTags.map(tag => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active filters + clear button */}
      {(searchTerm || selectedYear !== "all" || selectedTag !== "all") && (
        <div className="mt-4 pt-4 border-t border-neutral-200 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm">
            <Filter size={16} className="text-secondary-500" />
            {searchTerm && <span>Search: "{searchTerm}"</span>}
            {selectedYear !== "all" && <span>Year: {selectedYear}</span>}
            {selectedTag !== "all" && <span>Topic: {selectedTag}</span>}
          </div>
          <Button variant="outline" size="sm" onClick={clearFilters}>Clear</Button>
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;
