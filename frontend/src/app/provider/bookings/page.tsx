"use client";

import { useState } from "react";
import { Clock, CheckCircle2 } from "lucide-react";
import {
  useProviderBookings,
  useConfirmBooking,
  useStartBooking,
  useCompleteBooking,
  useCancelBooking,
  useAddBookingImage,
} from "@/hooks/provider/useProviderBooking";
import { useFlagReview } from "@/hooks/provider/useProviderReview";
import {
  useGenerateProviderPresignedUrl,
  useUploadFileToS3,
} from "@/hooks/provider/useProviderUpload";
import type { ImageType } from "@/types/provider/provider-booking.types";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { PageHeader } from "@/components/common/page-header";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import {
  TabBadge,
  TabPanel,
  HistoryTabPanel,
} from "@/components/provider/bookings";

export default function ProviderBookingsPage() {
  const { data: allBookings = [], isLoading } = useProviderBookings();

  const confirmMutation = useConfirmBooking();
  const startMutation = useStartBooking();
  const completeMutation = useCompleteBooking();
  const cancelMutation = useCancelBooking();
  const flagMutation = useFlagReview();
  const addImageMutation = useAddBookingImage();
  const generateUrlMutation = useGenerateProviderPresignedUrl();
  const uploadS3Mutation = useUploadFileToS3();

  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [uploadingBookingId, setUploadingBookingId] = useState<string | null>(
    null
  );
  const [flaggingReviewId, setFlaggingReviewId] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    bookingId: string;
    action: "confirm" | "start" | "complete" | "cancel";
  } | null>(null);
  const [flagDialog, setFlagDialog] = useState<{
    reviewId: string;
  } | null>(null);

  const pending = allBookings.filter((b) => b.status === "PENDING");
  const confirmed = allBookings.filter((b) => b.status === "CONFIRMED");
  const inProgress = allBookings.filter((b) => b.status === "IN_PROGRESS");
  const history = allBookings.filter(
    (b) => b.status === "COMPLETED" || b.status === "CANCELLED"
  );

  const activeCount = pending.length + confirmed.length + inProgress.length;

  function openDialog(
    bookingId: string,
    action: "confirm" | "start" | "complete" | "cancel"
  ) {
    setConfirmDialog({ bookingId, action });
  }

  function openFlagDialog(reviewId: string) {
    setFlagDialog({ reviewId });
  }

  async function handleUploadImage(
    bookingId: string,
    file: File,
    type: ImageType
  ) {
    setUploadingBookingId(bookingId);
    try {
      const presignedRes = await generateUrlMutation.mutateAsync({
        filename: file.name,
        contentType: file.type,
        folder: "bookings",
      });
      const { uploadUrl, publicUrl } = presignedRes.data;
      await uploadS3Mutation.mutateAsync({ uploadUrl, file });
      await addImageMutation.mutateAsync({
        id: bookingId,
        payload: { url: publicUrl, type },
      });
    } finally {
      setUploadingBookingId(null);
    }
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

  return (
    <div className="p-6 md:p-8 space-y-6">
      <PageHeader
        title="Bookings"
        description="Manage and track all your service bookings"
        endContent={
          !isLoading ? (
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-yellow-50 border border-yellow-200 px-4 py-2 rounded-lg">
                <Clock className="size-4 text-yellow-600" />
                <span>
                  <span className="font-semibold text-yellow-800">
                    {pending.length}
                  </span>{" "}
                  <span className="text-yellow-700">pending</span>
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/60 px-4 py-2 rounded-lg">
                <CheckCircle2 className="size-4 text-emerald-600" />
                <span>
                  <span className="font-semibold text-foreground">
                    {activeCount}
                  </span>{" "}
                  active booking{activeCount !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          ) : undefined
        }
      />

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
              onUploadImage={handleUploadImage}
              isActionPending={isActionPending}
              activeActionId={activeActionId}
              isUploadingId={uploadingBookingId}
            />
          </TabsContent>

          <TabsContent value="in-progress" className="mt-0">
            <TabPanel
              bookings={inProgress}
              isLoading={isLoading}
              emptyLabel="in-progress"
              onComplete={(id) => openDialog(id, "complete")}
              onUploadImage={handleUploadImage}
              isActionPending={isActionPending}
              activeActionId={activeActionId}
              isUploadingId={uploadingBookingId}
            />
          </TabsContent>

          <TabsContent value="history" className="mt-0">
            <HistoryTabPanel
              bookings={history}
              isLoading={isLoading}
              onFlag={openFlagDialog}
              isFlaggingId={flaggingReviewId}
            />
          </TabsContent>
        </div>
      </Tabs>

      <ConfirmDialog
        open={!!confirmDialog}
        onOpenChange={(open) => !open && setConfirmDialog(null)}
        primaryText={
          confirmDialog?.action === "confirm"
            ? "Confirm this booking?"
            : confirmDialog?.action === "start"
            ? "Start this service?"
            : confirmDialog?.action === "complete"
            ? "Mark as completed?"
            : confirmDialog?.action === "cancel"
            ? "Cancel this booking?"
            : ""
        }
        secondaryText={
          confirmDialog?.action === "confirm"
            ? "The customer will be notified that their booking has been confirmed."
            : confirmDialog?.action === "start"
            ? "This will mark the booking as In Progress. Make sure you are on-site."
            : confirmDialog?.action === "complete"
            ? "This will close the booking. The customer can now leave a review."
            : confirmDialog?.action === "cancel"
            ? "This action cannot be undone. The customer will be notified that their booking has been cancelled."
            : ""
        }
        primaryButtonText={
          confirmDialog?.action === "confirm"
            ? "Yes, confirm"
            : confirmDialog?.action === "start"
            ? "Yes, start"
            : confirmDialog?.action === "complete"
            ? "Yes, complete"
            : confirmDialog?.action === "cancel"
            ? "Yes, cancel booking"
            : ""
        }
        primaryButtonClassName={
          confirmDialog?.action === "confirm"
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : confirmDialog?.action === "start"
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : confirmDialog?.action === "complete"
            ? "bg-emerald-600 text-white hover:bg-emerald-700"
            : confirmDialog?.action === "cancel"
            ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
            : undefined
        }
        onConfirm={handleDialogConfirm}
        variant="confirm"
        isPending={isActionPending}
      />

      <ConfirmDialog
        open={!!flagDialog}
        onOpenChange={(open) => !open && setFlagDialog(null)}
        primaryText="Flag this review?"
        secondaryText="The review will be flagged and sent to an admin for moderation. It will remain visible until the admin takes action."
        primaryButtonText="Yes, flag it"
        onConfirm={handleFlagConfirm}
        variant="alert"
      />
    </div>
  );
}
