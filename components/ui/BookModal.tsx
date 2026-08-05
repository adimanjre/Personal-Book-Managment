import React, { useState, useEffect } from "react";
import { X, BookOpen, Star, Check, AlertCircle } from "lucide-react";
import { Book, BookStatus, ALL_TAG_SUGGESTIONS } from "@/lib/mockData";
import { useForm, useWatch, SubmitHandler } from "react-hook-form";
import axios from "axios";

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    bookData: Omit<Book, "id" | "createdAt"> & { id?: string },
  ) => Promise<void>;
  initialBook?: Book | null;
}

type Inputs = {
  title: string;
  author: string;
  status: BookStatus;
  tags: string[];
  pageCount?: number;
  pagesRead?: number;
  rating: number;
  notes?: string;
  publishYear?: number;
  coverColor: Book["coverColor"];
  favorite: boolean;
};

const getDefaultValues = (book?: Book | null): Inputs =>
  book
    ? {
        title: book.title,
        author: book.author,
        status: book.status,
        tags: book.tags || [],
        pageCount: book.pageCount,
        pagesRead: book.pagesRead,
        rating: book.rating || 0,
        notes: book.notes || "",
        publishYear: book.publishYear,
        coverColor: book.coverColor || "stone",
        favorite: !!book.favorite,
      }
    : {
        title: "",
        author: "",
        status: "WANT_TO_READ",
        tags: ["fiction"],
        pageCount: undefined,
        pagesRead: undefined,
        rating: 0,
        notes: "",
        publishYear: new Date().getFullYear(),
        coverColor: "stone",
        favorite: false,
      };

