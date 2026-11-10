// backend-node/src/lib/jwt.ts
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret"; // put same value in .env for prod

type AccessPayload = { userId: string; iat: number; exp: number };

export function signAccessToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyAccessToken(token: string): AccessPayload {
  return jwt.verify(token, JWT_SECRET) as AccessPayload;
}
