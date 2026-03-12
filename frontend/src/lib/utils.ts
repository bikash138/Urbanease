import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractErrorMessage(err: unknown): string {
  if (typeof err === "object" && err !== null && "message" in err) {
    return (err as { message: string }).message;
  }
  return "Something went wrong. Please try again.";
}

export function getDiceBearAvatarUrl(userId: string, name: string): string {
  const seed = encodeURIComponent(`${userId}-${name}`);
  return `https://api.dicebear.com/9.x/lorelei/svg?seed=${seed}`;
}
