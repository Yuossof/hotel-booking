import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UnauthorizedError } from "./errors";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";
const SALT_ROUNDS = 12;

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: { userId: number; email: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): { userId: number; email: string } {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number; email: string };
  } catch {
    throw new UnauthorizedError("Invalid or expired token");
  }
}

export function getTokenFromHeader(request: Request): string {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    throw new UnauthorizedError("Missing or invalid authorization header");
  }
  return auth.slice(7);
}

export function verifyAuth(request: Request): { userId: number; email: string } {
  const token = getTokenFromHeader(request);
  return verifyToken(token);
}
