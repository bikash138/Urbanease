"use client";

import { Image } from "@imagekit/next";
import { getImageUrl } from "@/lib/imagekit-url-generator";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import type {
  PublicCategoryDetail,
  PublicCategory,
} from "@/types/public/public.types";

interface CategorySidebarProps {
  category: PublicCategoryDetail | null | undefined;
  relatedCategories: PublicCategory[];
  isLoadingCategory: boolean;
  isLoadingRelated: boolean;
  currentSlug: string;
}

export default function CategorySidebar({
  category,
  relatedCategories,
  isLoadingCategory,
  isLoadingRelated,
  currentSlug,
}: CategorySidebarProps) {
  return (
    <aside className="hidden lg:flex w-[280px] shrink-0 flex-col h-[calc(100vh-4rem)] overflow-y-auto sticky top-16 border-r border-zinc-100 bg-white">
      <div className="p-6 space-y-7">
        {/*Category Title & Description*/}
        <div className="space-y-2">
          {isLoadingCategory ? (
            <>
              <Skeleton className="h-7 w-4/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </>
          ) : category ? (
            <>
              <h1 className="text-xl font-bold text-zinc-900 leading-snug">
                {category.name}
              </h1>
              {category.description && (
                <p className="text-sm text-zinc-500 leading-relaxed">
                  {category.description}
                </p>
              )}
            </>
          ) : (
            <h1 className="text-xl font-bold text-zinc-900">Category</h1>
          )}
        </div>

        {/* Category Image */}
        {isLoadingCategory ? (
          <Skeleton className="w-full aspect-video rounded-xl" />
        ) : category ? (
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-zinc-100">
            <Image
              src={getImageUrl(category.image, "card") || "/error-placeholder-image.webp"}
              alt={category.name}
              fill
              className="object-cover"
            />
          </div>
        ) : null}

        {/*Related Categories Grid*/}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Other Categories
          </p>

          {isLoadingRelated ? (
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-xl" />
              ))}
            </div>
          ) : relatedCategories.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {relatedCategories.map((cat) => {
                const isActive = cat.slug === currentSlug;
                return (
                  <Link
                    key={cat.id}
                    href={`/categories/${cat.slug}`}
                    className={`group flex flex-col items-center gap-1.5 rounded-xl p-2 transition-colors ${
                      isActive
                        ? "bg-zinc-900"
                        : "bg-zinc-50 border border-zinc-100 hover:border-zinc-200 hover:bg-zinc-100"
                    }`}
                  >
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-zinc-200">
                      <Image
                        src={getImageUrl(cat.image, "card") || "/error-placeholder-image.webp"}
                        alt={cat.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p
                      className={`text-[10px] font-medium text-center leading-tight line-clamp-2 ${
                        isActive ? "text-white" : "text-zinc-700"
                      }`}
                    >
                      {cat.name}
                    </p>
                  </Link>
                );
              })}
            </div>
          ) : (
            !isLoadingRelated && (
              <p className="text-xs text-zinc-400">No other categories.</p>
            )
          )}
        </div>
      </div>
    </aside>
  );
}
