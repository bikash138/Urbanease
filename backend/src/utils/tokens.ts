import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config";
import crypto from "crypto";

export type AccessTokenPayload = {
  id: string;
  email: string;
  role: "CUSTOMER" | "PROVIDER" | "ADMIN";
  providerId?: string;
};

export function signAccessToken(payload: AccessTokenPayload): string {
  const options: SignOptions = {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"],
    subject: payload.id,
  };
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, options);
}

export function createRefreshTokenValue() {
  return crypto.randomBytes(32).toString("base64url");
}

export function hashRefreshToken(rawToken: string): string {
  const refreshSecret = env.REFRESH_TOKEN_SECRET;
  return crypto
    .createHash("sha256")
    .update(refreshSecret + rawToken)
    .digest("hex");
}

const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export function refreshTokenExpiresAt(): Date {
  return new Date(Date.now() + REFRESH_TTL_MS);
}

export function refreshCookieMaxAgeMs(): number {
  return REFRESH_TTL_MS;
}

export function accessExpiresInSeconds(accessToken: string) : number {
    const decoded = jwt.decode(accessToken) as { exp?: number } | null 
    if(!decoded?.exp) return 30 * 60
    return Math.max(1, decoded.exp - Math.floor(Date.now() / 1000));
}