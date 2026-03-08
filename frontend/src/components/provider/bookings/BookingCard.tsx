import {
  CalendarDays,
  User,
  Phone,
  MapPin,
  IndianRupee,
  MessageSquare,
  CheckCircle2,
  PlayCircle,
  Ban,
  Loader2,
  Flag,
} from "lucide-react";
import type {
  BookingListItem,
  ImageType,
} from "@/types/provider/provider-booking.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { STATUS_CONFIG } from "./constants";
import { formatDate } from "./utils";
import { ProviderReviewSection } from "./ProviderReviewSection";
import { BookingImageUploadSection } from "./BookingImageUploadSection";

export interface BookingCardProps {
  booking: BookingListItem;
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

export function BookingCard({
  booking,
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
  showReview = false,
}: BookingCardProps) {
  const s = STATUS_CONFIG[booking.status];
  const isPending = isActionPending && activeActionId === booking.id;
  const isFlagging = !!isFlaggingId && booking.review?.id === isFlaggingId;
  const isUploading = !!isUploadingId && isUploadingId === booking.id;

  const images = booking.images ?? [];
  const hasBeforeImage = images.some((img) => img.type === "BEFORE");
  const hasAfterImage = images.some((img) => img.type === "AFTER");

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

        {booking.customerNote && (
          <div className="flex items-start gap-2 text-sm bg-muted/50 rounded-lg px-3 py-2">
            <MessageSquare className="size-3.5 shrink-0 mt-0.5 text-muted-foreground/70" />
            <span className="text-muted-foreground leading-relaxed">
              {booking.customerNote}
            </span>
          </div>
        )}

        {showReview && onFlag && (
          <ProviderReviewSection
            booking={booking}
            onFlag={onFlag}
            isFlagging={isFlagging}
          />
        )}

        {onStart && onUploadImage && (
          <>
            <Separator />
            <BookingImageUploadSection
              label="Before image (required to start)"
              hasImage={hasBeforeImage}
              bookingId={booking.id}
              imageType="BEFORE"
              onUpload={onUploadImage}
              isUploading={isUploading}
            />
          </>
        )}

        {onComplete && onUploadImage && (
          <>
            <Separator />
            <BookingImageUploadSection
              label="After image (required to complete)"
              hasImage={hasAfterImage}
              bookingId={booking.id}
              imageType="AFTER"
              onUpload={onUploadImage}
              isUploading={isUploading}
            />
          </>
        )}

        {(onConfirm || onStart || onComplete || onCancel) && (
          <>
            <Separator />
            <div className="flex gap-2 pt-0.5">
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

              {onStart && (
                <>
                  <Button
                    size="sm"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => onStart(booking.id)}
                    disabled={isPending || !hasBeforeImage}
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

              {onComplete && (
                <Button
                  size="sm"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => onComplete(booking.id)}
                  disabled={isPending || !hasAfterImage}
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
