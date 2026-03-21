import { ProviderCardSkeleton } from "@/components/public/providers/ProviderCardSkeleton";

export function ProviderGridFallback() {
  return (
    <div className="flex-1 min-w-0 flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <ProviderCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
