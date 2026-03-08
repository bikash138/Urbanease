"use client";

import { useState } from "react";
import { Pencil, Trash2, Send, X, Loader2, AlertTriangle } from "lucide-react";

import {
  useCreateReview,
  useUpdateReview,
  useDeleteReview,
} from "@/hooks/customer/useCustomerReview";
import type { CustomerBookingListItem } from "@/types/customer/customer-booking.types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ConfirmDialog } from "@/components/common/confirm-dialog";

import { StarPicker } from "./StarPicker";

interface ReviewSectionProps {
  booking: CustomerBookingListItem;
}

export function ReviewSection({ booking }: ReviewSectionProps) {
  const existingReview = booking.review;
  const [mode, setMode] = useState<"view" | "write" | "edit">(
    existingReview ? "view" : "write",
  );
  const [rating, setRating] = useState(existingReview?.rating ?? 0);
  const [comment, setComment] = useState(existingReview?.comment ?? "");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const createReview = useCreateReview();
  const updateReview = useUpdateReview();
  const deleteReview = useDeleteReview();

  const isPending =
    createReview.isPending || updateReview.isPending || deleteReview.isPending;

  async function handleSubmit() {
    if (rating === 0) return;

    if (mode === "write") {
      await createReview.mutateAsync({
        bookingId: booking.id,
        rating,
        comment: comment.trim() || undefined,
      });
    } else if (mode === "edit" && existingReview) {
      await updateReview.mutateAsync({
        id: existingReview.id,
        payload: {
          rating,
          comment: comment.trim() || undefined,
        },
      });
    }
    setMode("view");
  }

  async function handleDelete() {
    if (!existingReview) return;
    await deleteReview.mutateAsync(existingReview.id);
    setDeleteConfirmOpen(false);
    setRating(0);
    setComment("");
    setMode("view");
  }

  function handleStartEdit() {
    setRating(existingReview?.rating ?? 0);
    setComment(existingReview?.comment ?? "");
    setMode("edit");
  }

  function handleCancelEdit() {
    setRating(existingReview?.rating ?? 0);
    setComment(existingReview?.comment ?? "");
    setMode("view");
  }

  const isFlagged = existingReview?.status === "FLAGGED";
  const isHidden = existingReview?.status === "HIDDEN";

  return (
    <>
      <Separator />
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Your Review
          </p>
          {existingReview && mode === "view" && !isFlagged && !isHidden && (
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                className="h-7 px-2 text-muted-foreground hover:text-foreground"
                onClick={handleStartEdit}
                disabled={isPending}
              >
                <Pencil className="size-3.5" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => setDeleteConfirmOpen(true)}
                disabled={isPending}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          )}
        </div>

        {isFlagged && (
          <div className="rounded-lg bg-orange-50 border border-orange-200 px-3 py-2.5 text-xs text-orange-700">
            <p className="font-semibold mb-0.5">Review flagged</p>
            <p className="text-orange-600">
              This review has been flagged and is under admin review.
            </p>
          </div>
        )}

        {isHidden && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-3 text-xs text-red-700 space-y-1">
            <p className="font-semibold text-sm inline">
              <AlertTriangle className="size-4 shrink-0 text-amber-600 mt-0.5" />
            </p>
            <p className="text-red-600 leading-relaxed">
              This review has been removed and cannot be resubmitted for this
              booking.
            </p>
            <span>
              Reviews found to be fake, misleading, or fabricated. If this
              happens again your account can get suspended
            </span>
          </div>
        )}

        {mode === "view" && existingReview && !isFlagged && !isHidden && (
          <div className="rounded-lg bg-amber-50/60 border border-amber-100 px-3 py-2.5 space-y-1.5">
            <StarPicker value={existingReview.rating} readonly size="sm" />
            {existingReview.comment && (
              <p className="text-sm text-foreground leading-relaxed">
                {existingReview.comment}
              </p>
            )}
          </div>
        )}

        {(mode === "write" || mode === "edit") && !isHidden && (
          <div className="rounded-lg bg-muted/30 border border-border/60 px-3 py-3 space-y-3">
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground font-medium">
                {mode === "write"
                  ? "How was your experience?"
                  : "Update your rating"}
              </p>
              <StarPicker value={rating} onChange={setRating} />
              {rating === 0 && (
                <p className="text-xs text-muted-foreground">
                  Tap a star to rate
                </p>
              )}
            </div>

            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share details about your experience (optional)"
              rows={2}
              className="text-sm resize-none"
            />

            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={isPending || rating === 0}
                className="flex-1 gap-1.5"
              >
                {isPending ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Send className="size-3.5" />
                )}
                {isPending
                  ? "Submitting…"
                  : mode === "write"
                    ? "Submit Review"
                    : "Save Changes"}
              </Button>
              {mode === "edit" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={isPending}
                  className="gap-1"
                >
                  <X className="size-3.5" />
                  Cancel
                </Button>
              )}
            </div>

            {(createReview.error || updateReview.error) && (
              <p className="text-xs text-destructive">
                {(createReview.error as { message?: string })?.message ??
                  (updateReview.error as { message?: string })?.message ??
                  "Something went wrong"}
              </p>
            )}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        primaryText="Delete this review?"
        secondaryText="Your review will be permanently removed. This action cannot be undone."
        primaryButtonText="Delete"
        pendingButtonText="Deleting…"
        secondaryButtonText="Keep Review"
        onConfirm={handleDelete}
        variant="delete"
        isPending={isPending}
        secondaryButtonDisabled={isPending}
      />
    </>
  );
}
