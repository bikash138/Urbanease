"use client";

import { IndianRupee, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { buildDateOptions } from "./utils";
import type { PublicSlot } from "@/types/public/public.types";
import type { ServiceEntry } from "./ServiceSelector";

interface OrderSummaryProps {
  selectedService: ServiceEntry | null;
  selectedDate: string | null;
  selectedSlot: PublicSlot | null;
  customerNote: string;
  onCustomerNoteChange: (value: string) => void;
  isPending: boolean;
  canBook: boolean;
  missingStep: string | null;
  onBook: () => void;
}

export function OrderSummary({
  selectedService,
  selectedDate,
  selectedSlot,
  customerNote,
  onCustomerNoteChange,
  isPending,
  canBook,
  missingStep,
  onBook,
}: OrderSummaryProps) {
  const dateOptions = buildDateOptions();
  const dateLabel = selectedDate
    ? dateOptions.find((d) => d.value === selectedDate)?.label ?? selectedDate
    : null;

  const charCount = customerNote.length;
  const exceedsCharLimit = charCount > 100;

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-5 space-y-4">
      <h2 className="font-semibold text-zinc-900 text-sm">
        Order Summary
      </h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between gap-3">
          <span className="text-zinc-500 shrink-0">Service</span>
          <span className="font-medium text-zinc-900 text-right truncate max-w-[160px]">
            {selectedService?.title ?? (
              <span className="text-zinc-300">—</span>
            )}
          </span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-zinc-500 shrink-0">Date</span>
          <span className="font-medium text-zinc-900">
            {dateLabel ?? (
              <span className="text-zinc-300">—</span>
            )}
          </span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-zinc-500 shrink-0">Time Slot</span>
          <span className="font-medium text-zinc-900">
            {selectedSlot ? (
              `${selectedSlot.startTime} – ${selectedSlot.endTime}`
            ) : (
              <span className="text-zinc-300">—</span>
            )}
          </span>
        </div>

        <div className="h-px bg-zinc-100" />

        <div className="flex justify-between items-center">
          <span className="font-semibold text-zinc-900">Total</span>
          <div className="flex items-center gap-0.5">
            <IndianRupee className="w-4 h-4 text-zinc-900" />
            <span className="text-xl font-bold text-zinc-900">
              {selectedService
                ? selectedService.price.toLocaleString("en-IN")
                : "0"}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="customer-note"
          className="text-xs font-medium text-zinc-600 flex items-center gap-1.5"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          Note for provider (optional)
        </label>
        <Textarea
          id="customer-note"
          placeholder="e.g. Gate code, parking instructions, pet at home…"
          value={customerNote}
          onChange={(e) => onCustomerNoteChange(e.target.value)}
          className={`min-h-[72px] resize-none text-sm bg-zinc-50 placeholder:text-zinc-400 ${
            exceedsCharLimit
              ? "border-red-300 focus-visible:ring-red-400 focus-visible:border-red-400"
              : "border-zinc-200"
          }`}
          maxLength={100}
          aria-invalid={exceedsCharLimit}
        />
        {customerNote.length > 0 && (
          <p
            className={`text-xs text-right ${
              exceedsCharLimit ? "text-red-600 font-medium" : "text-zinc-400"
            }`}
          >
            {charCount}/100 characters
            {exceedsCharLimit && " (max 100 characters)"}
          </p>
        )}
      </div>

      <Button
        onClick={onBook}
        disabled={!canBook || isPending || exceedsCharLimit}
        className="w-full bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 text-white rounded-xl h-11 font-semibold text-sm"
      >
        {isPending ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            Confirming…
          </span>
        ) : (
          "Book Now"
        )}
      </Button>

      {(missingStep || exceedsCharLimit) && (
        <p className="text-xs text-center text-zinc-400">
          {exceedsCharLimit
            ? "Please keep your note under 100 characters."
            : missingStep}
        </p>
      )}
    </div>
  );
}
