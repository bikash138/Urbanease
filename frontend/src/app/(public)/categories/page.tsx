import { Suspense } from "react";
import CTABanner from "@/components/common/CTABanner";
import { CategoryBanner } from "@/components/public/categories/CategoryBanner";
import { CategoryGrid } from "@/components/public/categories/CategoryGrid";
import { CategoryGridFallback } from "@/components/public/fallbacks/CategoryGridFallback";

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <main className="pt-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-10 items-start">
            <CategoryBanner />
            <Suspense fallback={<CategoryGridFallback />}>
              <CategoryGrid />
            </Suspense>
          </div>
        </div>
      </main>

      <CTABanner />
    </div>
  );
}
