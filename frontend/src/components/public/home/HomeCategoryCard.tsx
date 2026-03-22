import { Image } from "@imagekit/next";
import { getImageUrl } from "@/lib/imagekit-url-generator";
import type { PublicCategory } from "@/types/public/public.types";

export function CategoryCard({ category }: { category: PublicCategory }) {
  return (
    <div className="group cursor-pointer rounded-2xl overflow-hidden transition-all duration-200">
      <div className="relative w-full aspect-square bg-zinc-100">
        <Image
          src={
            getImageUrl(category.image, "card") ||
            "/error-placeholder-image.webp"
          }
          alt={category.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
        />
      </div>
      <div className="px-3 py-2.5">
        <p className="text-sm font-medium text-zinc-900 leading-snug">
          {category.name}
        </p>
      </div>
    </div>
  );
}
