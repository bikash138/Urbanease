import { config } from "./config";

export const tokenStorage = {
  get(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(config.tokenKey);
  },
  set(token: string): void {
    localStorage.setItem(config.tokenKey, token);
  },
  clear(): void {
    localStorage.removeItem(config.tokenKey);
  },
};
