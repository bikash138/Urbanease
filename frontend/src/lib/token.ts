import { config } from "./config";
import type { AuthorizedUser } from "@/types/auth.types";

export const roleStorage = {
  get(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(config.roleKey);
  },
  set(role: string): void {
    localStorage.setItem(config.roleKey, role);
  },
  clear(): void {
    localStorage.removeItem(config.roleKey);
  },
};

export const userStorage = {
  get(): AuthorizedUser | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(config.userKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthorizedUser;
    } catch {
      return null;
    }
  },
  set(user: AuthorizedUser): void {
    localStorage.setItem(config.userKey, JSON.stringify(user));
  },
  clear(): void {
    localStorage.removeItem(config.userKey);
  },
};
