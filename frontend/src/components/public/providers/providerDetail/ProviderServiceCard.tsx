import Link from "next/link";
import { IndianRupee } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PublicProviderDetail } from "@/types/public/public.types";

type ProviderServiceEntry = PublicProviderDetail["servicesOffered"][number];

interface ProviderServiceCardProps {
  entry: ProviderServiceEntry;
  providerSlug: string;
}

export function ProviderServiceCard({ entry, providerSlug }: ProviderServiceCardProps) {
  const price = entry.customPrice ?? entry.service.basePrice;
  const bookHref = `/providers/${providerSlug}/book?service=${encodeURIComponent(entry.service.slug)}`;

  return (
    <div className="group rounded-xl border border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-md transition-all duration-200 overflow-hidden">
      <Link href={`/services/${entry.service.slug}`} className="block">
        <div className="h-1 bg-linear-to-r from-zinc-800 via-zinc-700 to-zinc-600" />
        <div className="p-5 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="font-semibold text-zinc-900 group-hover:text-zinc-700 transition-colors truncate">
              {entry.service.title}
            </p>
            {entry.customPrice !== null && (
              <Badge
                variant="secondary"
                className="mt-1 text-xs bg-amber-50 text-amber-700 border-amber-200 border"
              >
                Custom pricing
              </Badge>
            )}
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-zinc-400">Price</p>
            <div className="flex items-center gap-0.5 justify-end">
              <IndianRupee className="w-3.5 h-3.5 text-zinc-900" />
              <span className="font-bold text-zinc-900">
                {price.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      </Link>
      <div className="px-5 pb-4 pt-0">
        <Link href={bookHref}>
          <Button size="sm" className="w-full rounded-lg">
            Book this service
          </Button>
        </Link>
      </div>
    </div>
  );
}
