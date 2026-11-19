import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import type { SignOptions } from "jsonwebtoken";
import type {
  TokenPayload,
  UserData,
} from "../../modules/auth/types/user.auth.types.js";

export function signAccessToken(payload: TokenPayload): string {
  const options: SignOptions = { expiresIn: env.jwtAccessExpiresIn };

  return jwt.sign(payload, env.jwtAccessSecret, options);
}

export function verifyAccessToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, env.jwtAccessSecret) as TokenPayload;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    throw new Error(message);
  }
}

export function generateJwtToken(user: UserData): string {
  return signAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });
}
