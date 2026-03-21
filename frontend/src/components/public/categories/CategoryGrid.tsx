import type { PublicCategory } from "@/types/public/public.types";
import { getPublicCategories } from "@/server/public";
import { PublicApiUnavailableMessage } from "@/components/common/PublicApiUnavailableMessage";
import { CategoryGridItem } from "./CategoryGridItem";

export async function CategoryGrid() {
  let categories: PublicCategory[];
  try {
    categories = await getPublicCategories();
  } catch {
    return (
      <div className="flex-1 min-w-0">
        <PublicApiUnavailableMessage />
      </div>
    );
  }

  return (
    <div className="flex-1 min-w-0 bg-white rounded-2xl border border-zinc-200 p-1.5 sm:p-2">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-2">
        {categories.map((category) => (
          <CategoryGridItem key={category.id} category={category} />
        ))}
      </div>

      {categories.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-sm text-zinc-400">No categories available yet.</p>
        </div>
      )}
    </div>
  );
}
