"use client";

import { useState, useEffect, useMemo } from "react";
import { Loader2 } from "lucide-react";

import { usePublicProviderSlots } from "@/hooks/public/usePublic";
import type { CustomerBookingListItem } from "@/types/customer/customer-booking.types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

import { formatDate, getMinDate, getMaxDate } from "./constants";
import { SingleSlotSelector } from "./SlotSelector";

interface RescheduleSheetProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  booking: CustomerBookingListItem | null;
  onConfirm: (bookingId: string, slotId: string, date: string) => void;
  isPending: boolean;
  error: string | null;
}

export function RescheduleSheet({
  open,
  onOpenChange,
  booking,
  onConfirm,
  isPending,
  error,
}: RescheduleSheetProps) {
  const providerSlug = booking?.providerService.provider.slug ?? null;

  const [date, setDate] = useState("");
  const [slotId, setSlotId] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const providerServiceId = booking?.providerService.id ?? null;
  const { data: slots = [], isLoading: slotsLoading } = usePublicProviderSlots(
    open && date ? providerSlug : null,
    open && date ? date : null,
    open && date ? providerServiceId : null,
  );

  const effectiveSlotId = useMemo(() => {
    if (!slotId || !date) return "";
    return slots.some((s) => s.id === slotId) ? slotId : "";
  }, [slotId, date, slots]);

  useEffect(() => {
    if (open) {
      queueMicrotask(() => setDate(""));
      queueMicrotask(() => setSlotId(""));
      queueMicrotask(() => setValidationError(""));
    }
  }, [open]);

  function handleSubmit() {
    if (!date) {
      setValidationError("Please select a date.");
      return;
    }
    if (!effectiveSlotId) {
      setValidationError("Please select a time slot.");
      return;
    }
    setValidationError(null);
    if (booking) onConfirm(booking.id, effectiveSlotId, date);
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
                selectedId={effectiveSlotId}
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
