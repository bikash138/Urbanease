import type { BookingStatus } from "@/types/customer/customer-booking.types";
import type { SlotLabel } from "@/types/public/public.types";

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function getMinDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

export function getMaxDate() {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return d.toISOString().split("T")[0];
}

export const STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100",
  },
  CONFIRMED: {
    label: "Confirmed",
    className: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100",
  },
  IN_PROGRESS: {
    label: "In Progress",
    className: "bg-violet-100 text-violet-800 border-violet-200 hover:bg-violet-100",
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-green-100 text-green-800 border-green-200 hover:bg-green-100",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-red-100 text-red-800 border-red-200 hover:bg-red-100",
  },
};

export const LABEL_ORDER: SlotLabel[] = ["MORNING", "AFTERNOON", "NIGHT"];
export const LABEL_DISPLAY: Record<SlotLabel, string> = {
  MORNING: "Morning",
  AFTERNOON: "Afternoon",
  NIGHT: "Night",
};
