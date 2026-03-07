"use client";

import { useState, useEffect } from "react";
import {
  CalendarDays,
  Clock,
  MapPin,
  IndianRupee,
  Ban,
  CalendarClock,
  Star,
  Loader2,
  Wrench,
  User,
  MessageSquare,
  Pencil,
  Trash2,
  Send,
  X,
  ImageIcon,
} from "lucide-react";

import {
  useCustomerBookings,
  useCancelCustomerBooking,
  useRescheduleBooking,
} from "@/hooks/customer/useCustomerBooking";
import {
  useCreateReview,
  useUpdateReview,
  useDeleteReview,
} from "@/hooks/customer/useCustomerReview";
import { usePublicProviderSlots } from "@/hooks/public/usePublic";
import type {
  CustomerBookingListItem,
  BookingStatus,
} from "@/types/customer/customer-booking.types";
import type { SlotLabel, PublicSlot } from "@/types/public/public.types";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
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
import { cn } from "@/lib/utils";

// ── Helpers ────────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getMinDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

function getMaxDate() {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return d.toISOString().split("T")[0];
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

// ── Slot Selector (single-select) ─────────────────────────────────────────

const LABEL_ORDER: SlotLabel[] = ["MORNING", "AFTERNOON", "NIGHT"];
const LABEL_DISPLAY: Record<SlotLabel, string> = {
  MORNING: "Morning",
  AFTERNOON: "Afternoon",
  NIGHT: "Night",
};

function SlotButton({
  slot,
  selected,
  onSelect,
}: {
  slot: PublicSlot;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex items-center gap-1.5 px-3 py-2 rounded-md border text-xs font-medium transition-colors w-full text-left",
        selected
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-muted/40 text-foreground border-border hover:bg-muted",
      )}
    >
      <Clock className="h-3 w-3 shrink-0" />
      {slot.startTime} – {slot.endTime}
    </button>
  );
}

