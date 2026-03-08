"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";

import {
  useCustomerBookings,
  useCancelCustomerBooking,
  useRescheduleBooking,
} from "@/hooks/customer/useCustomerBooking";
import type { CustomerBookingListItem } from "@/types/customer/customer-booking.types";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConfirmDialog } from "@/components/common/confirm-dialog";

import { PageHeader } from "@/components/common/page-header";
import {
  formatDate,
  RescheduleSheet,
  TabPanel,
  TabBadge,
} from "@/components/customer/bookings";

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
      <PageHeader
        title="Your Bookings"
        description="Track and manage all your service bookings"
        endContent={
          !isLoading ? (
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
          ) : undefined
        }
      />

      <Tabs defaultValue="live">
        <TabsList className="w-full sm:w-auto h-auto flex-wrap gap-1 p-1">
          <TabsTrigger value="live" className="text-sm">
            Live
            <TabBadge count={live.length} />
          </TabsTrigger>
          <TabsTrigger value="history" className="text-sm">
            History
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
              variant="card"
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
              variant="collapsible"
              showReview
            />
          </TabsContent>

          <TabsContent value="cancelled" className="mt-0">
            <TabPanel
              bookings={cancelled}
              isLoading={isLoading}
              emptyLabel="cancelled"
              variant="card"
            />
          </TabsContent>
        </div>
      </Tabs>

      <ConfirmDialog
        open={!!cancelDialog}
        onOpenChange={(open) => !open && setCancelDialog(null)}
        primaryText="Cancel this booking?"
        secondaryText={
          cancelDialog ? (
            <>
              This will cancel your booking for{" "}
              <span className="font-medium text-foreground">
                {cancelDialog.providerService.service.title}
              </span>{" "}
              on{" "}
              <span className="font-medium text-foreground">
                {formatDate(cancelDialog.date)}
              </span>
              . This action cannot be undone.
            </>
          ) : (
            ""
          )
        }
        primaryButtonText="Yes, Cancel"
        secondaryButtonText="Keep Booking"
        onConfirm={handleCancelConfirm}
        variant="confirm"
        primaryButtonClassName="bg-destructive text-destructive-foreground hover:bg-destructive/90"
      />

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