export const BookModal: React.FC<BookModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialBook,
}) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
  } = useForm<Inputs>({ defaultValues: getDefaultValues(initialBook) });

  const [tagInput, setTagInput] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const status = useWatch({ control, name: "status" });
  const tags = useWatch({ control, name: "tags" });
  const rating = useWatch({ control, name: "rating" });
  const coverColor = useWatch({ control, name: "coverColor" });
  const pageCount = useWatch({ control, name: "pageCount" });

  const coverOptions: Array<{
    id: Book["coverColor"];
    label: string;
    class: string;
  }> = [
    { id: "stone", label: "Stone", class: "bg-[#57534E]" },
    { id: "amber", label: "Amber", class: "bg-[#B45309]" },
    { id: "slate", label: "Slate", class: "bg-[#334155]" },
    { id: "emerald", label: "Emerald", class: "bg-[#047857]" },
    { id: "indigo", label: "Indigo", class: "bg-[#4338CA]" },
    { id: "rose", label: "Rose", class: "bg-[#BE123C]" },
    { id: "terracotta", label: "Terracotta", class: "bg-[#C2410C]" },
    { id: "navy", label: "Navy", class: "bg-[#1E293B]" },
  ];

  const sessionKey = `${isOpen}:${initialBook?.id ?? "new"}`;
  const [resetKey, setResetKey] = useState(sessionKey);
  if (sessionKey !== resetKey) {
    setResetKey(sessionKey);
    setErrorMsg(null);
    setTagInput("");
  }

  useEffect(() => {
    reset(getDefaultValues(initialBook));
  }, [initialBook, isOpen, reset]);

  if (!isOpen) return null;

  const handleAddTag = () => {
    const trimmed = tagInput.trim().toLowerCase().replace(/^#/, "");
    if (trimmed && !tags.includes(trimmed)) {
      setValue("tags", [...tags, trimmed]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue("tags", tags.filter((t) => t !== tagToRemove));
  };

  const handleSelectSuggestedTag = (suggested: string) => {
    if (!tags.includes(suggested)) {
      setValue("tags", [...tags, suggested]);
    }
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      setIsSaving(true);
      setErrorMsg(null);
      await onSave({
        id: initialBook?.id,
        title: data.title.trim(),
        author: data.author.trim(),
        status: data.status,
        tags: data.tags,
        pageCount:
          data.pageCount !== undefined && !Number.isNaN(data.pageCount)
            ? data.pageCount
            : undefined,
        pagesRead:
          data.pagesRead !== undefined && !Number.isNaN(data.pagesRead)
            ? data.pagesRead
            : undefined,
        rating: data.rating > 0 ? data.rating : undefined,
        notes: data.notes?.trim() || undefined,
        publishYear:
          data.publishYear !== undefined && !Number.isNaN(data.publishYear)
            ? data.publishYear
            : undefined,
        coverColor: data.coverColor,
        favorite: data.favorite,
      });
      onClose();
    } catch (error) {
      const serverMessage =
        axios.isAxiosError(error) && typeof error.response?.data === "string"
          ? error.response.data
          : null;
      setErrorMsg(
        serverMessage ||
          (error instanceof Error ? error.message : null) ||
          "Something went wrong while saving the book.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const onInvalid = () => {
    setErrorMsg("Book title and author name are required.");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1816]/50 backdrop-blur-xs animate-fadeIn">
      {/* Modal Container */}
      <div className="bg-[#FAF8F5] border border-[#E5DFC9] rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative">
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-[#8C8275] hover:text-[#2D2A26] hover:bg-[#EFE8DC] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#2D2A26] text-[#FBF9F6] flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-serif font-bold text-[#2D2A26]">
              {initialBook ? "Edit Book Record" : "Add Book to Shelf"}
            </h2>
            <p className="text-xs text-[#8C8275]">
              {initialBook
                ? "Update details, tags, or reading status"
                : "Record a new volume in your digital reading space"}
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-xl bg-[#FDF2F2] border border-[#F8D7D7] text-[#9B1C1C] text-xs sm:text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#C81E1E]" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-5">
          {/* Title & Author */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#665E55] mb-1.5">
                Book Title *
              </label>
              <input
                type="text"
                {...register("title", { required: true })}
                placeholder="e.g. The Design of Everyday Things"
                className="w-full px-3.5 py-2.5 bg-[#FBF9F6] border border-[#E5DFC9] rounded-xl text-sm text-[#2D2A26] placeholder-[#A39B8E] focus:outline-none focus:ring-2 focus:ring-[#2D2A26]/20 focus:border-[#2D2A26]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#665E55] mb-1.5">
                Author Name *
              </label>
              <input
                type="text"
                {...register("author", { required: true })}
                placeholder="e.g. Don Norman"
                className="w-full px-3.5 py-2.5 bg-[#FBF9F6] border border-[#E5DFC9] rounded-xl text-sm text-[#2D2A26] placeholder-[#A39B8E] focus:outline-none focus:ring-2 focus:ring-[#2D2A26]/20 focus:border-[#2D2A26]"
              />
            </div>
          </div>

          {/* Status Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#665E55] mb-2">
              Reading Status
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                {
                  id: "WANT_TO_READ",
                  label: "Want to Read 📖",
                  activeBg: "bg-[#FAF6EE] border-[#D97706] text-[#9C6B30]",
                },
                {
                  id: "READING",
                  label: "Reading 📘",
                  activeBg: "bg-[#F2F7FA] border-[#2563EB] text-[#2C5E8A]",
                },
                {
                  id: "COMPLETED",
                  label: "Completed ✅",
                  activeBg: "bg-[#F0F7F3] border-[#16A34A] text-[#2D6A4F]",
                },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setValue("status", opt.id as BookStatus)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all text-center cursor-pointer ${
                    status === opt.id
                      ? `${opt.activeBg} ring-1 shadow-xs`
                      : "bg-[#FBF9F6] border-[#E5DFC9] text-[#655848] hover:bg-[#EFE8DC]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pages & Rating & Publish Year */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#665E55] mb-1.5">
                Total Pages
              </label>
              <input
                type="number"
                min="1"
                {...register("pageCount", { valueAsNumber: true })}
                placeholder="350"
                className="w-full px-3 py-2 bg-[#FBF9F6] border border-[#E5DFC9] rounded-xl text-sm text-[#2D2A26]"
              />
            </div>

            {status === "READING" && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#665E55] mb-1.5">
                  Pages Read
                </label>
                <input
                  type="number"
                  min="0"
                  max={pageCount || 9999}
                  {...register("pagesRead", { valueAsNumber: true })}
                  placeholder="120"
                  className="w-full px-3 py-2 bg-[#FBF9F6] border border-[#E5DFC9] rounded-xl text-sm text-[#2D2A26]"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#665E55] mb-1.5">
                Publish Year
              </label>
              <input
                type="number"
                {...register("publishYear", { valueAsNumber: true })}
                placeholder="2022"
                className="w-full px-3 py-2 bg-[#FBF9F6] border border-[#E5DFC9] rounded-xl text-sm text-[#2D2A26]"
              />
            </div>
          </div>

          {/* Rating Stars */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#665E55] mb-1.5">
              Rating
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() =>
                    setValue("rating", star === rating ? 0 : star)
                  }
                  className="p-1 hover:scale-110 transition-transform cursor-pointer"
                >
                  <Star
                    className={`w-5 h-5 ${
                      star <= rating
                        ? "fill-[#D97706] text-[#D97706]"
                        : "text-[#D4CBAF]"
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs text-[#8C8275] ml-2">
                {rating > 0 ? `${rating} of 5 stars` : "Tap to rate"}
              </span>
            </div>
          </div>

          {/* Cover Spine Palette */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#665E55] mb-2">
              Book Cover Theme Accent
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {coverOptions.map((cov) => (
                <button
                  key={cov.id}
                  type="button"
                  onClick={() => setValue("coverColor", cov.id)}
                  className={`w-7 h-7 rounded-lg ${cov.class} flex items-center justify-center transition-transform cursor-pointer ${
                    coverColor === cov.id
                      ? "ring-2 ring-offset-2 ring-[#2D2A26] scale-110"
                      : "opacity-80 hover:opacity-100"
                  }`}
                  title={cov.label}
                >
                  {coverColor === cov.id && (
                    <Check className="w-3.5 h-3.5 text-white" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tags Section */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#665E55] mb-1.5">
              Tags & Categories
            </label>

            {/* Active Tag Chips */}
            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-lg bg-[#2D2A26] text-[#FBF9F6] text-xs font-medium flex items-center gap-1"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-[#F8D7D7] cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Tag Input */}
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Type tag (e.g. philosophy, tech) and press Enter or Add"
                className="flex-1 px-3 py-2 bg-[#FBF9F6] border border-[#E5DFC9] rounded-xl text-sm text-[#2D2A26]"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3.5 py-2 bg-[#EFE8DC] hover:bg-[#E2DACB] text-[#2D2A26] rounded-xl text-xs font-semibold cursor-pointer"
              >
                Add
              </button>
            </div>

            {/* Tag Suggestions */}
            <div className="flex flex-wrap items-center gap-1 text-xs text-[#8C8275]">
              <span className="text-[11px] font-medium mr-1">Suggestions:</span>
              {ALL_TAG_SUGGESTIONS.slice(0, 7).map((sugg) => (
                <button
                  key={sugg}
                  type="button"
                  onClick={() => handleSelectSuggestedTag(sugg)}
                  className="px-2 py-0.5 rounded-md bg-[#EFE8DC]/60 hover:bg-[#EFE8DC] text-[#655848] text-[11px] cursor-pointer"
                >
                  +{sugg}
                </button>
              ))}
            </div>
          </div>

          {/* Personal Reading Notes */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#665E55] mb-1.5">
              Personal Reflections & Key Quotes
            </label>
            <textarea
              rows={3}
              {...register("notes")}
              placeholder="Record quotes, summary reflections, or why you want to read this..."
              className="w-full px-3.5 py-2.5 bg-[#FBF9F6] border border-[#E5DFC9] rounded-xl text-sm text-[#2D2A26] placeholder-[#A39B8E] focus:outline-none focus:ring-2 focus:ring-[#2D2A26]/20 focus:border-[#2D2A26]"
            />
          </div>

          {/* Favorite Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="favoriteCheck"
              {...register("favorite")}
              className="w-4 h-4 rounded text-[#2D2A26] accent-[#2D2A26] cursor-pointer"
            />
            <label
              htmlFor="favoriteCheck"
              className="text-xs font-medium text-[#423C35] cursor-pointer"
            >
              Mark as Favorite Volume ★
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[#EBE5DA] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-transparent hover:bg-[#EFE8DC] text-[#655848] rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 bg-[#2D2A26] hover:bg-[#1A1816] text-[#FBF9F6] rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-xs cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSaving
                ? "Saving..."
                : initialBook
                  ? "Save Changes"
                  : "Add to Collection"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
