import React from "react";
import {
  X,
  BookOpen,
  Star,
  Calendar,
  Bookmark,
  Clock,
  CheckCircle,
  Heart,
  Edit3,
} from "lucide-react";
import { Book } from "@/lib/mockData";

interface NotesDrawerProps {
  book: Book | null;
  onClose: () => void;
  onEdit: (book: Book) => void;
}

export const NotesDrawer: React.FC<NotesDrawerProps> = ({
  book,
  onClose,
  onEdit,
}) => {
  if (!book) return null;

  const statusLabel = {
    WANT_TO_READ: "Want to Read 📖",
    READING: "Currently Reading 📘",
    COMPLETED: "Completed Reading ✅",
  }[book.status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1816]/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#FAF8F5] border border-[#E5DFC9] rounded-3xl shadow-2xl w-full max-w-lg p-6 sm:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-[#8C8275] hover:text-[#2D2A26] hover:bg-[#EFE8DC] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="inline-block px-2.5 py-1 rounded-lg bg-[#EFE8DC] text-[#655848] text-xs font-semibold mb-2">
            {statusLabel}
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D2A26]">
            {book.title}
          </h2>
          <p className="text-sm font-medium text-[#756C60]">by {book.author}</p>
        </div>

        {/* Details Pill */}
        <div className="grid grid-cols-2 gap-3 mb-6 bg-[#F6F2EB] p-3.5 rounded-2xl text-xs text-[#524B42]">
          <div>
            <span className="text-[#8C8275] block uppercase tracking-wider text-[10px]">
              Published
            </span>
            <span className="font-mono font-semibold">
              {book.publishYear || "N/A"}
            </span>
          </div>
          <div>
            <span className="text-[#8C8275] block uppercase tracking-wider text-[10px]">
              Page Length
            </span>
            <span className="font-mono font-semibold">
              {book.pageCount ? `${book.pageCount} pages` : "N/A"}
            </span>
          </div>
          {book.rating && (
            <div>
              <span className="text-[#8C8275] block uppercase tracking-wider text-[10px]">
                Rating
              </span>
              <div className="flex items-center gap-1 text-[#D97706] font-bold">
                <Star className="w-3.5 h-3.5 fill-[#D97706]" />
                <span>{book.rating} / 5</span>
              </div>
            </div>
          )}
          <div>
            <span className="text-[#8C8275] block uppercase tracking-wider text-[10px]">
              Added On
            </span>
            <span className="font-mono">
              {new Date(book.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Notes Content */}
        <div className="mb-6">
          <h3 className="text-xs uppercase tracking-widest font-bold text-[#8C8275] mb-2">
            Reader Reflections & Notes
          </h3>
          <div className="p-4 bg-[#FBF9F6] border border-[#E5DFC9] rounded-2xl text-sm text-[#2D2A26] leading-relaxed italic font-serif">
            {book.notes
              ? `"${book.notes}"`
              : "No personal notes recorded yet for this volume."}
          </div>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-1.5 flex-wrap mb-6">
          {book.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-lg bg-[#EFE8DC] text-[#655848] text-xs font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-[#EBE5DA]">
          <button
            onClick={() => {
              onClose();
              onEdit(book);
            }}
            className="px-4 py-2 bg-[#2D2A26] hover:bg-[#1A1816] text-[#FBF9F6] rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Record</span>
          </button>
        </div>
      </div>
    </div>
  );
};
