import { PublicCategory } from "@/types/public/public.types";
import { CategoryGridItem } from "./CategoryGridItem";
import { CategoryGridSkeleton } from "./CategoryGridSkeleton";

interface CategoryGridProps {
  categories: PublicCategory[];
  isLoading: boolean;
}

export function CategoryGrid({ categories, isLoading }: CategoryGridProps) {
  return (
    <div className="flex-1 bg-white rounded-2xl border border-zinc-200 p-1.5">
      <div className="grid grid-cols-4 gap-1.5">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <CategoryGridSkeleton key={i} />
            ))
          : categories.map((category) => (
              <CategoryGridItem key={category.id} category={category} />
            ))}
      </div>

      {!isLoading && categories.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-sm text-zinc-400">No categories available yet.</p>
        </div>
      )}
    </div>
  );
}
