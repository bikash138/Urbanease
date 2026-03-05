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

export async function asyncHandler<T>(
  asyncFn: () => Promise<T>,
  setError: (msg: string | null) => void,
  setIsLoading: (loading: boolean) => void,
  throwError: boolean = true,
): Promise<T | void> {
  setIsLoading(true);
  setError(null);
  try {
    return await asyncFn();
  } catch (err: unknown) {
    setError(extractErrorMessage(err));
    if (throwError) throw err;
  } finally {
    setIsLoading(false);
  }
}
