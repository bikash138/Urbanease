import type { ProviderServiceWithService } from "@/types/provider/provider-service.types";
import { ServiceCollapsible } from "./ServiceCollapsible";
import { Skeleton } from "@/components/ui/skeleton";

interface ServicesListProps {
  services: ProviderServiceWithService[];
  isLoading: boolean;
  onEdit: (item: ProviderServiceWithService) => void;
  onDelete: (item: ProviderServiceWithService) => void;
}

export function ServicesList({
  services,
  isLoading,
  onEdit,
  onDelete,
}: ServicesListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 rounded-xl" />
        ))}
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-12 text-center">
        <p className="text-sm font-medium text-foreground">
          No services listed yet.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Click &apos;Add Service&apos; to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {services.map((item) => (
        <ServiceCollapsible
          key={item.id}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
