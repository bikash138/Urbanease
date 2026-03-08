"use client";

import { Clock } from "lucide-react";
import type { PublicSlot } from "@/types/public/public.types";
import { cn } from "@/lib/utils";
import { LABEL_ORDER, LABEL_DISPLAY } from "./constants";

function SlotButton({
  slot,
  selected,
  onSelect,
}: {
  slot: PublicSlot;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex items-center gap-1.5 px-3 py-2 rounded-md border text-xs font-medium transition-colors w-full text-left",
        selected
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-muted/40 text-foreground border-border hover:bg-muted",
      )}
    >
      <Clock className="h-3 w-3 shrink-0" />
      {slot.startTime} – {slot.endTime}
    </button>
  );
}

interface SingleSlotSelectorProps {
  slots: PublicSlot[];
  selectedId: string;
  onChange: (id: string) => void;
  error?: string;
}

export function SingleSlotSelector({
  slots,
  selectedId,
  onChange,
  error,
}: SingleSlotSelectorProps) {
  const grouped = LABEL_ORDER.reduce<Record<(typeof LABEL_ORDER)[number], PublicSlot[]>>(
    (acc, label) => {
      acc[label] = slots.filter((s) => s.label === label);
      return acc;
    },
    { MORNING: [], AFTERNOON: [], NIGHT: [] },
  );

  if (slots.length === 0) {
    return (
      <p className="text-sm text-muted-foreground border rounded-md p-4 text-center">
        No slots available for this date.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {LABEL_ORDER.map((label) => {
        if (grouped[label].length === 0) return null;
        return (
          <div key={label}>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
              {LABEL_DISPLAY[label]}
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {grouped[label].map((slot) => (
                <SlotButton
                  key={slot.id}
                  slot={slot}
                  selected={selectedId === slot.id}
                  onSelect={() => onChange(slot.id)}
                />
              ))}
            </div>
          </div>
        );
      })}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
