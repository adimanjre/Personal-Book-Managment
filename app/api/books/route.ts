import {
  createBook,
  getBooksByUser,
  parseBookInput,
} from "@/controller/bookController";
import { getAuthenticatedUserId } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const books = await getBooksByUser(userId);
    return NextResponse.json({ books });
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }
    return new Response("Something went wrong!", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const parsed = parseBookInput(await req.json());
    if ("error" in parsed) {
      return new Response(parsed.error, { status: 400 });
    }

    const book = await createBook(userId, parsed.data);
    return NextResponse.json({ book }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }
    return new Response("Something went wrong!", { status: 500 });
  }
}
