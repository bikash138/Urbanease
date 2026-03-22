"use client";

import { PublicApiUnavailableMessage } from "@/components/common/PublicApiUnavailableMessage";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-6 px-6 py-16 bg-white">
      <PublicApiUnavailableMessage />
      <button
        type="button"
        onClick={() => reset()}
        className="text-sm font-medium text-zinc-900 underline underline-offset-4 hover:text-zinc-700"
      >
        Try again
      </button>
    </div>
  );
}
