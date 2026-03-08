import { MapPin, CheckCircle, XCircle } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { Area } from "@/types/admin/admin-area.types";

interface AreasStatsProps {
  areas: Area[];
}

export function AreasStats({ areas }: AreasStatsProps) {
  const totalCount = areas.length;
  const activeCount = areas.filter((a) => a.isActive).length;
  const inactiveCount = areas.filter((a) => !a.isActive).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        label="Total Areas"
        count={totalCount}
        icon={<MapPin className="h-5 w-5 text-blue-600" />}
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
    </div>
  );
}
