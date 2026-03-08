"use client";

import { useState } from "react";
import { Flag } from "lucide-react";
import {
  useAdminFlaggedReviews,
  useUpdateAdminReviewStatus,
  useDeleteAdminReview,
} from "@/hooks/admin/useAdminReview";

import { ConfirmDialog } from "@/components/common/confirm-dialog";
import {
  ReviewCard,
  ReviewCardSkeleton,
  EmptyState,
} from "@/components/admin/reviews";

export default function AdminReviewsPage() {
  const { data: reviews = [], isLoading } = useAdminFlaggedReviews();
  const unflagMutation = useUpdateAdminReviewStatus();
  const deleteMutation = useDeleteAdminReview();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<"unflag" | "delete" | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  function openUnflag(id: string) {
    setActiveId(id);
    setActiveAction("unflag");
    setDialogOpen(true);
  }

  function openDelete(id: string) {
    setActiveId(id);
    setActiveAction("delete");
    setDialogOpen(true);
  }

  async function handleConfirm() {
    if (!activeId || !activeAction) return;
    setDialogOpen(false);
    try {
      if (activeAction === "unflag") {
        await unflagMutation.mutateAsync({ id: activeId, status: "VISIBLE" });
      } else {
        await deleteMutation.mutateAsync(activeId);
      }
    } finally {
      setActiveId(null);
      setActiveAction(null);
    }
  }

  const pendingUnflagId = unflagMutation.isPending ? activeId : null;
  const pendingDeleteId = deleteMutation.isPending ? activeId : null;

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Flagged Reviews</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Review and moderate content flagged by providers
          </p>
        </div>
        {!isLoading && reviews.length > 0 && (
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-2 text-sm bg-orange-50 border border-orange-200 px-4 py-2 rounded-lg dark:bg-orange-900/20 dark:border-orange-800/50">
              <Flag className="size-4 text-orange-500" />
              <span>
                <span className="font-semibold text-orange-800 dark:text-orange-400">
                  {reviews.length}
                </span>{" "}
                <span className="text-orange-700 dark:text-orange-300">
                  flagged review{reviews.length !== 1 ? "s" : ""}
                </span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <ReviewCardSkeleton key={i} />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onUnflag={openUnflag}
              onDelete={openDelete}
              isUnflagging={pendingUnflagId === review.id}
              isDeleting={pendingDeleteId === review.id}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={dialogOpen}
        onOpenChange={(open) => !open && setDialogOpen(false)}
        primaryText={
          activeAction === "unflag"
            ? "Restore this review?"
            : "Delete this review?"
        }
        secondaryText={
          activeAction === "unflag"
            ? "The review will be marked as visible again and shown publicly to customers."
            : "This review will be permanently deleted. This action cannot be undone."
        }
        primaryButtonText={
          activeAction === "unflag" ? "Yes, restore" : "Yes, delete"
        }
        onConfirm={handleConfirm}
        variant="confirm"
        primaryButtonClassName={
          activeAction === "unflag"
            ? "bg-emerald-600 text-white hover:bg-emerald-700"
            : "bg-destructive text-destructive-foreground hover:bg-destructive/90"
        }
      />
    </div>
  );
}
