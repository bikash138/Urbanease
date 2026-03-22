import Image from "next/image";
import type { Metadata } from "next";
import { Suspense } from "react";
import { CategoryGrid } from "@/components/public/categories/CategoryGrid";
import { CategoryGridFallback } from "@/components/public/fallbacks/CategoryGridFallback";

export const metadata: Metadata = {
  title: "Page not found — Urbanease",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <main className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-10 items-start">
            <div className="flex flex-col gap-5 sm:gap-6">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-zinc-900 leading-tight">
                We&apos;re sorry, we couldn&apos;t find what you were looking
                for!
              </h1>

              <div className="relative w-full max-w-xl mx-auto lg:mx-0 aspect-4/3 rounded-2xl overflow-hidden">
                <Image
                  src="/404.png"
                  alt=""
                  fill
                  priority
                  className="object-contain object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:gap-4 min-w-0">
              <p className="text-base font-medium text-zinc-800">
                Explore other services present in your area
              </p>
              <Suspense fallback={<CategoryGridFallback />}>
                <CategoryGrid />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
