"use client";
import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Book,
  BookStatus,
  UserProfile,
  calculateDashboardStats,
} from "@/lib/mockData";
import { Navbar } from "@/components/layout/Navbar";
import { DashboardStats } from "@/components/ui/DashboardStats";
import { BookFilters } from "@/components/ui/BookFilters";
import { BookGrid } from "@/components/ui/BookGrid";
import { BookModal } from "@/components/ui/BookModal";
import { NotesDrawer } from "@/components/ui/NotesDrawer";
import { Check, Info, Sparkles, BookOpen } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearUser, setUser } from "@/store/userSlice";
import { get, post, put } from "@/lib/api";

export default function App() {
  // State
  const router = useRouter();
  const dispatch = useAppDispatch();
  const loggedInUser = useAppSelector((state) => state.user);
  const user: UserProfile | null = loggedInUser.fullName
    ? {
        id: loggedInUser.email || "",
        name: loggedInUser.fullName,
        email: loggedInUser.email || "",
        readingGoalPerYear: 0,
      }
    : null;
  const [books, setBooks] = useState<Book[]>([]);

  // Filter & Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<
    "RECENT" | "TITLE" | "AUTHOR" | "RATING"
  >("RECENT");
  const [viewMode, setViewMode] = useState<"GRID" | "LIST">("GRID");
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  // Modals state
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [selectedNotesBook, setSelectedNotesBook] = useState<Book | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Toast Helper
  const showToast = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Rehydrate the signed-in user on a fresh page load (Redux state doesn't
  // survive a refresh, but the httpOnly session cookie does)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await get("/api/auth/me", {});
        dispatch(setUser(response.data.user));
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, [dispatch]);

  // Load the signed-in user's books
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await get("/api/books", {});
        setBooks(response.data.books);
      } catch (error) {
        console.error(error);
        showToast("Couldn't load your books. Please refresh.");
      }
    };
    fetchBooks();
  }, []);

  // Derive unique available tags from current books
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    books.forEach((b) => b.tags.forEach((t) => tagSet.add(t.toLowerCase())));
    return Array.from(tagSet).sort();
  }, [books]);

  // Derive Filtered & Sorted Books
  const filteredBooks = useMemo(() => {
    return books
      .filter((book) => {
        // Status filter
        if (statusFilter !== "ALL" && book.status !== statusFilter) {
          return false;
        }

        // Favorites filter
        if (favoritesOnly && !book.favorite) {
          return false;
        }

        // Tag filter
        if (
          selectedTag &&
          !book.tags
            .map((t) => t.toLowerCase())
            .includes(selectedTag.toLowerCase())
        ) {
          return false;
        }

        // Search Query filter (Title, Author, Notes, or Tags)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchesTitle = book.title.toLowerCase().includes(q);
          const matchesAuthor = book.author.toLowerCase().includes(q);
          const matchesNotes = book.notes?.toLowerCase().includes(q) || false;
          const matchesTags = book.tags.some((t) =>
            t.toLowerCase().includes(q),
          );

          if (
            !matchesTitle &&
            !matchesAuthor &&
            !matchesNotes &&
            !matchesTags
          ) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "TITLE") {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === "AUTHOR") {
          return a.author.localeCompare(b.author);
        }
        if (sortBy === "RATING") {
          return (b.rating || 0) - (a.rating || 0);
        }
        // Default RECENT
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
  }, [books, statusFilter, favoritesOnly, selectedTag, searchQuery, sortBy]);

  // Dashboard Metrics
  const stats = useMemo(() => calculateDashboardStats(books), [books]);

  const hasActiveFilters =
    statusFilter !== "ALL" ||
    selectedTag !== null ||
    searchQuery !== "" ||
    favoritesOnly;

  // Handlers
  const handleResetFilters = () => {
    setStatusFilter("ALL");
    setSelectedTag(null);
    setSearchQuery("");
    setFavoritesOnly(false);
  };

  const handleSaveBook = async (
    bookData: Omit<Book, "id" | "createdAt"> & { id?: string },
  ) => {
    if (bookData.id) {
      // Update existing book
      const response = await put(`/api/books/${bookData.id}`, bookData, {});
      const updatedBook: Book = response.data.book;
      setBooks((prev) =>
        prev.map((b) => (b.id === updatedBook.id ? updatedBook : b)),
      );
      showToast(`Updated "${bookData.title}"`);
      return;
    }

    const response = await post("/api/books", bookData, {});
    const newBook: Book = response.data.book;
    setBooks((prev) => [newBook, ...prev]);
    showToast(`Added "${bookData.title}" to library`);
  };

  const handleDeleteBook = (id: string) => {
    const target = books.find((b) => b.id === id);
    if (
      confirm(
        `Are you sure you want to remove "${target?.title || "this book"}" from your shelf?`,
      )
    ) {
      setBooks((prev) => prev.filter((b) => b.id !== id));
      showToast("Book removed from collection");
    }
  };

  const handleStatusChange = async (id: string, newStatus: BookStatus) => {
    const target = books.find((b) => b.id === id);
    if (!target) return;

    try {
      const response = await put(
        `/api/books/${id}`,
        { ...target, status: newStatus },
        {},
      );
      const updatedBook: Book = response.data.book;
      setBooks((prev) => prev.map((b) => (b.id === id ? updatedBook : b)));
      const statusText = {
        WANT_TO_READ: "Want to Read",
        READING: "Currently Reading",
        COMPLETED: "Completed",
      }[newStatus];
      showToast(`Status updated to ${statusText}`);
    } catch (error) {
      console.error(error);
      showToast("Couldn't update status. Please try again.");
    }
  };

  const handleToggleFavorite = async (id: string) => {
    const target = books.find((b) => b.id === id);
    if (!target) return;

    try {
      const response = await put(
        `/api/books/${id}`,
        { ...target, favorite: !target.favorite },
        {},
      );
      const updatedBook: Book = response.data.book;
      setBooks((prev) => prev.map((b) => (b.id === id ? updatedBook : b)));
    } catch (error) {
      console.error(error);
      showToast("Couldn't update favorite. Please try again.");
    }
  };

  const handleOpenAddModal = () => {
    setEditingBook(null);
    setIsBookModalOpen(true);
  };

  const handleOpenEditModal = (book: Book) => {
    setEditingBook(book);
    setIsBookModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await post("/api/auth/logout", {}, {});
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(clearUser());
      showToast("Signed out of session");
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F6] text-[#2D2A26] flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        user={user}
        onOpenAddModal={handleOpenAddModal}
        onLogout={handleLogout}
        onLoginClick={() => router.push("/login")}
        totalBooksCount={books.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toast Notification Banner */}
        {notification && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#2D2A26] text-[#FBF9F6] px-4 py-3 rounded-2xl shadow-xl border border-[#423C35] text-xs sm:text-sm font-medium flex items-center gap-2.5 animate-fadeIn">
            <Check className="w-4 h-4 text-[#4ADE80]" />
            <span>{notification}</span>
          </div>
        )}

        {/* Dashboard Stats Metrics Header */}
        <DashboardStats
          stats={stats}
          selectedStatusFilter={statusFilter}
          onSelectStatusFilter={(st) => setStatusFilter(st)}
        />

        {/* Search, Tag & Status Controls */}
        <BookFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          selectedTag={selectedTag}
          onTagSelect={setSelectedTag}
          availableTags={availableTags}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          favoritesOnly={favoritesOnly}
          onToggleFavorites={() => setFavoritesOnly(!favoritesOnly)}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Books Count Banner */}
        <div className="flex items-center justify-between mb-4 text-xs text-[#8C8275] font-medium px-1">
          <div>
            Showing{" "}
            <strong className="text-[#2D2A26] font-bold">
              {filteredBooks.length}
            </strong>{" "}
            of <strong className="text-[#2D2A26]">{books.length}</strong>{" "}
            volumes
          </div>
          {favoritesOnly && (
            <span className="text-[#92400E] font-semibold bg-[#FEF3C7] px-2 py-0.5 rounded-md">
              Filtered by Favorites
            </span>
          )}
        </div>

        {/* Book Grid & Cards */}
        <BookGrid
          books={filteredBooks}
          viewMode={viewMode}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteBook}
          onStatusChange={handleStatusChange}
          onToggleFavorite={handleToggleFavorite}
          onOpenNotes={(b) => setSelectedNotesBook(b)}
          onOpenAddModal={handleOpenAddModal}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-[#EBE5DA] bg-[#FAF8F5] py-6 mt-16 text-center text-xs text-[#8C8275]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-serif font-semibold text-[#2D2A26]">
            <BookOpen className="w-4 h-4 text-[#8C8275]" />
            <span>The Reader's Shelf</span>
          </div>
          <p>
            © 2026 The Personal Book Manager — Pure UI Mock state ready for API
            binding.
          </p>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#16A34A]" />
            <span className="text-[11px] font-mono">
              Status: Standard Client Mode
            </span>
          </div>
        </div>
      </footer>

      {/* Add / Edit Book Modal */}
      <BookModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        onSave={handleSaveBook}
        initialBook={editingBook}
      />

      {/* Reader Notes Drawer */}
      <NotesDrawer
        book={selectedNotesBook}
        onClose={() => setSelectedNotesBook(null)}
        onEdit={handleOpenEditModal}
      />

    </div>
  );
}
