import { loginController } from "@/controller/authController";
import { signToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  try {
    if (!email || !password) {
      throw Error("Email or Password is mandatory!");
    }
    const user = await loginController(email, password);
    const token = signToken({ userId: user.id, email: user.email });

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({
      result: "Logged in",
      user: { fullName: user.fullName, email: user.email },
    });
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, {
        status: 500,
      });
    }
    return new Response("Something Went wrong!", {
      status: 500,
    });
  }
}
