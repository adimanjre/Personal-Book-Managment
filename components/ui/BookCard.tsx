import React, { useState } from "react";
import {
  MoreVertical,
  Star,
  Edit3,
  Trash2,
  CheckCircle,
  Clock,
  Bookmark,
  BookOpen,
  Heart,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import { Book, BookStatus } from "@/lib/mockData";

interface BookCardProps {
  book: Book;
  viewMode: "GRID" | "LIST";
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: BookStatus) => void;
  onToggleFavorite: (id: string) => void;
  onOpenNotes: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  viewMode,
  onEdit,
  onDelete,
  onStatusChange,
  onToggleFavorite,
  onOpenNotes,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  // Status badge config
  const statusConfig = {
    WANT_TO_READ: {
      label: "Want to Read",
      icon: Bookmark,
      badgeBg: "bg-[#FAF6EE]",
      badgeText: "text-[#9C6B30]",
      badgeBorder: "border-[#EADCC8]",
      indicatorBg: "bg-[#D97706]",
    },
    READING: {
      label: "Reading",
      icon: Clock,
      badgeBg: "bg-[#F2F7FA]",
      badgeText: "text-[#2C5E8A]",
      badgeBorder: "border-[#D4E3EF]",
      indicatorBg: "bg-[#2563EB]",
    },
    COMPLETED: {
      label: "Completed",
      icon: CheckCircle,
      badgeBg: "bg-[#F0F7F3]",
      badgeText: "text-[#2D6A4F]",
      badgeBorder: "border-[#CCE5D8]",
      indicatorBg: "bg-[#16A34A]",
    },
  }[book.status];

  // Book cover spine accents
  const coverColorStyles = {
    slate: "bg-[#334155] text-[#F8FAFC]",
    amber: "bg-[#B45309] text-[#FEF3C7]",
    emerald: "bg-[#047857] text-[#ECFDF5]",
    indigo: "bg-[#4338CA] text-[#EEF2FF]",
    rose: "bg-[#BE123C] text-[#FFF1F2]",
    stone: "bg-[#57534E] text-[#F5F5F4]",
    terracotta: "bg-[#C2410C] text-[#FFEDD5]",
    navy: "bg-[#1E293B] text-[#F1F5F9]",
  }[book.coverColor || "stone"];

  const StatusIcon = statusConfig.icon;

  if (viewMode === "LIST") {
    return (
      <div className="bg-[#FAF8F5] border border-[#EBE5DA] hover:border-[#C8C0B0] rounded-2xl p-4 transition-all duration-200 hover:shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group relative">
        {/* Book Left Metadata */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Mini Spine */}
          <div
            className={`w-10 h-14 rounded-lg shadow-2xs ${coverColorStyles} flex flex-col justify-between p-1.5 shrink-0 select-none`}
          >
            <span className="text-[8px] font-mono tracking-tighter opacity-70">
              {book.publishYear || "2026"}
            </span>
            <div className="w-full h-1 bg-white/20 rounded-full" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {/* Status Badge */}
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${statusConfig.badgeBg} ${statusConfig.badgeText} ${statusConfig.badgeBorder}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${statusConfig.indicatorBg}`}
                />
                {statusConfig.label}
              </span>

              {/* Rating */}
              {book.rating && book.rating > 0 && (
                <div className="flex items-center text-[#D97706] text-xs">
                  <Star className="w-3 h-3 fill-[#D97706]" />
                  <span className="ml-1 text-[11px] font-medium text-[#423C35]">
                    {book.rating}.0
                  </span>
                </div>
              )}
            </div>

            <h3 className="font-serif text-lg font-bold text-[#2D2A26] truncate group-hover:text-[#000000] transition-colors">
              {book.title}
            </h3>
            <p className="text-xs text-[#756C60] truncate">
              by{" "}
              <span className="font-medium text-[#2D2A26]">{book.author}</span>
            </p>
          </div>
        </div>

        {/* Tags & Action Buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-[#EBE5DA]">
          {/* Tags */}
          <div className="hidden md:flex items-center gap-1.5 flex-wrap">
            {book.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md bg-[#EFE8DC]/80 text-[#655848] text-[11px]"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Progress if Reading */}
          {book.status === "READING" && book.pageCount && (
            <div className="text-right hidden xl:block text-xs text-[#655848]">
              <div className="font-mono text-[11px]">
                {book.pagesRead || 0} / {book.pageCount} pages
              </div>
              <div className="w-20 bg-[#E5DFC9] h-1 rounded-full mt-1">
                <div
                  className="bg-[#2C5E8A] h-1 rounded-full"
                  style={{
                    width: `${Math.round(((book.pagesRead || 0) / book.pageCount) * 100)}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Quick Action Menu */}
          <div className="flex items-center gap-1 relative">
            <button
              onClick={() => onToggleFavorite(book.id)}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                book.favorite
                  ? "text-[#D97706] bg-[#FEF3C7]"
                  : "text-[#A39B8E] hover:text-[#2D2A26] hover:bg-[#EFE8DC]"
              }`}
              title={book.favorite ? "Unfavorite" : "Mark Favorite"}
            >
              <Heart
                className={`w-4 h-4 ${book.favorite ? "fill-[#D97706]" : ""}`}
              />
            </button>

            {book.notes && (
              <button
                onClick={() => onOpenNotes(book)}
                className="p-1.5 rounded-lg text-[#655848] hover:text-[#2D2A26] hover:bg-[#EFE8DC] transition-colors cursor-pointer"
                title="View Reader Notes"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-lg text-[#756C60] hover:text-[#2D2A26] hover:bg-[#EFE8DC] transition-colors cursor-pointer"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {/* Menu Popup */}
            {showMenu && (
              <div className="absolute right-0 top-8 w-48 bg-[#FAF8F5] border border-[#E5DFC9] rounded-xl shadow-lg p-1.5 z-20 text-xs">
                <div className="px-2 py-1 text-[10px] uppercase font-bold text-[#8C8275]">
                  Quick Change Status
                </div>
                <button
                  onClick={() => {
                    onStatusChange(book.id, "WANT_TO_READ");
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-[#EFE8DC] flex items-center gap-2 text-[#655848]"
                >
                  <Bookmark className="w-3.5 h-3.5" /> Want to Read
                </button>
                <button
                  onClick={() => {
                    onStatusChange(book.id, "READING");
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-[#EFE8DC] flex items-center gap-2 text-[#655848]"
                >
                  <Clock className="w-3.5 h-3.5" /> Reading
                </button>
                <button
                  onClick={() => {
                    onStatusChange(book.id, "COMPLETED");
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-[#EFE8DC] flex items-center gap-2 text-[#655848]"
                >
                  <CheckCircle className="w-3.5 h-3.5" /> Completed
                </button>
                <div className="my-1 border-t border-[#EBE5DA]" />
                <button
                  onClick={() => {
                    onEdit(book);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-[#EFE8DC] flex items-center gap-2 text-[#2D2A26]"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit Book
                </button>
                <button
                  onClick={() => {
                    onDelete(book.id);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-[#FDF2F2] flex items-center gap-2 text-[#9B1C1C]"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // GRID VIEW (Classic Book Card Layout)
  return (
    <div className="bg-[#FAF8F5] border border-[#EBE5DA] hover:border-[#C8C0B0] rounded-2xl p-5 transition-all duration-200 hover:shadow-xs flex flex-col justify-between group relative overflow-hidden">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          {/* Status Badge */}
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${statusConfig.badgeBg} ${statusConfig.badgeText} ${statusConfig.badgeBorder}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${statusConfig.indicatorBg}`}
            />
            {statusConfig.label}
          </span>

          {/* Favorite & More Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onToggleFavorite(book.id)}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                book.favorite
                  ? "text-[#D97706] bg-[#FEF3C7]"
                  : "text-[#A39B8E] hover:text-[#2D2A26] hover:bg-[#EFE8DC]"
              }`}
            >
              <Heart
                className={`w-4 h-4 ${book.favorite ? "fill-[#D97706]" : ""}`}
              />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 rounded-lg text-[#756C60] hover:text-[#2D2A26] hover:bg-[#EFE8DC] transition-colors cursor-pointer"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 top-8 w-48 bg-[#FAF8F5] border border-[#E5DFC9] rounded-xl shadow-lg p-1.5 z-20 text-xs animate-fadeIn">
                    <div className="px-2 py-1 text-[10px] uppercase font-bold text-[#8C8275]">
                      Status Shortcut
                    </div>
                    <button
                      onClick={() => {
                        onStatusChange(book.id, "WANT_TO_READ");
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-[#EFE8DC] flex items-center gap-2 text-[#655848]"
                    >
                      <Bookmark className="w-3.5 h-3.5 text-[#9C6B30]" /> Want
                      to Read
                    </button>
                    <button
                      onClick={() => {
                        onStatusChange(book.id, "READING");
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-[#EFE8DC] flex items-center gap-2 text-[#655848]"
                    >
                      <Clock className="w-3.5 h-3.5 text-[#2C5E8A]" /> Reading
                    </button>
                    <button
                      onClick={() => {
                        onStatusChange(book.id, "COMPLETED");
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-[#EFE8DC] flex items-center gap-2 text-[#655848]"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-[#2D6A4F]" />{" "}
                      Completed
                    </button>
                    <div className="my-1 border-t border-[#EBE5DA]" />
                    <button
                      onClick={() => {
                        onEdit(book);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-[#EFE8DC] flex items-center gap-2 text-[#2D2A26]"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit Details
                    </button>
                    <button
                      onClick={() => {
                        onDelete(book.id);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-[#FDF2F2] flex items-center gap-2 text-[#9B1C1C]"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Book Spine Accent & Main Metadata */}
        <div className="flex gap-3.5 items-start mt-2 mb-3">
          <div
            className={`w-12 h-16 rounded-lg shadow-2xs ${coverColorStyles} flex flex-col justify-between p-1.5 shrink-0 select-none`}
          >
            <span className="text-[9px] font-mono tracking-tighter opacity-80">
              {book.publishYear || "2026"}
            </span>
            <div className="w-full h-1 bg-white/20 rounded-full" />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-serif text-xl font-bold text-[#2D2A26] leading-snug line-clamp-2 group-hover:text-[#000000] transition-colors">
              {book.title}
            </h3>
            <p className="text-xs text-[#756C60] font-medium mt-0.5 truncate">
              {book.author}
            </p>

            {/* Star Rating */}
            {book.rating && book.rating > 0 ? (
              <div className="flex items-center text-[#D97706] mt-1.5 gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3 h-3 ${star <= (book.rating || 0) ? "fill-[#D97706]" : "text-[#D4CBAF]"}`}
                  />
                ))}
              </div>
            ) : (
              <span className="text-[11px] text-[#A39B8E] italic mt-1 block">
                Unrated
              </span>
            )}
          </div>
        </div>

        {/* Reading Progress Bar */}
        {book.status === "READING" && book.pageCount && (
          <div className="mt-3 p-2.5 rounded-xl bg-[#F2F7FA] border border-[#D4E3EF]">
            <div className="flex justify-between text-[11px] text-[#2C5E8A] font-medium mb-1">
              <span>Reading Progress</span>
              <span>
                {Math.round(((book.pagesRead || 0) / book.pageCount) * 100)}%
              </span>
            </div>
            <div className="w-full bg-[#DCE8F2] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#2C5E8A] h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.round(((book.pagesRead || 0) / book.pageCount) * 100)}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Notes Snippet */}
        {book.notes && (
          <button
            onClick={() => onOpenNotes(book)}
            className="w-full mt-3 text-left p-2.5 rounded-xl bg-[#F6F2EB] border border-[#E5DFC9] text-xs text-[#524B42] line-clamp-2 hover:bg-[#EFE8DC] transition-colors cursor-pointer"
          >
            <span className="font-semibold text-[#2D2A26]">Notes: </span>
            <span className="italic">"{book.notes}"</span>
          </button>
        )}
      </div>

      {/* Footer Tags */}
      <div className="mt-4 pt-3 border-t border-[#EBE5DA] flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {book.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-md bg-[#EFE8DC] text-[#655848] text-[10px] font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>

        {book.pageCount && (
          <span className="text-[11px] text-[#8C8275] font-mono shrink-0">
            {book.pageCount}p
          </span>
        )}
      </div>
    </div>
  );
};
