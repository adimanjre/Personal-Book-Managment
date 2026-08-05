import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

export async function getAuthenticatedUserId(): Promise<string | null> {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return null;
  }

  try {
    return verifyToken(token).userId;
  } catch {
    return null;
  }
}
