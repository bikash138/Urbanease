import { Star } from "lucide-react";

interface StarDisplayProps {
  rating: number;
  /** Show "{rating}/5" label. Default: true */
  showLabel?: boolean;
  /** Star size: "sm" (3.5) or "md" (4). Default: "md" */
  size?: "sm" | "md";
}

export function StarDisplay({
  rating,
  showLabel = true,
  size = "md",
}: StarDisplayProps) {
  const iconSize = size === "sm" ? "size-3.5" : "size-4";
  const unfilledClass =
    size === "sm" ? "text-muted-foreground/30" : "text-muted-foreground/25";

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${iconSize} ${
            star <= rating
              ? "fill-amber-400 text-amber-400"
              : unfilledClass
          }`}
        />
      ))}
      {showLabel && (
        <span className="ml-1.5 text-sm font-semibold text-foreground">
          {rating}/5
        </span>
      )}
    </div>
  );
}
