import jwt from "jsonwebtoken";

export interface TokenPayload {
  userId: string;
  email: string;
}

function getSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error(
      "JWT_SECRET environment variable is not defined. Please check your .env.local file.",
    );
  }

  return secret;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, getSecret(), { expiresIn: "7d" });
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, getSecret()) as TokenPayload;
}
