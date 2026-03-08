"use client";

import {
  CalendarDays,
  Ban,
  CalendarClock,
  Loader2,
  Wrench,
  User,
  IndianRupee,
  MapPin,
  MessageSquare,
} from "lucide-react";

import type { CustomerBookingListItem } from "@/types/customer/customer-booking.types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { formatDate, STATUS_CONFIG } from "./constants";
import { BeforeAfterImagesSection } from "./BeforeAfterImagesSection";
import { ReviewSection } from "./ReviewSection";

interface BookingCardProps {
  booking: CustomerBookingListItem;
  onCancel?: (b: CustomerBookingListItem) => void;
  onReschedule?: (b: CustomerBookingListItem) => void;
  isActionPending?: boolean;
  activeActionId?: string | null;
  showReview?: boolean;
}

export function BookingCard({
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
          <Badge className={`text-xs font-medium border shrink-0 ${s.className}`}>
            {s.label}
          </Badge>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="px-5 pt-4 pb-5 space-y-4">
        <BookingCardContent booking={booking} />
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
            <ReviewSection key={`${booking.id}-${booking.review?.id ?? "new"}`} booking={booking} />
          </>
        )}
      </CardContent>
    </Card>
  );
}

/** Shared content between BookingCard and BookingCollapsible */
export function BookingCardContent({
  booking,
}: {
  booking: CustomerBookingListItem;
}) {
  return (
    <>
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
    </>
  );
}
