import type { AddressLabel } from "@/types/customer/customer-address.types";

export const LABEL_CONFIG: Record<AddressLabel, { label: string; className: string }> = {
  HOME: { label: "Home", className: "bg-blue-100 text-blue-700 border-blue-200" },
  WORK: { label: "Work", className: "bg-amber-100 text-amber-700 border-amber-200" },
  OTHER: { label: "Other", className: "bg-slate-100 text-slate-600 border-slate-200" },
};
