import React from "react";
import {
  Search,
  X,
  Tag,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Sparkles,
} from "lucide-react";

interface BookFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string; // 'ALL' | BookStatus
  onStatusChange: (status: string) => void;
  selectedTag: string | null;
  onTagSelect: (tag: string | null) => void;
  availableTags: string[];
  sortBy: "RECENT" | "TITLE" | "AUTHOR" | "RATING";
  onSortChange: (sort: "RECENT" | "TITLE" | "AUTHOR" | "RATING") => void;
  viewMode: "GRID" | "LIST";
  onViewModeChange: (mode: "GRID" | "LIST") => void;
  favoritesOnly: boolean;
  onToggleFavorites: () => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export const BookFilters: React.FC<BookFiltersProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  selectedTag,
  onTagSelect,
  availableTags,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  favoritesOnly,
  onToggleFavorites,
  onResetFilters,
  hasActiveFilters,
}) => {
  const statusOptions = [
    { id: "ALL", label: "All Books", icon: "📚" },
    { id: "WANT_TO_READ", label: "Want to Read", icon: "📖" },
    { id: "READING", label: "Reading", icon: "📘" },
    { id: "COMPLETED", label: "Completed", icon: "✅" },
  ];

  return (
    <div className="bg-[#FAF8F5] border border-[#EBE5DA] rounded-2xl p-4 sm:p-5 mb-8 shadow-xs space-y-4">
      {/* Search Bar & View Mode Controls */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C8275]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title, author, or notes..."
            className="w-full pl-10 pr-10 py-2.5 bg-[#FBF9F6] border border-[#E5DFC9] rounded-xl text-sm text-[#2D2A26] placeholder-[#A39B8E] focus:outline-none focus:ring-2 focus:ring-[#2D2A26]/20 focus:border-[#2D2A26] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8C8275] hover:text-[#2D2A26]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort & Layout Controls */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
          {/* Favorites Filter Button */}
          <button
            onClick={onToggleFavorites}
            className={`px-3 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              favoritesOnly
                ? "bg-[#FEF3C7] border-[#FCD34D] text-[#92400E] shadow-2xs"
                : "bg-[#FBF9F6] border-[#E5DFC9] text-[#655848] hover:bg-[#F3EDE2]"
            }`}
          >
            <span>{favoritesOnly ? "★ Favorites Only" : "☆ Favorites"}</span>
          </button>

          {/* Sort Selector */}
          <div className="relative flex items-center gap-1.5 bg-[#FBF9F6] border border-[#E5DFC9] px-3 py-1.5 rounded-xl text-xs font-medium text-[#524B42]">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#8C8275]" />
            <span className="text-[#8C8275] hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as any)}
              className="bg-transparent border-none text-xs font-semibold text-[#2D2A26] focus:outline-none cursor-pointer"
            >
              <option value="RECENT">Recently Added</option>
              <option value="TITLE">Title (A-Z)</option>
              <option value="AUTHOR">Author (A-Z)</option>
              <option value="RATING">Highest Rated</option>
            </select>
          </div>

          {/* Grid vs List View Mode Toggle */}
          <div className="flex bg-[#EFE8DC] p-1 rounded-xl">
            <button
              onClick={() => onViewModeChange("GRID")}
              title="Grid View"
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === "GRID"
                  ? "bg-[#FBF9F6] text-[#2D2A26] shadow-xs"
                  : "text-[#8C8275] hover:text-[#2D2A26]"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange("LIST")}
              title="List View"
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === "LIST"
                  ? "bg-[#FBF9F6] text-[#2D2A26] shadow-xs"
                  : "text-[#8C8275] hover:text-[#2D2A26]"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {statusOptions.map((tab) => {
          const isActive = statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onStatusChange(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? "bg-[#2D2A26] text-[#FBF9F6] shadow-2xs"
                  : "bg-[#FBF9F6] border border-[#E5DFC9] text-[#655848] hover:bg-[#F3EDE2] hover:text-[#2D2A26]"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}

        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="ml-auto px-3 py-2 text-xs font-semibold text-[#9B1C1C] hover:bg-[#FDF2F2] rounded-xl flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      {/* Tag Pills */}
      {availableTags.length > 0 && (
        <div className="pt-2 border-t border-[#EBE5DA] flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
          <span className="text-[#8C8275] font-medium flex items-center gap-1 shrink-0">
            <Tag className="w-3.5 h-3.5" />
            <span>Tags:</span>
          </span>

          <button
            onClick={() => onTagSelect(null)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all shrink-0 cursor-pointer ${
              selectedTag === null
                ? "bg-[#655848] text-[#FBF9F6]"
                : "bg-[#EFE8DC] text-[#655848] hover:bg-[#E2DACB]"
            }`}
          >
            All Tags
          </button>

          {availableTags.map((tag) => {
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => onTagSelect(isSelected ? null : tag)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-[#2D2A26] text-[#FBF9F6]"
                    : "bg-[#EFE8DC]/80 text-[#655848] hover:bg-[#E2DACB] hover:text-[#2D2A26]"
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
