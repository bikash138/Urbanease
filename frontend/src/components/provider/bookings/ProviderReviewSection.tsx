import { Flag, Loader2, AlertTriangle } from "lucide-react";
import type { BookingListItem } from "@/types/provider/provider-booking.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StarDisplay } from "@/components/common/star-display";

interface ProviderReviewSectionProps {
  booking: BookingListItem;
  onFlag: (reviewId: string) => void;
  isFlagging: boolean;
}

export function ProviderReviewSection({
  booking,
  onFlag,
  isFlagging,
}: ProviderReviewSectionProps) {
  const review = booking.review;

  if (!review) {
    return (
      <>
        <Separator />
        <div className="rounded-lg bg-muted/30 border border-border/60 px-3 py-2.5">
          <p className="text-xs text-muted-foreground text-center">
            No review submitted by the customer yet.
          </p>
        </div>
      </>
    );
  }

  const isFlagged = review.status === "FLAGGED";
  const isHidden = review.status === "HIDDEN";

  return (
    <>
      <Separator />
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Customer Review
          </p>
          {isFlagged ? (
            <Badge className="text-[10px] bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100">
              <AlertTriangle className="size-3 mr-1" />
              Flagged
            </Badge>
          ) : isHidden ? (
            <Badge className="text-[10px] bg-red-100 text-red-700 border-red-200 hover:bg-red-100">
              Hidden
            </Badge>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="h-6 px-2 text-[10px] text-orange-600 border-orange-200 hover:bg-orange-50 hover:text-orange-700 gap-1"
              onClick={() => onFlag(review.id)}
              disabled={isFlagging}
            >
              {isFlagging ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                <Flag className="size-3" />
              )}
              Flag
            </Button>
          )}
        </div>

        <div
          className={`rounded-lg px-3 py-2.5 space-y-1.5 ${
            isFlagged
              ? "bg-orange-50 border border-orange-100"
              : isHidden
              ? "bg-red-50/50 border border-red-100"
              : "bg-amber-50/60 border border-amber-100"
          }`}
        >
          <StarDisplay rating={review.rating} showLabel={false} size="sm" />
          {review.comment && (
            <p className="text-sm text-foreground leading-relaxed">
              {review.comment}
            </p>
          )}
          {isFlagged && (
            <p className="text-xs text-orange-600 mt-1">
              This review is pending admin review.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
