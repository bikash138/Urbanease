"use client";

import { use } from "react";
import Link from "next/link";
import PublicNavbar from "@/components/public/PublicNavbar";
import CategorySidebar from "@/components/public/categories/CategorySidebar";
import ServiceGrid from "@/components/public/categories/ServiceGrid";
import { Skeleton } from "@/components/ui/skeleton";
import {
  usePublicCategories,
  usePublicCategoryDetail,
} from "@/hooks/public/usePublic";

export default function CategoryDetailPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = use(params);

  const { data: category, isLoading: isLoadingCategory } =
    usePublicCategoryDetail(categorySlug);
  const { data: allCategories = [], isLoading: isLoadingCategories } =
    usePublicCategories();

  const relatedCategories = allCategories
    .filter((c) => c.slug !== categorySlug)
    .slice(0, 9);

  const services = category?.services ?? [];

  return (
    <div className="min-h-screen bg-zinc-50">
      <PublicNavbar />

      <div className="pt-16 flex">
        {/*left sidebar (desktop only) */}
        <CategorySidebar
          category={category}
          relatedCategories={relatedCategories}
          isLoadingCategory={isLoadingCategory}
          isLoadingRelated={isLoadingCategories}
          currentSlug={categorySlug}
        />

        {/*Scrollable right content */}
        <main className="flex-1 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto">
          {/* Mobile: horizontal category chips */}
          <div className="lg:hidden sticky top-16 z-10 bg-white border-b border-zinc-100 px-4 py-3 flex gap-2 overflow-x-auto">
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
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
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

          <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-5">
            <ServiceGrid services={services} isLoading={isLoadingCategory} />
          </div>
        </main>
      </div>
    </div>
  );
}
