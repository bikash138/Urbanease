"use client";

import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import type {
  PublicServiceDetail,
  PublicService,
} from "@/types/public/public.types";

interface ServiceSidebarProps {
  service: PublicServiceDetail | null | undefined;
  relatedServices: PublicService[];
  isLoadingService: boolean;
  isLoadingRelated: boolean;
  currentSlug: string;
}

export default function ServiceSidebar({
  service,
  relatedServices,
  isLoadingService,
  isLoadingRelated,
  currentSlug,
}: ServiceSidebarProps) {
  const providerCount = service?.providers?.length ?? 0;

  return (
    <aside className="hidden lg:flex w-[300px] shrink-0 flex-col h-[calc(100vh-4rem)] overflow-y-auto sticky top-16 border-r border-zinc-100 bg-white">
      <div className="p-6 space-y-7">
        <div className="space-y-2">
          {isLoadingService ? (
            <>
              <Skeleton className="h-7 w-4/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </>
          ) : service ? (
            <>
              <h1 className="text-xl font-bold text-zinc-900 leading-snug">
                {service.title}
              </h1>
              {service.description && (
                <p className="text-sm text-zinc-500 leading-relaxed">
                  {service.description}
                </p>
              )}
            </>
          ) : (
            <h1 className="text-xl font-bold text-zinc-900">Service</h1>
          )}
        </div>

        {/* Stats */}
        {isLoadingService ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        ) : service ? (
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-zinc-50 border border-zinc-100 p-3 space-y-0.5">
              <p className="text-lg font-bold text-zinc-900">{providerCount}</p>
              <p className="text-xs text-zinc-500">
                {providerCount === 1 ? "Provider" : "Providers"}
              </p>
            </div>
            <div className="rounded-xl bg-zinc-50 border border-zinc-100 p-3 space-y-0.5">
              <p className="text-lg font-bold text-zinc-900">
                ₹{service.basePrice.toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-zinc-500">Starts at</p>
            </div>
            {service.category && (
              <div className="col-span-2 rounded-xl bg-zinc-50 border border-zinc-100 p-3 space-y-0.5">
                <p className="text-sm font-semibold text-zinc-900">
                  {service.category.name}
                </p>
                <p className="text-xs text-zinc-500">Category</p>
              </div>
            )}
          </div>
        ) : null}

        {/*Related Services*/}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Related Services
          </p>

          {isLoadingRelated ? (
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-xl" />
              ))}
            </div>
          ) : relatedServices.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {relatedServices.map((s) => {
                const isActive = s.slug === currentSlug;
                return (
                  <Link
                    key={s.id}
                    href={`/services/${s.slug}`}
                    className={`group flex flex-col items-center gap-1.5 rounded-xl p-2 transition-colors ${
                      isActive
                        ? "bg-zinc-900"
                        : "bg-zinc-50 border border-zinc-100 hover:border-zinc-200 hover:bg-zinc-100"
                    }`}
                  >
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-zinc-200">
                      <Image
                        src={
                          s.image ||
                          "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2940&auto=format&fit=crop"
                        }
                        alt={s.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p
                      className={`text-[10px] font-medium text-center leading-tight line-clamp-2 ${
                        isActive ? "text-white" : "text-zinc-700"
                      }`}
                    >
                      {s.title}
                    </p>
                  </Link>
                );
              })}
            </div>
          ) : (
            !isLoadingRelated && (
              <p className="text-xs text-zinc-400">
                No related services found.
              </p>
            )
          )}
        </div>
      </div>
    </aside>
  );
}
