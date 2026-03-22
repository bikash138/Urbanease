import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import type { PublicCategory } from "@/types/public/public.types";
import { PublicApiUnavailableMessage } from "@/components/common/PublicApiUnavailableMessage";
import { getPublicCategories } from "@/server/public";
import { HomeCarousel } from "@/components/public/home/HomeCarousel";

export function CategoriesSectionHeader() {
  return (
    <div className="text-left space-y-3 mb-12">
      <Badge
        variant="outline"
        className="text-zinc-500 border-zinc-300 bg-white"
      >
        Browse by Category
      </Badge>
      <h2 className="text-3xl font-bold text-zinc-900">
        What are you looking for?
      </h2>
      <p className="text-zinc-500 max-w-lg">
        Explore our wide range of home and urban services. Find the right
        professional for every job.
      </p>
    </div>
  );
}

export default async function CategoriesSection() {
  let categories: PublicCategory[];
  try {
    categories = await getPublicCategories();
  } catch {
    return (
      <section className="py-20 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-6">
          <CategoriesSectionHeader />
          <PublicApiUnavailableMessage />
        </div>
      </section>
    );
  }

  const displayCategories = categories.slice(0, 8);
  const totalCategories = categories.length;

  return (
    <section className="py-20 bg-zinc-50">
      <div className="max-w-7xl mx-auto px-6">
        <CategoriesSectionHeader />

        {displayCategories.length > 0 ? (
          <HomeCarousel variant="categories" items={displayCategories} />
        ) : (
          <p className="text-sm text-zinc-500">
            No categories to show right now.
          </p>
        )}

        {totalCategories > 8 && (
          <div className="text-center mt-8">
            <Link href="/categories">
              <Button
                variant="outline"
                className="border-zinc-300 hover:bg-zinc-50"
              >
                View all {totalCategories} categories{" "}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
