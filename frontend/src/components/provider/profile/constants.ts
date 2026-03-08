export const STATUS_CONFIG = {
  PENDING: {
    label: "Pending Review",
    variant: "secondary" as const,
    className: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100",
  },
  APPROVED: {
    label: "Approved",
    variant: "secondary" as const,
    className: "bg-green-100 text-green-800 border-green-200 hover:bg-green-100",
  },
  REJECTED: {
    label: "Rejected",
    variant: "secondary" as const,
    className: "bg-red-100 text-red-800 border-red-200 hover:bg-red-100",
  },
} as const;

export const PROFILE_TIPS = [
  "Write a clear bio describing your expertise and services.",
  "Keep your experience accurate to build customer trust.",
  "A complete profile gets more visibility on the platform.",
] as const;
