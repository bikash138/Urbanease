import { Suspense } from "react";
import { CategoryDetailPageFallback } from "@/components/public/fallbacks/CategoryDetailPageFallback";
import {
  getPublicCategories,
  getPublicCategoryBySlug,
} from "@/server/public";
import CategoryDetailClient from "./CategoryDetailClient";

async function CategoryDetailLoader({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = await params;
  const [initialCategory, initialCategories] = await Promise.all([
    getPublicCategoryBySlug(categorySlug),
    getPublicCategories(),
  ]);

  return (
    <CategoryDetailClient
      categorySlug={categorySlug}
      initialCategory={initialCategory}
      initialCategories={initialCategories}
    />
  );
}

export default function CategoryDetailPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  return (
    <Suspense fallback={<CategoryDetailPageFallback />}>
      <CategoryDetailLoader params={params} />
    </Suspense>
  );
}
