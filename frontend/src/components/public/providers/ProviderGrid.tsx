import { Users } from "lucide-react";
import { ProviderCard } from "./ProviderCard";
import { ProviderCardSkeleton } from "./ProviderCardSkeleton";
import type { PublicProvider } from "@/types/public/public.types";

interface ProviderGridProps {
  providers: PublicProvider[];
  isLoading: boolean;
}

export function ProviderGrid({ providers, isLoading }: ProviderGridProps) {
  const displayProviders = providers.slice(0, 4);

  return (
    <div className="flex-1 min-w-0 flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <ProviderCardSkeleton key={i} />
          ))
        ) : displayProviders.length > 0 ? (
          displayProviders.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto">
              <Users className="w-7 h-7 text-zinc-400" />
            </div>
            <p className="font-medium text-zinc-700">No providers found</p>
            <p className="text-sm text-zinc-400">
              No approved providers available yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
