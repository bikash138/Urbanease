"use client";

import { useState } from "react";
import {
  CalendarDays,
  User,
  Phone,
  MapPin,
  IndianRupee,
  MessageSquare,
  CheckCircle2,
  PlayCircle,
  Flag,
  Clock,
  Ban,
  Star,
  Loader2,
  AlertTriangle,
} from "lucide-react";

import {
  useProviderBookings,
  useConfirmBooking,
  useStartBooking,
  useCompleteBooking,
  useCancelBooking,
} from "@/hooks/provider/useProviderBooking";
import { useFlagReview } from "@/hooks/provider/useProviderReview";
import type { BookingListItem, BookingStatus } from "@/types/provider/provider-booking.types";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Pending",
    className:
      "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100",
  },
  CONFIRMED: {
    label: "Confirmed",
    className: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100",
  },
  IN_PROGRESS: {
    label: "In Progress",
    className:
      "bg-violet-100 text-violet-800 border-violet-200 hover:bg-violet-100",
  },
  COMPLETED: {
    label: "Completed",
    className:
      "bg-green-100 text-green-800 border-green-200 hover:bg-green-100",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-red-100 text-red-800 border-red-200 hover:bg-red-100",
  },
};

// ── Star Display (readonly) ─────────────────────────────────────────

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`size-3.5 ${
            star <= rating
              ? "fill-amber-400 text-amber-400"
              : "text-muted-foreground/30"
          }`}
        />
      ))}
    </div>
  );
}

// ── Review Section for provider card ───────────────────────────────

interface ProviderReviewSectionProps {
  booking: BookingListItem;
  onFlag: (reviewId: string) => void;
  isFlagging: boolean;
}

