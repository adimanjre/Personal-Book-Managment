import { getUserById } from "@/controller/authController";
import { getAuthenticatedUserId } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const user = await getUserById(userId);
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    return NextResponse.json({
      user: { fullName: user.fullName, email: user.email },
    });
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }
    return new Response("Something went wrong!", { status: 500 });
  }
}
