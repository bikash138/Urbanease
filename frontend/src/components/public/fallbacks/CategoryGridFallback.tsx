import { CategoryGridSkeleton } from "@/components/public/categories/CategoryGridSkeleton";

export function CategoryGridFallback() {
  return (
    <div className="flex-1 min-w-0 bg-white rounded-2xl border border-zinc-200 p-1.5 sm:p-2">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <CategoryGridSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
