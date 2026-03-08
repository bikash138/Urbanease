import { Clock, Users, UserCheck, UserX } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";

interface ProviderStatsCardsProps {
  totalCount: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}

export function ProviderStatsCards({
  totalCount,
  pendingCount,
  approvedCount,
  rejectedCount,
}: ProviderStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Providers"
        count={totalCount}
        icon={<Users className="h-5 w-5 text-blue-600" />}
        bgClass="bg-blue-50 dark:bg-blue-900/20"
      />
      <StatCard
        label="Pending"
        count={pendingCount}
        icon={<Clock className="h-5 w-5 text-amber-600" />}
        bgClass="bg-amber-50 dark:bg-amber-900/20"
      />
      <StatCard
        label="Approved"
        count={approvedCount}
        icon={<UserCheck className="h-5 w-5 text-emerald-600" />}
        bgClass="bg-emerald-50 dark:bg-emerald-900/20"
      />
      <StatCard
        label="Rejected"
        count={rejectedCount}
        icon={<UserX className="h-5 w-5 text-rose-600" />}
        bgClass="bg-rose-50 dark:bg-rose-900/20"
      />
    </div>
  );
}
