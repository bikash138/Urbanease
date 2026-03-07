import { StatCard } from "@/components/admin/stat-card";
import { Wrench, CheckCircle, XCircle, IndianRupee } from "lucide-react";
import { Service } from "@/types/admin/admin-service.types";

interface ServicesStatsProps {
  services: Service[];
}

export function ServicesStats({ services }: ServicesStatsProps) {
  const totalCount = services.length;
  const activeCount = services.filter((s) => s.isActive).length;
  const inactiveCount = services.filter((s) => !s.isActive).length;
  const avgPrice =
    services.length > 0
      ? services.reduce((sum, s) => sum + s.basePrice, 0) / services.length
      : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Services"
        count={totalCount}
        icon={<Wrench className="h-5 w-5 text-blue-600" />}
        bgClass="bg-blue-50 dark:bg-blue-900/20"
      />
      <StatCard
        label="Active"
        count={activeCount}
        icon={<CheckCircle className="h-5 w-5 text-emerald-600" />}
        bgClass="bg-emerald-50 dark:bg-emerald-900/20"
      />
      <StatCard
        label="Inactive"
        count={inactiveCount}
        icon={<XCircle className="h-5 w-5 text-rose-600" />}
        bgClass="bg-rose-50 dark:bg-rose-900/20"
      />
      <StatCard
        label="Avg. Price"
        count={avgPrice}
        icon={<IndianRupee className="h-5 w-5 text-violet-600" />}
        bgClass="bg-violet-50 dark:bg-violet-900/20"
        isPrice
      />
    </div>
  );
}
