export type BookStatus = "WANT_TO_READ" | "READING" | "COMPLETED";

export interface Book {
  id: string;
  title: string;
  author: string;
  status: BookStatus;
  tags: string[];
  createdAt: string;
  coverColor?:
    | "slate"
    | "amber"
    | "emerald"
    | "indigo"
    | "rose"
    | "stone"
    | "terracotta"
    | "navy";
  pageCount?: number;
  pagesRead?: number;
  rating?: number; // 1 to 5
  notes?: string;
  publishYear?: number;
  favorite?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  readingGoalPerYear: number;
}

export interface DashboardStats {
  totalBooks: number;
  wantToRead: number;
  currentlyReading: number;
  completed: number;
  completionRatePercentage: number;
  avgRating: number;
  totalPagesRead: number;
}

export const INITIAL_USER: UserProfile = {
  id: "usr_101",
  name: "Eleanor Vance",
  email: "eleanor.vance@readershelf.org",
  avatarUrl:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
  readingGoalPerYear: 24,
};

export const INITIAL_BOOKS: Book[] = [
  {
    id: "b1",
    title: "The Design of Everyday Things",
    author: "Don Norman",
    status: "COMPLETED",
    tags: ["design", "tech", "psychology"],
    createdAt: "2026-01-12T10:00:00Z",
    coverColor: "amber",
    pageCount: 368,
    pagesRead: 368,
    rating: 5,
    notes:
      "Cognitive psychology applied to human error and product ergonomics. The concept of affordances and signifiers remains fundamental.",
    publishYear: 2013,
    favorite: true,
  },
  {
    id: "b2",
    title: "Stoner",
    author: "John Williams",
    status: "READING",
    tags: ["fiction", "classics", "academic"],
    createdAt: "2026-02-01T14:30:00Z",
    coverColor: "stone",
    pageCount: 288,
    pagesRead: 194,
    rating: 5,
    notes:
      "A quietly miraculous novel about an ordinary university professor. The prose is dignified, restrained, and deeply moving.",
    publishYear: 1965,
    favorite: true,
  },
  {
    id: "b3",
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    status: "READING",
    tags: ["tech", "architecture", "systems"],
    createdAt: "2026-01-20T09:15:00Z",
    coverColor: "slate",
    pageCount: 616,
    pagesRead: 340,
    rating: 4,
    notes:
      "Masterpiece on consensus algorithms, replication logs, stream processing, and reliability trade-offs.",
    publishYear: 2017,
    favorite: false,
  },
  {
    id: "b4",
    title: "Meditations",
    author: "Marcus Aurelius",
    status: "COMPLETED",
    tags: ["philosophy", "stoicism", "classics"],
    createdAt: "2025-11-10T11:00:00Z",
    coverColor: "terracotta",
    pageCount: 256,
    pagesRead: 256,
    rating: 5,
    notes:
      "Private journal entries of the Roman emperor on duty, mortality, internal composure, and nature.",
    publishYear: 180,
    favorite: true,
  },
  {
    id: "b5",
    title: "Klara and the Sun",
    author: "Kazuo Ishiguro",
    status: "WANT_TO_READ",
    tags: ["fiction", "sci-fi", "dystopian"],
    createdAt: "2026-02-15T16:20:00Z",
    coverColor: "rose",
    pageCount: 320,
    pagesRead: 0,
    publishYear: 2021,
    favorite: false,
  },
  {
    id: "b6",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    status: "WANT_TO_READ",
    tags: ["psychology", "non-fiction", "behaviour"],
    createdAt: "2026-02-28T08:45:00Z",
    coverColor: "indigo",
    pageCount: 496,
    pagesRead: 0,
    publishYear: 2011,
    favorite: false,
  },
  {
    id: "b7",
    title: "The Glass Bead Game",
    author: "Hermann Hesse",
    status: "WANT_TO_READ",
    tags: ["fiction", "philosophy", "classics"],
    createdAt: "2026-03-02T12:00:00Z",
    coverColor: "navy",
    pageCount: 578,
    pagesRead: 0,
    publishYear: 1943,
    favorite: false,
  },
  {
    id: "b8",
    title: "Gödel, Escher, Bach: An Eternal Golden Braid",
    author: "Douglas Hofstadter",
    status: "READING",
    tags: ["math", "tech", "philosophy"],
    createdAt: "2026-01-05T18:00:00Z",
    coverColor: "emerald",
    pageCount: 777,
    pagesRead: 210,
    rating: 5,
    notes:
      "Examines strange loops, self-reference, and artificial consciousness through fugues, woodcuts, and formal logic.",
    publishYear: 1979,
    favorite: true,
  },
];

export function calculateDashboardStats(books: Book[]): DashboardStats {
  const totalBooks = books.length;
  const wantToRead = books.filter((b) => b.status === "WANT_TO_READ").length;
  const currentlyReading = books.filter((b) => b.status === "READING").length;
  const completed = books.filter((b) => b.status === "COMPLETED").length;

  const completionRatePercentage =
    totalBooks > 0 ? Math.round((completed / totalBooks) * 100) : 0;

  const ratedBooks = books.filter((b) => b.rating && b.rating > 0);
  const avgRating =
    ratedBooks.length > 0
      ? Number(
          (
            ratedBooks.reduce((acc, b) => acc + (b.rating || 0), 0) /
            ratedBooks.length
          ).toFixed(1),
        )
      : 0;

  const totalPagesRead = books.reduce((acc, b) => {
    if (b.status === "COMPLETED") return acc + (b.pageCount || 0);
    if (b.status === "READING") return acc + (b.pagesRead || 0);
    return acc;
  }, 0);

  return {
    totalBooks,
    wantToRead,
    currentlyReading,
    completed,
    completionRatePercentage,
    avgRating,
    totalPagesRead,
  };
}

export const ALL_TAG_SUGGESTIONS = [
  "fiction",
  "non-fiction",
  "tech",
  "design",
  "philosophy",
  "classics",
  "psychology",
  "sci-fi",
  "architecture",
  "stoicism",
  "academic",
  "history",
  "biography",
];
