import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config";
import crypto from "crypto";

export type AccessTokenPayload = {
  id: string;
  email: string;
  role: "CUSTOMER" | "PROVIDER" | "ADMIN";
  providerId?: string;
};

export const PASSWORD_RESET_TOKEN_TTL_MS = 15 * 60 * 1000;
export const REFRESH_TOKEN_TTL_MS = env.REFRESH_TOKEN_EXPIRES_IN * 24 * 60 * 60 * 1000;

const DEFAULT_OPAQUE_TOKEN_BYTES = 32;

export function createRandomToken(byteLength = DEFAULT_OPAQUE_TOKEN_BYTES): string {
  return crypto.randomBytes(byteLength).toString("base64url");
}

export function hashTokenWithSecret(rawToken: string, secret: string): string {
  return crypto
    .createHash("sha256")
    .update(secret + rawToken)
    .digest("hex");
}

export function signAccessToken(payload: AccessTokenPayload): string {
  const options: SignOptions = {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"],
    subject: payload.id,
  };
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, options);
}

export function accessExpiresInSeconds(accessToken: string): number {
  const decoded = jwt.decode(accessToken) as { exp?: number } | null;
  if (!decoded?.exp) return 30 * 60;
  return Math.max(1, decoded.exp - Math.floor(Date.now() / 1000));
}