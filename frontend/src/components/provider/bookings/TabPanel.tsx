import type {
  BookingListItem,
  ImageType,
} from "@/types/provider/provider-booking.types";
import { BookingCard } from "./BookingCard";
import { BookingCardSkeleton } from "./BookingCardSkeleton";
import { EmptyState } from "./EmptyState";

export interface TabPanelProps {
  bookings: BookingListItem[];
  isLoading: boolean;
  emptyLabel: string;
  onConfirm?: (id: string) => void;
  onStart?: (id: string) => void;
  onComplete?: (id: string) => void;
  onCancel?: (id: string) => void;
  onFlag?: (reviewId: string) => void;
  onUploadImage?: (bookingId: string, file: File, type: ImageType) => void;
  isActionPending?: boolean;
  activeActionId?: string | null;
  isFlaggingId?: string | null;
  isUploadingId?: string | null;
  showReview?: boolean;
}

export function TabPanel({
  bookings,
  isLoading,
  emptyLabel,
  onConfirm,
  onStart,
  onComplete,
  onCancel,
  onFlag,
  onUploadImage,
  isActionPending,
  activeActionId,
  isFlaggingId,
  isUploadingId,
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
          onUploadImage={onUploadImage}
          isActionPending={isActionPending}
          activeActionId={activeActionId}
          isFlaggingId={isFlaggingId}
          isUploadingId={isUploadingId}
          showReview={showReview}
        />
      ))}
    </div>
  );
}
