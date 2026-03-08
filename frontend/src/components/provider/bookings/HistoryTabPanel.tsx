import type { BookingListItem } from "@/types/provider/provider-booking.types";
import { BookingHistoryCollapsible } from "./BookingHistoryCollapsible";
import { BookingCardSkeleton } from "./BookingCardSkeleton";
import { EmptyState } from "./EmptyState";

interface HistoryTabPanelProps {
  bookings: BookingListItem[];
  isLoading: boolean;
  onFlag: (reviewId: string) => void;
  isFlaggingId: string | null;
}

export function HistoryTabPanel({
  bookings,
  isLoading,
  onFlag,
  isFlaggingId,
}: HistoryTabPanelProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <BookingCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (bookings.length === 0) {
    return <EmptyState label="past" />;
  }

  return (
    <div className="space-y-3">
      {bookings.map((booking) => (
        <BookingHistoryCollapsible
          key={booking.id}
          booking={booking}
          onFlag={onFlag}
          isFlagging={!!isFlaggingId && booking.review?.id === isFlaggingId}
        />
      ))}
    </div>
  );
}
