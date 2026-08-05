import { registerController } from "@/controller/authController";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { fullName, email, password } = await req.json();
  try {
    if (!fullName || !email || !password) {
      throw Error("Fullname, email and password is mandatory");
    }
    await registerController(fullName, email, password);
    return NextResponse.json({ message: "Account Created Successfully!" });
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, {
        status: 403,
      });
    }
    return new Response("Something went wrong!", {
      status: 500,
    });
  }
}
