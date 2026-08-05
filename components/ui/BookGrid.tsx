import React from "react";
import { Book, BookStatus } from "@/lib/mockData";
import { BookCard } from "./BookCard";
import { BookOpen, RefreshCw, Plus, Search } from "lucide-react";

interface BookGridProps {
  books: Book[];
  viewMode: "GRID" | "LIST";
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: BookStatus) => void;
  onToggleFavorite: (id: string) => void;
  onOpenNotes: (book: Book) => void;
  onOpenAddModal: () => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export const BookGrid: React.FC<BookGridProps> = ({
  books,
  viewMode,
  onEdit,
  onDelete,
  onStatusChange,
  onToggleFavorite,
  onOpenNotes,
  onOpenAddModal,
  onResetFilters,
  hasActiveFilters,
}) => {
  if (books.length === 0) {
    return (
      <div className="bg-[#FAF8F5] border border-[#EBE5DA] rounded-2xl p-12 text-center my-6 max-w-2xl mx-auto shadow-2xs">
        <div className="w-16 h-16 rounded-2xl bg-[#EFE8DC] text-[#655848] flex items-center justify-center mx-auto mb-4">
          {hasActiveFilters ? (
            <Search className="w-8 h-8" />
          ) : (
            <BookOpen className="w-8 h-8" />
          )}
        </div>

        <h3 className="font-serif text-2xl font-bold text-[#2D2A26] mb-2">
          {hasActiveFilters
            ? "No matching books found"
            : "Your reading shelf is empty"}
        </h3>

        <p className="text-sm text-[#756C60] max-w-md mx-auto mb-6">
          {hasActiveFilters
            ? "Try adjusting your search query, clearing status tabs, or choosing a different tag filter."
            : "Start building your personal library by adding your first book to track."}
        </p>

        <div className="flex items-center justify-center gap-3">
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="px-4 py-2.5 bg-[#FAF8F5] hover:bg-[#EFE8DC] border border-[#E5DFC9] text-[#2D2A26] rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset All Filters</span>
            </button>
          )}

          <button
            onClick={onOpenAddModal}
            className="px-4 py-2.5 bg-[#2D2A26] hover:bg-[#1A1816] text-[#FBF9F6] rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Book</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        viewMode === "GRID"
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          : "space-y-3"
      }
    >
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          viewMode={viewMode}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          onToggleFavorite={onToggleFavorite}
          onOpenNotes={onOpenNotes}
        />
      ))}
    </div>
  );
};
