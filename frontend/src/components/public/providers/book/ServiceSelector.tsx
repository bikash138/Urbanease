"use client";

import { IndianRupee } from "lucide-react";
import type { PublicProviderDetail } from "@/types/public/public.types";

export type ServiceEntry = {
  id: string;
  slug: string;
  price: number;
  title: string;
};

interface ServiceSelectorProps {
  provider: PublicProviderDetail;
  selectedService: ServiceEntry | null;
  onSelect: (entry: ServiceEntry) => void;
}

export function ServiceSelector({
  provider,
  selectedService,
  onSelect,
}: ServiceSelectorProps) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-4">
      <h2 className="font-semibold text-zinc-900 flex items-center gap-2.5 text-sm">
        <span className="w-6 h-6 rounded-full bg-zinc-900 text-white text-xs flex items-center justify-center font-bold shrink-0">
          1
        </span>
        Select a Service
      </h2>
      {provider.servicesOffered.length === 0 ? (
        <p className="text-sm text-zinc-400 italic">
          No services listed by this provider.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-2.5">
          {provider.servicesOffered.map((entry) => {
            const price = entry.customPrice ?? entry.service.basePrice;
            const isSelected = selectedService?.id === entry.id;
            return (
              <button
                key={entry.id}
                onClick={() =>
                  onSelect({
                    id: entry.id,
                    slug: entry.service.slug,
                    price,
                    title: entry.service.title,
                  })
                }
                className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all duration-150 ${
                  isSelected
                    ? "border-zinc-900 bg-zinc-900 text-white"
                    : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-400 hover:bg-white"
                }`}
              >
                <p className="font-semibold text-sm truncate">
                  {entry.service.title}
                </p>
                <div
                  className={`flex items-center gap-0.5 mt-1 text-xs ${isSelected ? "text-zinc-300" : "text-zinc-400"}`}
                >
                  <IndianRupee className="w-3 h-3" />
                  {price.toLocaleString("en-IN")}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
