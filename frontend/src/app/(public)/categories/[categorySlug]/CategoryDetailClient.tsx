"use client";

import Link from "next/link";
import CategorySidebar from "@/components/public/categories/CategorySidebar";
import ServiceGrid from "@/components/public/categories/ServiceGrid";
import {
  usePublicCategories,
  usePublicCategoryDetail,
} from "@/hooks/public/usePublic";
import type {
  PublicCategory,
  PublicCategoryDetail,
} from "@/types/public/public.types";

export default function CategoryDetailClient({
  categorySlug,
  initialCategory,
  initialCategories,
}: {
  categorySlug: string;
  initialCategory: PublicCategoryDetail | null;
  initialCategories: PublicCategory[];
}) {
  const { data: category, isLoading: isLoadingCategory } =
    usePublicCategoryDetail(categorySlug, { initialData: initialCategory });
  const { data: allCategories = [], isLoading: isLoadingCategories } =
    usePublicCategories({ initialData: initialCategories });

  const relatedCategories = allCategories
    .filter((c) => c.slug !== categorySlug)
    .slice(0, 9);

  const services = category?.services ?? [];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden w-full">
      <div className="pt-16">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
            <CategorySidebar
              category={category}
              relatedCategories={relatedCategories}
              isLoadingCategory={isLoadingCategory}
              isLoadingRelated={isLoadingCategories}
              currentSlug={categorySlug}
            />

            <main className="flex-1 min-w-0 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto lg:pl-8">
              <div className="lg:hidden sticky top-16 z-10 bg-white border-b border-zinc-100 py-3 flex gap-2 overflow-x-auto overscroll-x-contain [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <Link
                  href="/categories"
                  className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400 transition-colors"
                >
                  All
                </Link>
                {allCategories.map((cat) => {
                  const isActive = cat.slug === categorySlug;
                  return (
                    <Link
                      key={cat.id}
                      href={`/categories/${cat.slug}`}
                      className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap ${
                        isActive
                          ? "bg-zinc-900 text-white border-zinc-900"
                          : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400"
                      }`}
                    >
                      {cat.name}
                    </Link>
                  );
                })}
              </div>

              <div className="py-6 sm:py-8 space-y-5">
                <ServiceGrid services={services} isLoading={isLoadingCategory} />
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
