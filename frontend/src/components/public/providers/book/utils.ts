import type { ComponentType } from "react";
import { Home, Briefcase, MapPin, Sun, Sunset, Moon } from "lucide-react";
import type { SlotLabel } from "@/types/public/public.types";

export function formatDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function buildDateOptions(): { label: string; value: string }[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Array.from({ length: 3 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i + 1);
    const label =
      i === 0
        ? "Tomorrow"
        : d.toLocaleDateString("en-IN", {
            weekday: "long",
            month: "short",
            day: "numeric",
          });
    return { label, value: formatDate(d) };
  });
}

export const ADDRESS_ICON: Record<
  "HOME" | "WORK" | "OTHER",
  { label: string; icon: ComponentType<{ className?: string }> }
> = {
  HOME: { label: "Home", icon: Home },
  WORK: { label: "Work", icon: Briefcase },
  OTHER: { label: "Other", icon: MapPin },
};

export const SLOT_META: Record<
  SlotLabel,
  {
    label: string;
    icon: ComponentType<{ className?: string }>;
    color: string;
  }
> = {
  MORNING: {
    label: "Morning",
    icon: Sun,
    color: "bg-amber-50 text-amber-700 border-amber-200",
  },
  AFTERNOON: {
    label: "Afternoon",
    icon: Sunset,
    color: "bg-sky-50 text-sky-700 border-sky-200",
  },
  NIGHT: {
    label: "Evening",
    icon: Moon,
    color: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
};
