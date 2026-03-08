import Link from "next/link";
import Image from "next/image";
import { PublicCategory } from "@/types/public/public.types";

interface CategoryGridItemProps {
  category: PublicCategory;
}

export function CategoryGridItem({ category }: CategoryGridItemProps) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group flex flex-col items-center gap-1.5 rounded-xl border-zinc-200 bg-white transition-all duration-200 p-2"
    >
      <div className="relative w-16 h-16 rounded-xl bg-zinc-100 overflow-hidden shrink-0">
        <Image
          src={
            category.image ||
            "https://urbanease.t3.storage.dev/public/error-placeholder-image.png"
          }
          alt={category.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <p className="text-sm font-medium text-zinc-700 text-center group-hover:text-zinc-900 transition-colors leading-snug line-clamp-2">
        {category.name}
      </p>
    </Link>
  );
}
