import { Image } from "@imagekit/next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { PublicServiceDetail } from "@/types/public/public.types";

type ProviderEntry = PublicServiceDetail["providers"][number];

interface ProviderCardProps {
  entry: ProviderEntry;
  basePrice: number;
  avgRating: number | null;
  reviewCount: number;
  serviceSlug?: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 ${
            i < Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-zinc-200 text-zinc-200"
          }`}
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1 text-xs font-semibold text-zinc-700">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

export default function ProviderCard({
  entry,
  basePrice,
  avgRating,
  reviewCount,
  serviceSlug,
}: ProviderCardProps) {
  const { provider } = entry;
  const price = entry.customPrice ?? basePrice;
  const bookHref = serviceSlug
    ? `/providers/${provider.slug}/book?service=${encodeURIComponent(serviceSlug)}`
    : null;

  return (
    <div className="bg-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-5 transition-all duration-200 group">
        {/* Left content */}
        <div className="flex-1 min-w-0 space-y-2.5 order-2 sm:order-1">
          <Link
            href={`/providers/${provider.slug}`}
            className="block space-y-1 hover:opacity-90 transition-opacity"
          >
            <h3 className="font-bold text-zinc-900 text-base leading-tight">
              {provider.user.name}
            </h3>

            <div className="flex items-center gap-2 flex-wrap">
              {avgRating !== null ? (
                <>
                  <StarRating rating={avgRating} />
                  <span className="text-xs text-zinc-400">
                    ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
                  </span>
                </>
              ) : (
                <span className="text-xs text-zinc-400">No reviews yet</span>
              )}
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="font-bold text-zinc-900">
                ₹{price.toLocaleString("en-IN")}
              </span>
              {provider.experience !== null && (
                <>
                  <span className="text-zinc-300 text-xs">•</span>
                  <span className="text-xs text-zinc-500">
                    {provider.experience}{" "}
                    {provider.experience === 1 ? "yr" : "yrs"} exp
                  </span>
                </>
              )}
            </div>
          </Link>
          {provider.bio && (
            <p className="text-sm text-zinc-500 line-clamp-2 leading-relaxed">
              {provider.bio}
            </p>
          )}

          <div className="pt-1 flex gap-2 flex-wrap">
            {bookHref ? (
              <Link href={bookHref}>
                <Button
                  size="sm"
                  className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-medium"
                >
                  Book Now
                </Button>
              </Link>
            ) : null}
            <Link href={`/providers/${provider.slug}`}>
              <Button
                variant="outline"
                size="sm"
                className="border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 rounded-lg text-xs font-medium"
              >
                View Provider
              </Button>
            </Link>
          </div>
        </div>

        {/* Image */}
        <Link
          href={`/providers/${provider.slug}`}
          className="relative w-full sm:w-28 aspect-video sm:aspect-auto sm:h-24 rounded-xl overflow-hidden shrink-0 bg-zinc-100 order-1 sm:order-2 block"
        >
          <Image
            src={provider.profileImage || "/error-placeholder-image.webp"}
            alt={provider.user.name}
            fill
            className="object-cover"
          />
        </Link>
      </div>
  );
}
