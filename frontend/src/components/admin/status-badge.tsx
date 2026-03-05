import { CheckCircle, XCircle, Clock, UserCheck, UserX } from "lucide-react";

/* ── Active / Inactive badge (categories & services) ── */
export function ActiveBadge({ isActive }: { isActive: boolean }) {
  if (isActive) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
        <CheckCircle className="mr-1 h-3 w-3" />
        Active
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400">
      <XCircle className="mr-1 h-3 w-3" />
      Inactive
    </span>
  );
}

/* ── Provider application status badge ── */
type ProviderStatus = "PENDING" | "APPROVED" | "REJECTED";

const providerStatusConfig: Record<
  ProviderStatus,
  { label: string; className: string; icon: React.ReactNode }
> = {
  PENDING: {
    label: "Pending",
    className:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    icon: <Clock className="mr-1 h-3 w-3" />,
  },
  APPROVED: {
    label: "Approved",
    className:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    icon: <UserCheck className="mr-1 h-3 w-3" />,
  },
  REJECTED: {
    label: "Rejected",
    className:
      "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400",
    icon: <UserX className="mr-1 h-3 w-3" />,
  },
};

export function ProviderStatusBadge({ status }: { status: ProviderStatus }) {
  const { label, className, icon } = providerStatusConfig[status];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
    >
      {icon}
      {label}
    </span>
  );
}
