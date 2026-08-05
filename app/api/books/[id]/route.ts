import { parseBookInput, updateBook } from "@/controller/bookController";
import { getAuthenticatedUserId } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  ctx: RouteContext<"/api/books/[id]">,
) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { id } = await ctx.params;
    if (!ObjectId.isValid(id)) {
      return new Response("Invalid book id.", { status: 400 });
    }

    const parsed = parseBookInput(await req.json());
    if ("error" in parsed) {
      return new Response(parsed.error, { status: 400 });
    }

    const book = await updateBook(userId, id, parsed.data);
    if (!book) {
      return new Response("Book not found.", { status: 404 });
    }

    return NextResponse.json({ book });
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }
    return new Response("Something went wrong!", { status: 500 });
  }
}
