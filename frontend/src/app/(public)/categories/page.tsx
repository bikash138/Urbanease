"use client";

import { usePublicCategories, usePublicServices } from "@/hooks/public/usePublic";
import PublicNavbar from "@/components/public/PublicNavbar";
import CTABanner from "@/components/common/CTABanner";
import Footer from "@/components/common/Footer";
import { CategoryBanner } from "@/components/public/categories/CategoryBanner";
import { CategoryGrid } from "@/components/public/categories/CategoryGrid";

export default function CategoriesPage() {
  const { data: categories, isLoading: categoriesLoading } = usePublicCategories();
  const { data: services, isLoading: servicesLoading } = usePublicServices();

  return (
    <div className="min-h-screen bg-zinc-50">
      <PublicNavbar />

      <main className="pt-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-10 items-start">
            <CategoryBanner
              categoryCount={categories?.length ?? 0}
              serviceCount={services?.length ?? 0}
              isLoading={categoriesLoading || servicesLoading}
            />
            <CategoryGrid
              categories={categories ?? []}
              isLoading={categoriesLoading}
            />
          </div>
        </div>
      </main>

      <CTABanner />
      <Footer />
    </div>
  );
}
