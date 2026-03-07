"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";
import type { PublicCategory } from "@/types/public/public.types";

function CategoryCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white border border-zinc-100">
      <Skeleton className="w-full aspect-square" />
      <div className="p-3">
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}

function CategoryCard({
  category,
}: {
  category: PublicCategory;
  index: number;
}) {
  return (
    <Link href={`/categories/${category.slug}`}>
      <div className="group cursor-pointer overflow-hidden hover:shadow-md transition-all duration-200">
        <div className="relative w-full rounded-2xl aspect-square bg-zinc-100">
          <Image
            src={
              category.image ||
              "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2940&auto=format&fit=crop"
            }
            alt={category.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
        <div className="px-3 py-2.5">
          <p className="text-sm font-medium text-zinc-900 leading-snug">
            {category.name}
          </p>
        </div>
      </div>
    </Link>
  );
}

interface CategoriesSectionProps {
  isLoadingCategories: boolean;
  displayCategories: PublicCategory[];
  totalCategories?: number;
}

export default function CategoriesSection({
  isLoadingCategories,
  displayCategories,
  totalCategories,
}: CategoriesSectionProps) {
  return (
    <section className="py-20 bg-zinc-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center space-y-3 mb-12">
          <Badge
            variant="outline"
            className="text-zinc-500 border-zinc-300 bg-white"
          >
            Browse by Category
          </Badge>
          <h2 className="text-3xl font-bold text-zinc-900">
            What are you looking for?
          </h2>
          <p className="text-zinc-500 max-w-lg mx-auto">
            Explore our wide range of home and urban services. Find the right
            professional for every job.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {isLoadingCategories
            ? Array.from({ length: 8 }).map((_, i) => (
                <CategoryCardSkeleton key={i} />
              ))
            : displayCategories.length > 0
              ? displayCategories.map((cat, i) => (
                  <CategoryCard key={cat.id} category={cat} index={i} />
                ))
              : Array.from({ length: 4 }).map((_, i) => (
                  <CategoryCardSkeleton key={i} />
                ))}
        </div>

        {totalCategories !== undefined && totalCategories > 8 && (
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
