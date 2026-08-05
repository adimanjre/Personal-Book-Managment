import { connectToDatabase, getCollection } from "@/lib/db";
import { Book, BookStatus } from "@/lib/mockData";
import { ObjectId } from "mongodb";

export type NewBookInput = Omit<Book, "id" | "createdAt">;

const VALID_STATUSES: BookStatus[] = [
  "WANT_TO_READ",
  "READING",
  "COMPLETED",
];

export function parseBookInput(
  body: Record<string, unknown>,
): { error: string } | { data: NewBookInput } {
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const author = typeof body.author === "string" ? body.author.trim() : "";

  if (!title || !author) {
    return { error: "Book title and author are required." };
  }

  const status = VALID_STATUSES.includes(body.status as BookStatus)
    ? (body.status as BookStatus)
    : "WANT_TO_READ";

  return {
    data: {
      title,
      author,
      status,
      tags: Array.isArray(body.tags) ? (body.tags as string[]) : [],
      pageCount: body.pageCount as number | undefined,
      pagesRead: body.pagesRead as number | undefined,
      rating: body.rating as number | undefined,
      notes: body.notes as string | undefined,
      publishYear: body.publishYear as number | undefined,
      coverColor: body.coverColor as Book["coverColor"],
      favorite: !!body.favorite,
    },
  };
}

export async function createBook(
  userId: string,
  input: NewBookInput,
): Promise<Book> {
  await connectToDatabase();
  const books = getCollection("books");

  const createdAt = new Date().toISOString();
  const result = await books.insertOne({
    ...input,
    userId,
    createdAt,
  });

  return {
    id: result.insertedId.toString(),
    ...input,
    createdAt,
  };
}

export async function getBooksByUser(userId: string): Promise<Book[]> {
  await connectToDatabase();
  const books = getCollection("books");

  const docs = await books
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray();

  return docs.map((doc) => {
    const { _id, ...rest } = doc;
    delete rest.userId;
    return { id: _id.toString(), ...rest } as Book;
  });
}

export async function updateBook(
  userId: string,
  bookId: string,
  input: NewBookInput,
): Promise<Book | null> {
  await connectToDatabase();
  const books = getCollection("books");

  const result = await books.findOneAndUpdate(
    { _id: new ObjectId(bookId), userId },
    { $set: input },
    { returnDocument: "after" },
  );

  if (!result) {
    return null;
  }

  const { _id, ...rest } = result;
  delete rest.userId;
  return { id: _id.toString(), ...rest } as Book;
}
