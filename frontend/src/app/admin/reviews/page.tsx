"use client";

import { useState } from "react";
import {
  Star,
  Flag,
  Trash2,
  Eye,
  Loader2,
  MessageSquare,
  User,
  CalendarDays,
  Wrench,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";

import {
  useAdminFlaggedReviews,
  useUpdateAdminReviewStatus,
  useDeleteAdminReview,
} from "@/hooks/admin/useAdminReview";
import type { AdminFlaggedReview } from "@/types/admin/admin-review.types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// ── Helpers ────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ── Star Display ───────────────────────────────────────────────────

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`size-4 ${
            star <= rating
              ? "fill-amber-400 text-amber-400"
              : "text-muted-foreground/25"
          }`}
        />
      ))}
      <span className="ml-1.5 text-sm font-semibold text-foreground">
        {rating}/5
      </span>
    </div>
  );
}

// ── Skeleton ───────────────────────────────────────────────────────

function ReviewCardSkeleton() {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4 space-y-3">
        <Skeleton className="h-4 w-44" />
        <Skeleton className="h-4 w-56" />
        <Skeleton className="h-10 w-full rounded-md" />
        <Separator />
        <div className="flex gap-2">
          <Skeleton className="h-8 flex-1 rounded-md" />
          <Skeleton className="h-8 flex-1 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}

// ── Empty State ────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="size-16 rounded-full bg-green-50 border border-green-100 flex items-center justify-center mb-4">
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

// ── Review Card ───────────────────────────────────────────────────

interface ReviewCardProps {
  review: AdminFlaggedReview;
  onUnflag: (id: string) => void;
  onDelete: (id: string) => void;
  isUnflagging: boolean;
  isDeleting: boolean;
}

function ReviewCard({
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
              {formatDate(review.booking.date)}
            </p>
          </div>
          <Badge className="text-[10px] shrink-0 bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100">
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
              <span className="font-medium text-foreground">{review.customer.name}</span>
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
            <span className="text-foreground leading-relaxed">{review.comment}</span>
          </div>
        ) : (
          <div className="text-xs text-muted-foreground italic px-1">
            No comment provided.
          </div>
        )}

        {/* Flagged notice */}
        <div className="flex items-start gap-2 rounded-lg bg-orange-50 border border-orange-100 px-3 py-2 text-xs text-orange-700">
          <AlertTriangle className="size-3.5 shrink-0 mt-0.5" />
          <span>
            Flagged by provider on {formatDate(review.updatedAt)}.
          </span>
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex gap-2 pt-0.5">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 gap-1.5 text-emerald-700 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"
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

// ── Page ──────────────────────────────────────────────────────────

export default function AdminReviewsPage() {
  const { data: reviews = [], isLoading } = useAdminFlaggedReviews();
  const unflagMutation = useUpdateAdminReviewStatus();
  const deleteMutation = useDeleteAdminReview();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<"unflag" | "delete" | null>(null);
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
            <div className="flex items-center gap-2 text-sm bg-orange-50 border border-orange-200 px-4 py-2 rounded-lg">
              <Flag className="size-4 text-orange-500" />
              <span>
                <span className="font-semibold text-orange-800">{reviews.length}</span>{" "}
                <span className="text-orange-700">
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

      {/* Confirmation Dialog */}
      <AlertDialog open={dialogOpen} onOpenChange={(open) => !open && setDialogOpen(false)}>
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {activeAction === "unflag" ? "Restore this review?" : "Delete this review?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {activeAction === "unflag"
                ? "The review will be marked as visible again and shown publicly to customers."
                : "This review will be permanently deleted. This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-2">
            <AlertDialogCancel className="flex-1">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={`flex-1 ${
                activeAction === "unflag"
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "bg-destructive text-destructive-foreground hover:bg-destructive/90"
              }`}
              onClick={handleConfirm}
            >
              {activeAction === "unflag" ? "Yes, restore" : "Yes, delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
