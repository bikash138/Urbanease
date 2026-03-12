import { Image } from "@imagekit/next";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

interface Service {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  basePrice: number;
  image: string;
}

interface ServiceCardProps {
  service: Service;
}

export function ServiceCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white border border-zinc-100">
      <Skeleton className="w-full aspect-4/3" />
      <div className="p-3.5 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-8 w-28 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Link href={`/services/${service.slug}`} className="group block min-w-0">
      <div className="rounded-2xl overflow-hidden bg-white border border-zinc-100 transition-all duration-150 flex flex-col h-full min-w-0">
        {/*Image */}
        <div className="relative w-full aspect-4/3 bg-zinc-100 shrink-0">
          <Image
            src={service.image || "/error-placeholder-image.webp"}
            alt={service.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>

        {/*Content */}
        <div className="p-3 sm:p-3.5 flex flex-col gap-2 flex-1 min-w-0">
          <p className="text-sm font-semibold text-zinc-900 leading-snug group-hover:text-zinc-700 transition-colors">
            {service.title}
          </p>

          {service.description && (
            <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2 flex-1">
              {service.description}
            </p>
          )}

          <div className="flex items-center justify-between pt-1">
            <p className="text-base font-bold text-zinc-900">
              ₹{service.basePrice.toLocaleString("en-IN")}
            </p>
            <span className="text-xs font-medium text-zinc-500 bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1 group-hover:bg-zinc-900 group-hover:text-white group-hover:border-zinc-900 transition-all">
              View Providers
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
