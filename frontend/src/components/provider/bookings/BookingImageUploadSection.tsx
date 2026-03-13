import { CheckCircle2 } from "lucide-react";
import type { ImageType } from "@/types/provider/provider-booking.types";
import { ImageUpload } from "@/components/common/image-upload";

interface BookingImageUploadSectionProps {
  label: string;
  hasImage: boolean;
  bookingId: string;
  imageType: ImageType;
  onUpload: (bookingId: string, file: File, type: ImageType) => void;
  isUploading: boolean;
}

export function BookingImageUploadSection({
  label,
  hasImage,
  bookingId,
  imageType,
  onUpload,
  isUploading,
}: BookingImageUploadSectionProps) {
  if (hasImage) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2">
        <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
        <span className="text-sm font-medium text-emerald-800">
          {label} uploaded
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        {label}
      </p>
      <ImageUpload
        value={null}
        onChange={(file) => file && onUpload(bookingId, file, imageType)}
        disabled={isUploading}
        isUploading={isUploading}
        className="aspect-video max-h-32"
      />
    </div>
  );
}
