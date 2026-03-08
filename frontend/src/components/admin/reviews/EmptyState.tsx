import { ShieldCheck } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="size-16 rounded-full bg-green-50 border border-green-100 flex items-center justify-center mb-4 dark:bg-green-900/20 dark:border-green-800/50">
        <ShieldCheck className="size-8 text-green-500" />
      </div>
      <p className="font-semibold text-foreground text-lg">All clear!</p>
      <p className="text-sm text-muted-foreground mt-1 max-w-xs">
        No flagged reviews at the moment. Flagged reviews from providers will
        appear here for moderation.
      </p>
    </div>
  );
}
