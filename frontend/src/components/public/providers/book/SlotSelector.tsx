"use client";

import { AlertCircle, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { SLOT_META } from "./utils";
import type { PublicSlot, SlotLabel } from "@/types/public/public.types";

interface SlotSelectorProps {
  slots: PublicSlot[] | undefined;
  slotsByLabel: Map<SlotLabel, PublicSlot[]>;
  selectedSlot: PublicSlot | null;
  isLoading: boolean;
  error: unknown;
  onSelect: (slot: PublicSlot) => void;
}

export function SlotSelector({
  slots,
  slotsByLabel,
  selectedSlot,
  isLoading,
  error,
  onSelect,
}: SlotSelectorProps) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-4">
      <h2 className="font-semibold text-zinc-900 flex items-center gap-2.5 text-sm">
        <span className="w-6 h-6 rounded-full bg-zinc-900 text-white text-xs flex items-center justify-center font-bold shrink-0">
          3
        </span>
        Pick a Time Slot
      </h2>

      {isLoading ? (
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Unable to load slots. Try a different date.</span>
        </div>
      ) : (slots ?? []).length === 0 ? (
        <div className="py-10 text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center mx-auto">
            <Clock className="w-5 h-5 text-zinc-400" />
          </div>
          <p className="text-sm font-medium text-zinc-700">
            No slots available
          </p>
          <p className="text-xs text-zinc-400">
            Try a different date or service.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {(["MORNING", "AFTERNOON", "NIGHT"] as SlotLabel[]).map((label) => {
            const labelSlots = slotsByLabel.get(label) ?? [];
            if (labelSlots.length === 0) return null;
            const {
              label: labelText,
              icon: Icon,
              color,
            } = SLOT_META[label];
            return (
              <div
                key={label}
                className="flex-1 min-w-0 flex flex-col gap-2.5"
              >
                <div
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border w-fit ${color}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {labelText}
                </div>
                <div className="flex flex-wrap gap-2">
                  {labelSlots.map((slot) => {
                    const isSelected = selectedSlot?.id === slot.id;
                    return (
                      <button
                        key={slot.id}
                        onClick={() => onSelect(slot)}
                        className={`flex flex-col items-center justify-center py-3 px-4 rounded-xl border transition-all duration-150 min-w-[80px] ${
                          isSelected
                            ? "border-zinc-900 bg-zinc-900"
                            : "border-zinc-200 bg-zinc-50 hover:border-zinc-400 hover:bg-white"
                        }`}
                      >
                        <span
                          className={`text-sm font-semibold ${isSelected ? "text-white" : "text-zinc-900"}`}
                        >
                          {slot.startTime}
                        </span>
                        <span
                          className={`text-xs mt-0.5 ${isSelected ? "text-zinc-300" : "text-zinc-400"}`}
                        >
                          {slot.endTime}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
