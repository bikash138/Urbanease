import { Image } from "@imagekit/next";
import { getImageUrl } from "@/lib/imagekit-url-generator";
import Link from "next/link";
import type { PublicService } from "@/types/public/public.types";

export function HomeServiceCard({
  service,
  className,
}: {
  service: PublicService;
  className?: string;
}) {
  return (
    <Link href={`/services/${service.slug}`} className={className}>
      <div className="group overflow-hidden rounded-2xl bg-white transition-all duration-200">
        <div className="relative w-full aspect-square bg-zinc-100">
          <Image
            src={
              getImageUrl(service.image, "card") ||
              "/error-placeholder-image.webp"
            }
            alt={service.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
        <div className="px-3 py-3 space-y-2.5">
          <p className="text-sm font-medium text-zinc-900 leading-snug">
            {service.title}
          </p>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-zinc-400">Starting at</span>
              <p className="text-base font-bold text-zinc-900">
                ₹{service.basePrice.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
