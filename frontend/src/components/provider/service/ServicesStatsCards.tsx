import { ListChecks, CheckCircle2, XCircle } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";

interface ServicesStatsCardsProps {
  totalCount: number;
  availableCount: number;
  unavailableCount: number;
}

export function ServicesStatsCards({
  totalCount,
  availableCount,
  unavailableCount,
}: ServicesStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        label="Total Listed"
        count={totalCount}
        icon={<ListChecks className="h-5 w-5 text-violet-600" />}
        bgClass="bg-violet-50 dark:bg-violet-900/20"
      />
      <StatCard
        label="Available"
        count={availableCount}
        icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
        bgClass="bg-emerald-50 dark:bg-emerald-900/20"
      />
      <StatCard
        label="Unavailable"
        count={unavailableCount}
        icon={<XCircle className="h-5 w-5 text-rose-600" />}
        bgClass="bg-rose-50 dark:bg-rose-900/20"
      />
    </div>
  );
}
