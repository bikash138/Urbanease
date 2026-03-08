import { CalendarDays } from "lucide-react";

export function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="size-14 rounded-full bg-muted flex items-center justify-center mb-4">
        <CalendarDays className="size-7 text-muted-foreground" />
      </div>
      <p className="font-medium text-foreground">No {label} bookings</p>
      <p className="text-sm text-muted-foreground mt-1">
        They will appear here once available.
      </p>
    </div>
  );
}
