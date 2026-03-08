import type { BookingStatus } from "@/types/provider/provider-booking.types";

export const STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Pending",
    className:
      "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100",
  },
  CONFIRMED: {
    label: "Confirmed",
    className: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100",
  },
  IN_PROGRESS: {
    label: "In Progress",
    className:
      "bg-violet-100 text-violet-800 border-violet-200 hover:bg-violet-100",
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
