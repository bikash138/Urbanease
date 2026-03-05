interface StatCardProps {
  label: string;
  count: number;
  icon: React.ReactNode;
  bgClass: string;
  isPrice?: boolean;
}

export function StatCard({
  label,
  count,
  icon,
  bgClass,
  isPrice = false,
}: StatCardProps) {
  return (
    <div className={`rounded-lg border p-4 ${bgClass}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold mt-1">
            {isPrice ? `₹${count.toFixed(0)}` : count}
          </p>
        </div>
        <div className="rounded-full p-2 bg-background/80">{icon}</div>
      </div>
    </div>
  );
}
