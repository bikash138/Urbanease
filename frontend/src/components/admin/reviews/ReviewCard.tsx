import {
  Flag,
  Trash2,
  Eye,
  Loader2,
  MessageSquare,
  User,
  CalendarDays,
  Wrench,
  AlertTriangle,
} from "lucide-react";
import type { AdminFlaggedReview } from "@/types/admin/admin-review.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StarDisplay } from "@/components/common/star-display";
import { formatReviewDate } from "./utils";

interface ReviewCardProps {
  review: AdminFlaggedReview;
  onUnflag: (id: string) => void;
  onDelete: (id: string) => void;
  isUnflagging: boolean;
  isDeleting: boolean;
}

export function ReviewCard({
  review,
  onUnflag,
  onDelete,
  isUnflagging,
  isDeleting,
}: ReviewCardProps) {
  const isPending = isUnflagging || isDeleting;

  return (
    <Card className="border shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3 pt-4 px-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <StarDisplay rating={review.rating} />
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <CalendarDays className="size-3 shrink-0" />
              {formatReviewDate(review.booking.date)}
            </p>
          </div>
          <Badge className="text-[10px] shrink-0 bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800">
            <Flag className="size-3 mr-1" />
            Flagged
          </Badge>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="px-5 pt-4 pb-5 space-y-4">
        {/* Meta info */}
        <div className="grid grid-cols-1 gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="size-3.5 shrink-0 text-muted-foreground/70" />
            <span>
              Customer:{" "}
              <span className="font-medium text-foreground">
                {review.customer.name}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="size-3.5 shrink-0 text-blue-500" />
            <span>
              Provider:{" "}
              <span className="font-medium text-foreground">
                {review.provider.user.name}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Wrench className="size-3.5 shrink-0 text-muted-foreground/70" />
            <span className="truncate">
              {review.booking.providerService.service.title}
            </span>
          </div>
        </div>

        {/* Review comment */}
        {review.comment ? (
          <div className="flex items-start gap-2 text-sm bg-muted/40 rounded-lg px-3 py-2.5">
            <MessageSquare className="size-3.5 shrink-0 mt-0.5 text-muted-foreground/70" />
            <span className="text-foreground leading-relaxed">
              {review.comment}
            </span>
          </div>
        ) : (
          <div className="text-xs text-muted-foreground italic px-1">
            No comment provided.
          </div>
        )}

        {/* Flagged notice */}
        <div className="flex items-start gap-2 rounded-lg bg-orange-50 border border-orange-100 px-3 py-2 text-xs text-orange-700 dark:bg-orange-900/20 dark:border-orange-800/50 dark:text-orange-400">
          <AlertTriangle className="size-3.5 shrink-0 mt-0.5" />
          <span>Flagged by provider on {formatReviewDate(review.updatedAt)}.</span>
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex gap-2 pt-0.5">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 gap-1.5 text-emerald-700 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800 dark:text-emerald-400 dark:border-emerald-800 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-300"
            onClick={() => onUnflag(review.id)}
            disabled={isPending}
          >
            {isUnflagging ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Eye className="size-3.5" />
            )}
            {isUnflagging ? "Restoring…" : "Restore"}
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="flex-1 gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/5 hover:text-destructive"
            onClick={() => onDelete(review.id)}
            disabled={isPending}
          >
            {isDeleting ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Trash2 className="size-3.5" />
            )}
            {isDeleting ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
