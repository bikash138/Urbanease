"use client";

import type { CustomerBookingListItem } from "@/types/customer/customer-booking.types";

import { BookingCard } from "./BookingCard";
import { BookingCollapsible } from "./BookingCollapsible";
import { BookingCardSkeleton } from "./BookingCardSkeleton";
import { BookingCollapsibleSkeleton } from "./BookingCollapsibleSkeleton";
import { EmptyState } from "./EmptyState";

interface TabPanelProps {
  bookings: CustomerBookingListItem[];
  isLoading: boolean;
  emptyLabel: string;
  variant: "card" | "collapsible";
  onCancel?: (b: CustomerBookingListItem) => void;
  onReschedule?: (b: CustomerBookingListItem) => void;
  isActionPending?: boolean;
  activeActionId?: string | null;
  showReview?: boolean;
}

export function TabPanel({
  bookings,
  isLoading,
  emptyLabel,
  variant,
  onCancel,
  onReschedule,
  isActionPending,
  activeActionId,
  showReview,
}: TabPanelProps) {
  if (isLoading) {
    if (variant === "collapsible") {
      return (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <BookingCollapsibleSkeleton key={i} />
          ))}
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <BookingCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (bookings.length === 0) return <EmptyState label={emptyLabel} />;

  if (variant === "collapsible") {
    return (
      <div className="space-y-2">
        {bookings.map((b) => (
          <BookingCollapsible key={b.id} booking={b} />
        ))}
      </div>
    );
  }

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