function SingleSlotSelector({
  slots,
  selectedId,
  onChange,
  error,
}: {
  slots: PublicSlot[];
  selectedId: string;
  onChange: (id: string) => void;
  error?: string;
}) {
  const grouped = LABEL_ORDER.reduce<Record<SlotLabel, PublicSlot[]>>(
    (acc, label) => {
      acc[label] = slots.filter((s) => s.label === label);
      return acc;
    },
    { MORNING: [], AFTERNOON: [], NIGHT: [] },
  );

  if (slots.length === 0) {
    return (
      <p className="text-sm text-muted-foreground border rounded-md p-4 text-center">
        No slots available for this date.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {LABEL_ORDER.map((label) => {
        if (grouped[label].length === 0) return null;
        return (
          <div key={label}>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
              {LABEL_DISPLAY[label]}
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {grouped[label].map((slot) => (
                <SlotButton
                  key={slot.id}
                  slot={slot}
                  selected={selectedId === slot.id}
                  onSelect={() => onChange(slot.id)}
                />
              ))}
            </div>
          </div>
        );
      })}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

// ── Star Rating Picker ─────────────────────────────────────────────────────

function StarPicker({
  value,
  onChange,
  readonly = false,
  size = "md",
}: {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
  size?: "sm" | "md";
}) {
  const [hovered, setHovered] = useState(0);
  const sizeClass = size === "sm" ? "size-3.5" : "size-5";

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = (hovered || value) >= star;
        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => !readonly && onChange?.(star)}
            onMouseEnter={() => !readonly && setHovered(star)}
            onMouseLeave={() => !readonly && setHovered(0)}
            className={cn(
              "transition-transform",
              !readonly && "hover:scale-110 cursor-pointer",
              readonly && "cursor-default",
            )}
          >
            <Star
              className={cn(
                sizeClass,
                filled
                  ? "fill-amber-400 text-amber-400"
                  : "text-muted-foreground/40",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

// ── Before/After Images Section (history only) ──────────────────────────────

interface BeforeAfterImagesSectionProps {
  images?: { id: string; url: string; type: "BEFORE" | "AFTER" }[];
}

function BeforeAfterImagesSection({ images = [] }: BeforeAfterImagesSectionProps) {
  const beforeImage = images.find((img) => img.type === "BEFORE");
  const afterImage = images.find((img) => img.type === "AFTER");

  if (beforeImage || afterImage) {
    return (
      <>
        <Separator />
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Service Photos
          </p>
          <div className="grid grid-cols-2 gap-3">
            {beforeImage && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">
                  Before
                </p>
                <a
                  href={beforeImage.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-lg overflow-hidden border border-border aspect-video bg-muted/50 hover:opacity-90 transition-opacity"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={beforeImage.url}
                    alt="Before service"
                    className="object-cover w-full h-full"
                  />
                </a>
              </div>
            )}
            {afterImage && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">
                  After
                </p>
                <a
                  href={afterImage.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-lg overflow-hidden border border-border aspect-video bg-muted/50 hover:opacity-90 transition-opacity"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={afterImage.url}
                    alt="After service"
                    className="object-cover w-full h-full"
                  />
                </a>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  return null;
}

// ── Review Section (inside booking card for completed bookings) ─────────────

interface ReviewSectionProps {
  booking: CustomerBookingListItem;
}

function ReviewSection({ booking }: ReviewSectionProps) {
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

  useEffect(() => {
    if (existingReview) {
      setMode("view");
      setRating(
        existingReview.status !== "DELETED" ? existingReview.rating : 0,
      );
      setComment(
        existingReview.status !== "DELETED"
          ? (existingReview.comment ?? "")
          : "",
      );
    } else {
      setMode("write");
      setRating(0);
      setComment("");
    }
  }, [existingReview]);

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
  const isDeleted = existingReview?.status === "DELETED";

  return (
    <>
      <Separator />
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Your Review
          </p>
          {existingReview &&
            mode === "view" &&
            !isFlagged &&
            !isHidden &&
            !isDeleted && (
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

        {/* Deleted notice — review was removed, no re-review allowed */}
        {isDeleted && (
          <div className="rounded-lg bg-muted/50 border border-border/60 px-3 py-2.5 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground mb-0.5">
              Review removed
            </p>
            <p>
              You deleted your review for this booking. Reviews can only be
              submitted once per booking.
            </p>
          </div>
        )}

        {/* Flagged / Hidden notice */}
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
            <p className="font-semibold text-sm">Review removed by admin</p>
            <p className="text-red-600 leading-relaxed">
              Your comment was found to violate our platform&apos;s community
              standards regarding ethnicity and conduct. The review has been
              permanently hidden and cannot be resubmitted for this booking.
            </p>
          </div>
        )}

        {/* View mode */}
        {mode === "view" &&
          existingReview &&
          !isFlagged &&
          !isHidden &&
          !isDeleted && (
            <div className="rounded-lg bg-amber-50/60 border border-amber-100 px-3 py-2.5 space-y-1.5">
              <StarPicker value={existingReview.rating} readonly size="sm" />
              {existingReview.comment && (
                <p className="text-sm text-foreground leading-relaxed">
                  {existingReview.comment}
                </p>
              )}
            </div>
          )}

        {/* Write / Edit form — never shown for deleted or admin-hidden reviews */}
        {(mode === "write" || mode === "edit") && !isDeleted && !isHidden && (
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

      {/* Delete confirmation */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this review?</AlertDialogTitle>
            <AlertDialogDescription>
              Your review will be permanently removed. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-2">
            <AlertDialogCancel className="flex-1" disabled={isPending}>
              Keep Review
            </AlertDialogCancel>
            <AlertDialogAction
              className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="size-3.5 animate-spin mr-1" />
              ) : null}
              {isPending ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ── Reschedule Sheet ───────────────────────────────────────────────────────

interface RescheduleSheetProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  booking: CustomerBookingListItem | null;
  onConfirm: (bookingId: string, slotId: string, date: string) => void;
  isPending: boolean;
  error: string | null;
}

function RescheduleSheet({
  open,
  onOpenChange,
  booking,
  onConfirm,
  isPending,
  error,
}: RescheduleSheetProps) {
  const providerSlug = booking?.providerService.provider.slug ?? null;
  const serviceSlug = booking?.providerService.service.slug ?? null;

  const [date, setDate] = useState("");
  const [slotId, setSlotId] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const providerServiceId = booking?.providerService.id ?? null;
  const { data: slots = [], isLoading: slotsLoading } = usePublicProviderSlots(
    open && date ? providerSlug : null,
    open && date ? date : null,
    open && date ? providerServiceId : null,
  );

  useEffect(() => {
    if (open) {
      setDate("");
      setSlotId("");
      setValidationError(null);
    }
  }, [open]);

  useEffect(() => {
    setSlotId("");
  }, [date]);

  function handleSubmit() {
    if (!date) {
      setValidationError("Please select a date.");
      return;
    }
    if (!slotId) {
      setValidationError("Please select a time slot.");
      return;
    }
    setValidationError(null);
    if (booking) onConfirm(booking.id, slotId, date);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="pb-2">
          <SheetTitle>Reschedule Booking</SheetTitle>
          <SheetDescription>
            Pick a new date and time slot for{" "}
            <span className="font-medium text-foreground">
              {booking?.providerService.service.title}
            </span>
            . Only pending bookings can be rescheduled.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 pb-2 space-y-5">
          {booking && (
            <div className="rounded-lg bg-muted/50 border border-border/60 px-4 py-3 space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Current Schedule
              </p>
              <p className="text-sm text-foreground font-medium">
                {formatDate(booking.date)}
              </p>
            </div>
          )}

          <div className="space-y-1.5">
            <Label className="text-slate-700 font-medium">New Date</Label>
            <Input
              type="date"
              value={date}
              min={getMinDate()}
              max={getMaxDate()}
              onChange={(e) => setDate(e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              You can book 1 to 3 days in advance.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label className="text-slate-700 font-medium">New Time Slot</Label>
            {!date ? (
              <p className="text-sm text-muted-foreground border rounded-md p-4 text-center">
                Select a date above to see available slots.
              </p>
            ) : slotsLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-9 w-full rounded-md" />
                ))}
              </div>
            ) : (
              <SingleSlotSelector
                slots={slots}
                selectedId={slotId}
                onChange={setSlotId}
              />
            )}
          </div>

          {(validationError || error) && (
            <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
              {validationError ?? error}
            </div>
          )}
        </div>

        <SheetFooter className="border-t border-border/60 pt-4">
          <SheetClose asChild>
            <Button variant="outline" size="sm" disabled={isPending}>
              Cancel
            </Button>
          </SheetClose>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={isPending || slotsLoading}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                Rescheduling…
              </>
            ) : (
              "Confirm Reschedule"
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// ── Booking Card Skeleton ─────────────────────────────────────────────────

function BookingCardSkeleton() {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-44" />
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
        <Separator />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-8 flex-1 rounded-md" />
          <Skeleton className="h-8 flex-1 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────

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

// ── Booking Card ──────────────────────────────────────────────────────────

interface BookingCardProps {
  booking: CustomerBookingListItem;
  onCancel?: (b: CustomerBookingListItem) => void;
  onReschedule?: (b: CustomerBookingListItem) => void;
  isActionPending?: boolean;
  activeActionId?: string | null;
  showReview?: boolean;
}

function BookingCard({
  booking,
  onCancel,
  onReschedule,
  isActionPending,
  activeActionId,
  showReview = false,
}: BookingCardProps) {
  const s = STATUS_CONFIG[booking.status];
  const isPending = isActionPending && activeActionId === booking.id;

  return (
    <Card className="border shadow-sm hover:shadow-md transition-shadow duration-200">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="size-3.5 shrink-0 text-muted-foreground/70" />
            <span className="font-medium text-foreground truncate">
              {booking.providerService.provider.user.name}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <IndianRupee className="size-3.5 shrink-0 text-emerald-600" />
            <span className="font-semibold text-foreground">
              {booking.totalAmount.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="size-3.5 shrink-0 text-muted-foreground/70" />
            <span className="truncate">
              {booking.address.city}, {booking.address.state}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Wrench className="size-3.5 shrink-0 text-muted-foreground/70" />
            <span className="truncate">{booking.address.street}</span>
          </div>
        </div>

        {booking.customerNote && (
          <div className="flex items-start gap-2 text-sm bg-muted/50 rounded-lg px-3 py-2">
            <MessageSquare className="size-3.5 shrink-0 mt-0.5 text-muted-foreground/70" />
            <span className="text-muted-foreground leading-relaxed">
              {booking.customerNote}
            </span>
          </div>
        )}

        {booking.providerNote && (
          <div className="flex items-start gap-2 text-sm bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
            <MessageSquare className="size-3.5 shrink-0 mt-0.5 text-blue-500" />
            <div>
              <p className="text-xs font-semibold text-blue-600 mb-0.5">
                Provider note
              </p>
              <span className="text-blue-700 leading-relaxed">
                {booking.providerNote}
              </span>
            </div>
          </div>
        )}

        {(onCancel || onReschedule) && (
          <>
            <Separator />
            <div className="flex gap-2 pt-0.5 flex-wrap">
              {onReschedule && booking.status === "PENDING" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 gap-1.5"
                  onClick={() => onReschedule(booking)}
                  disabled={isPending}
                >
                  <CalendarClock className="size-3.5" />
                  Reschedule
                </Button>
              )}
              {onCancel && (
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/5 hover:text-destructive"
                  onClick={() => onCancel(booking)}
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Ban className="size-3.5" />
                  )}
                  {isPending ? "Cancelling…" : "Cancel"}
                </Button>
              )}
            </div>
          </>
        )}

        {showReview && (
          <>
            <BeforeAfterImagesSection images={booking.images ?? []} />
            <ReviewSection booking={booking} />
          </>
        )}
      </CardContent>
    </Card>
  );
}

// ── Tab Panel ─────────────────────────────────────────────────────────────

interface TabPanelProps {
  bookings: CustomerBookingListItem[];
  isLoading: boolean;
  emptyLabel: string;
  onCancel?: (b: CustomerBookingListItem) => void;
  onReschedule?: (b: CustomerBookingListItem) => void;
  isActionPending?: boolean;
  activeActionId?: string | null;
  showReview?: boolean;
}

function TabPanel({
  bookings,
  isLoading,
  emptyLabel,
  onCancel,
  onReschedule,
  isActionPending,
  activeActionId,
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

  if (bookings.length === 0) return <EmptyState label={emptyLabel} />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {bookings.map((b) => (
        <BookingCard
          key={b.id}
          booking={b}
          onCancel={onCancel}
          onReschedule={onReschedule}
          isActionPending={isActionPending}
          activeActionId={activeActionId}
          showReview={showReview}
        />
      ))}
    </div>
  );
}

// ── Tab Badge ─────────────────────────────────────────────────────────────

function TabBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span className="ml-1.5 inline-flex items-center justify-center size-5 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold">
      {count > 99 ? "99+" : count}
    </span>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function CustomerBookingsPage() {
  const { data: allBookings = [], isLoading } = useCustomerBookings();
  const cancelMutation = useCancelCustomerBooking();
  const rescheduleMutation = useRescheduleBooking();

  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [cancelDialog, setCancelDialog] =
    useState<CustomerBookingListItem | null>(null);
  const [rescheduleBooking, setRescheduleBooking] =
    useState<CustomerBookingListItem | null>(null);
  const [rescheduleSheetOpen, setRescheduleSheetOpen] = useState(false);
  const [rescheduleError, setRescheduleError] = useState<string | null>(null);

  const live = allBookings.filter(
    (b) =>
      b.status === "PENDING" ||
      b.status === "CONFIRMED" ||
      b.status === "IN_PROGRESS",
  );
  const history = allBookings.filter((b) => b.status === "COMPLETED");
  const cancelled = allBookings.filter((b) => b.status === "CANCELLED");

  function openReschedule(booking: CustomerBookingListItem) {
    setRescheduleBooking(booking);
    setRescheduleError(null);
    setRescheduleSheetOpen(true);
  }

  async function handleCancelConfirm() {
    if (!cancelDialog) return;
    const id = cancelDialog.id;
    setCancelDialog(null);
    setActiveActionId(id);
    try {
      await cancelMutation.mutateAsync(id);
    } finally {
      setActiveActionId(null);
    }
  }

  async function handleRescheduleConfirm(
    bookingId: string,
    slotId: string,
    date: string,
  ) {
    setRescheduleError(null);
    setActiveActionId(bookingId);
    try {
      await rescheduleMutation.mutateAsync({
        id: bookingId,
        payload: { slotId, date },
      });
      setRescheduleSheetOpen(false);
      setRescheduleBooking(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to reschedule.";
      setRescheduleError(msg);
    } finally {
      setActiveActionId(null);
    }
  }

  const isActionPending =
    cancelMutation.isPending || rescheduleMutation.isPending;

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Your Bookings</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Track and manage all your service bookings
          </p>
        </div>
        {!isLoading && (
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-2 text-sm bg-muted/60 px-4 py-2 rounded-lg">
              <CalendarDays className="size-4 text-muted-foreground" />
              <span>
                <span className="font-semibold text-foreground">
                  {live.length}
                </span>{" "}
                <span className="text-muted-foreground">active</span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="live">
        <TabsList className="w-full sm:w-auto h-auto flex-wrap gap-1 p-1">
          <TabsTrigger value="live" className="text-sm">
            Live
            <TabBadge count={live.length} />
          </TabsTrigger>
          <TabsTrigger value="history" className="text-sm">
            History
            <TabBadge count={history.length} />
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="text-sm">
            Cancelled
            <TabBadge count={cancelled.length} />
          </TabsTrigger>
        </TabsList>

        <div className="mt-5">
          <TabsContent value="live" className="mt-0">
            <TabPanel
              bookings={live}
              isLoading={isLoading}
              emptyLabel="live"
              onCancel={(b) =>
                b.status !== "IN_PROGRESS" ? setCancelDialog(b) : undefined
              }
              onReschedule={openReschedule}
              isActionPending={isActionPending}
              activeActionId={activeActionId}
            />
          </TabsContent>

          <TabsContent value="history" className="mt-0">
            <TabPanel
              bookings={history}
              isLoading={isLoading}
              emptyLabel="completed"
              showReview
            />
          </TabsContent>

          <TabsContent value="cancelled" className="mt-0">
            <TabPanel
              bookings={cancelled}
              isLoading={isLoading}
              emptyLabel="cancelled"
            />
          </TabsContent>
        </div>
      </Tabs>

      {/* Cancel confirmation dialog */}
      <AlertDialog
        open={!!cancelDialog}
        onOpenChange={(open) => !open && setCancelDialog(null)}
      >
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
            <AlertDialogDescription>
              This will cancel your booking for{" "}
              <span className="font-medium text-foreground">
                {cancelDialog?.providerService.service.title}
              </span>{" "}
              on{" "}
              <span className="font-medium text-foreground">
                {cancelDialog ? formatDate(cancelDialog.date) : ""}
              </span>
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-2">
            <AlertDialogCancel className="flex-1">
              Keep Booking
            </AlertDialogCancel>
            <AlertDialogAction
              className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleCancelConfirm}
            >
              Yes, Cancel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reschedule sheet */}
      <RescheduleSheet
        open={rescheduleSheetOpen}
        onOpenChange={(v) => {
          setRescheduleSheetOpen(v);
          if (!v) setRescheduleBooking(null);
        }}
        booking={rescheduleBooking}
        onConfirm={handleRescheduleConfirm}
        isPending={rescheduleMutation.isPending}
        error={rescheduleError}
      />
    </div>
  );
}