function ProviderReviewSection({
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
          <StarDisplay rating={review.rating} />
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

// ── Skeleton ───────────────────────────────────────────────────────

function BookingCardSkeleton() {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-4 w-48" />
        <Separator />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-9 flex-1 rounded-md" />
          <Skeleton className="h-9 flex-1 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}

// ── Empty state ────────────────────────────────────────────────────

function EmptyState({ label }: { label: string }) {
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

// ── Booking card ───────────────────────────────────────────────────

interface BookingCardProps {
  booking: BookingListItem;
  onConfirm?: (id: string) => void;
  onStart?: (id: string) => void;
  onComplete?: (id: string) => void;
  onCancel?: (id: string) => void;
  onFlag?: (reviewId: string) => void;
  isActionPending?: boolean;
  activeActionId?: string | null;
  isFlaggingId?: string | null;
  showReview?: boolean;
}

function BookingCard({
  booking,
  onConfirm,
  onStart,
  onComplete,
  onCancel,
  onFlag,
  isActionPending,
  activeActionId,
  isFlaggingId,
  showReview = false,
}: BookingCardProps) {
  const s = STATUS_CONFIG[booking.status];
  const isPending = isActionPending && activeActionId === booking.id;
  const isFlagging = !!isFlaggingId && booking.review?.id === isFlaggingId;

  return (
    <Card className="border shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header: service + status */}
      <CardHeader className="pb-3 pt-4 px-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-semibold text-base text-foreground truncate">
              {booking.providerService.service.title}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
              <CalendarDays className="size-3 shrink-0" />
              {formatDate(booking.date)}
            </p>
          </div>
          <Badge
            className={`text-xs font-medium border shrink-0 ${s.className}`}
          >
            {s.label}
          </Badge>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="px-5 pt-4 pb-5 space-y-4">
        {/* Info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="size-3.5 shrink-0 text-muted-foreground/70" />
            <span className="font-medium text-foreground truncate">
              {booking.customer.user.name}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <IndianRupee className="size-3.5 shrink-0 text-emerald-600" />
            <span className="font-semibold text-foreground">
              {booking.totalAmount.toFixed(2)}
            </span>
          </div>

          {booking.customer.user.phone && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="size-3.5 shrink-0 text-muted-foreground/70" />
              <span>{booking.customer.user.phone}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="size-3.5 shrink-0 text-muted-foreground/70" />
            <span className="truncate">
              {booking.address.city}, {booking.address.state}
            </span>
          </div>
        </div>

        {/* Customer note */}
        {booking.customerNote && (
          <div className="flex items-start gap-2 text-sm bg-muted/50 rounded-lg px-3 py-2">
            <MessageSquare className="size-3.5 shrink-0 mt-0.5 text-muted-foreground/70" />
            <span className="text-muted-foreground leading-relaxed">
              {booking.customerNote}
            </span>
          </div>
        )}

        {/* Review section for completed history */}
        {showReview && onFlag && (
          <ProviderReviewSection
            booking={booking}
            onFlag={onFlag}
            isFlagging={isFlagging}
          />
        )}

        {/* Action buttons */}
        {(onConfirm || onStart || onComplete || onCancel) && (
          <>
            <Separator />
            <div className="flex gap-2 pt-0.5">
              {/* Pending: Confirm + Cancel */}
              {onConfirm && (
                <>
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => onConfirm(booking.id)}
                    disabled={isPending}
                  >
                    {isPending ? (
                      <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="mr-1.5 size-3.5" />
                    )}
                    {isPending ? "Confirming…" : "Confirm"}
                  </Button>

                  {onCancel && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-destructive border-destructive/30 hover:bg-destructive/5"
                      onClick={() => onCancel(booking.id)}
                      disabled={isPending}
                    >
                      <Ban className="mr-1.5 size-3.5" />
                      Cancel
                    </Button>
                  )}
                </>
              )}

              {/* Confirmed: Start service + Cancel */}
              {onStart && (
                <>
                  <Button
                    size="sm"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => onStart(booking.id)}
                    disabled={isPending}
                  >
                    {isPending ? (
                      <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                    ) : (
                      <PlayCircle className="mr-1.5 size-3.5" />
                    )}
                    {isPending ? "Starting…" : "Start Service"}
                  </Button>

                  {onCancel && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive border-destructive/30 hover:bg-destructive/5"
                      onClick={() => onCancel(booking.id)}
                      disabled={isPending}
                    >
                      <Ban className="size-3.5" />
                    </Button>
                  )}
                </>
              )}

              {/* In progress: Mark complete */}
              {onComplete && (
                <Button
                  size="sm"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => onComplete(booking.id)}
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                  ) : (
                    <Flag className="mr-1.5 size-3.5" />
                  )}
                  {isPending ? "Completing…" : "Mark Complete"}
                </Button>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// ── Tab panel ──────────────────────────────────────────────────────

interface TabPanelProps {
  bookings: BookingListItem[];
  isLoading: boolean;
  emptyLabel: string;
  onConfirm?: (id: string) => void;
  onStart?: (id: string) => void;
  onComplete?: (id: string) => void;
  onCancel?: (id: string) => void;
  onFlag?: (reviewId: string) => void;
  isActionPending?: boolean;
  activeActionId?: string | null;
  isFlaggingId?: string | null;
  showReview?: boolean;
}

function TabPanel({
  bookings,
  isLoading,
  emptyLabel,
  onConfirm,
  onStart,
  onComplete,
  onCancel,
  onFlag,
  isActionPending,
  activeActionId,
  isFlaggingId,
  showReview,
}: TabPanelProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <BookingCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (bookings.length === 0) {
    return <EmptyState label={emptyLabel} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {bookings.map((b) => (
        <BookingCard
          key={b.id}
          booking={b}
          onConfirm={onConfirm}
          onStart={onStart}
          onComplete={onComplete}
          onCancel={onCancel}
          onFlag={onFlag}
          isActionPending={isActionPending}
          activeActionId={activeActionId}
          isFlaggingId={isFlaggingId}
          showReview={showReview}
        />
      ))}
    </div>
  );
}

// ── Tab badge ──────────────────────────────────────────────────────

function TabBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span className="ml-1.5 inline-flex items-center justify-center size-5 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold">
      {count > 99 ? "99+" : count}
    </span>
  );
}

// ── Page ───────────────────────────────────────────────────────────

export default function ProviderBookingsPage() {
  const { data: allBookings = [], isLoading } = useProviderBookings();

  const confirmMutation = useConfirmBooking();
  const startMutation = useStartBooking();
  const completeMutation = useCompleteBooking();
  const cancelMutation = useCancelBooking();
  const flagMutation = useFlagReview();

  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [flaggingReviewId, setFlaggingReviewId] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    bookingId: string;
    action: "confirm" | "start" | "complete" | "cancel";
  } | null>(null);
  const [flagDialog, setFlagDialog] = useState<{
    reviewId: string;
  } | null>(null);

  // Split by status
  const pending = allBookings.filter((b) => b.status === "PENDING");
  const confirmed = allBookings.filter((b) => b.status === "CONFIRMED");
  const inProgress = allBookings.filter((b) => b.status === "IN_PROGRESS");
  const history = allBookings.filter(
    (b) => b.status === "COMPLETED" || b.status === "CANCELLED",
  );

  const activeCount = pending.length + confirmed.length + inProgress.length;

  function openDialog(bookingId: string, action: "confirm" | "start" | "complete" | "cancel") {
    setConfirmDialog({ bookingId, action });
  }

  function openFlagDialog(reviewId: string) {
    setFlagDialog({ reviewId });
  }

  async function handleDialogConfirm() {
    if (!confirmDialog) return;
    const { bookingId, action } = confirmDialog;
    setActiveActionId(bookingId);
    setConfirmDialog(null);
    try {
      if (action === "confirm") await confirmMutation.mutateAsync(bookingId);
      if (action === "start") await startMutation.mutateAsync(bookingId);
      if (action === "complete") await completeMutation.mutateAsync(bookingId);
      if (action === "cancel") await cancelMutation.mutateAsync(bookingId);
    } finally {
      setActiveActionId(null);
    }
  }

  async function handleFlagConfirm() {
    if (!flagDialog) return;
    const { reviewId } = flagDialog;
    setFlaggingReviewId(reviewId);
    setFlagDialog(null);
    try {
      await flagMutation.mutateAsync(reviewId);
    } finally {
      setFlaggingReviewId(null);
    }
  }

  const isActionPending =
    confirmMutation.isPending ||
    startMutation.isPending ||
    completeMutation.isPending ||
    cancelMutation.isPending;

  const dialogMessages = {
    confirm: {
      title: "Confirm this booking?",
      description:
        "The customer will be notified that their booking has been confirmed.",
      action: "Yes, confirm",
      className: "bg-primary text-primary-foreground hover:bg-primary/90",
    },
    start: {
      title: "Start this service?",
      description:
        "This will mark the booking as In Progress. Make sure you are on-site.",
      action: "Yes, start",
      className: "bg-blue-600 text-white hover:bg-blue-700",
    },
    complete: {
      title: "Mark as completed?",
      description:
        "This will close the booking. The customer can now leave a review.",
      action: "Yes, complete",
      className: "bg-emerald-600 text-white hover:bg-emerald-700",
    },
    cancel: {
      title: "Cancel this booking?",
      description:
        "This action cannot be undone. The customer will be notified that their booking has been cancelled.",
      action: "Yes, cancel booking",
      className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    },
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Bookings</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage and track all your service bookings
          </p>
        </div>
        {!isLoading && (
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-yellow-50 border border-yellow-200 px-4 py-2 rounded-lg">
              <Clock className="size-4 text-yellow-600" />
              <span>
                <span className="font-semibold text-yellow-800">{pending.length}</span>{" "}
                <span className="text-yellow-700">pending</span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/60 px-4 py-2 rounded-lg">
              <CheckCircle2 className="size-4 text-emerald-600" />
              <span>
                <span className="font-semibold text-foreground">{activeCount}</span>{" "}
                active booking{activeCount !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pending">
        <TabsList className="w-full sm:w-auto h-auto flex-wrap gap-1 p-1">
          <TabsTrigger value="pending" className="text-sm">
            Pending
            <TabBadge count={pending.length} />
          </TabsTrigger>
          <TabsTrigger value="confirmed" className="text-sm">
            Confirmed
            <TabBadge count={confirmed.length} />
          </TabsTrigger>
          <TabsTrigger value="in-progress" className="text-sm">
            In Progress
            <TabBadge count={inProgress.length} />
          </TabsTrigger>
          <TabsTrigger value="history" className="text-sm">
            History
            <TabBadge count={history.length} />
          </TabsTrigger>
        </TabsList>

        <div className="mt-5">
          <TabsContent value="pending" className="mt-0">
            <TabPanel
              bookings={pending}
              isLoading={isLoading}
              emptyLabel="pending"
              onConfirm={(id) => openDialog(id, "confirm")}
              onCancel={(id) => openDialog(id, "cancel")}
              isActionPending={isActionPending}
              activeActionId={activeActionId}
            />
          </TabsContent>

          <TabsContent value="confirmed" className="mt-0">
            <TabPanel
              bookings={confirmed}
              isLoading={isLoading}
              emptyLabel="confirmed"
              onStart={(id) => openDialog(id, "start")}
              onCancel={(id) => openDialog(id, "cancel")}
              isActionPending={isActionPending}
              activeActionId={activeActionId}
            />
          </TabsContent>

          <TabsContent value="in-progress" className="mt-0">
            <TabPanel
              bookings={inProgress}
              isLoading={isLoading}
              emptyLabel="in-progress"
              onComplete={(id) => openDialog(id, "complete")}
              isActionPending={isActionPending}
              activeActionId={activeActionId}
            />
          </TabsContent>

          <TabsContent value="history" className="mt-0">
            <TabPanel
              bookings={history}
              isLoading={isLoading}
              emptyLabel="past"
              onFlag={openFlagDialog}
              isFlaggingId={flaggingReviewId}
              showReview
            />
          </TabsContent>
        </div>
      </Tabs>

      {/* Booking action confirmation dialog */}
      <AlertDialog
        open={!!confirmDialog}
        onOpenChange={(open) => !open && setConfirmDialog(null)}
      >
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmDialog ? dialogMessages[confirmDialog.action].title : ""}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog
                ? dialogMessages[confirmDialog.action].description
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-2">
            <AlertDialogCancel className="flex-1">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={`flex-1 ${confirmDialog ? dialogMessages[confirmDialog.action].className : ""}`}
              onClick={handleDialogConfirm}
            >
              {confirmDialog ? dialogMessages[confirmDialog.action].action : ""}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Flag review confirmation dialog */}
      <AlertDialog
        open={!!flagDialog}
        onOpenChange={(open) => !open && setFlagDialog(null)}
      >
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-orange-500" />
              Flag this review?
            </AlertDialogTitle>
            <AlertDialogDescription>
              The review will be flagged and sent to an admin for moderation.
              It will remain visible until the admin takes action.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-2">
            <AlertDialogCancel className="flex-1">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="flex-1 bg-orange-600 text-white hover:bg-orange-700"
              onClick={handleFlagConfirm}
            >
              Yes, flag it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
