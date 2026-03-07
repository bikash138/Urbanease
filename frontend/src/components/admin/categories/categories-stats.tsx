import { LayoutGrid, CheckCircle, XCircle } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { ServiceCategory } from "@/types/admin/admin-category.types";

interface CategoriesStatsProps {
  categories: ServiceCategory[];
}

export function CategoriesStats({ categories }: CategoriesStatsProps) {
  const totalCount = categories.length;
  const activeCount = categories.filter((c) => c.isActive).length;
  const inactiveCount = categories.filter((c) => !c.isActive).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        label="Total Categories"
        count={totalCount}
        icon={<LayoutGrid className="h-5 w-5 text-blue-600" />}
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
