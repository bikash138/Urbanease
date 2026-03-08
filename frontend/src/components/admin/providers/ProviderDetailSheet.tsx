import { CheckCircle, XCircle } from "lucide-react";
import type { ProviderProfile } from "@/types/admin/admin-provider.types";
import { AdminSheet } from "@/components/admin/admin-sheet";
import { Button } from "@/components/ui/button";
import { ProviderStatusBadge } from "@/components/admin/status-badge";
import { DetailRow } from "./DetailRow";
import { formatProviderDate } from "./utils";

interface ProviderDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  provider: ProviderProfile | null;
  isMutating: boolean;
  onApprove: (id: string) => void;
  onReject: (provider: ProviderProfile) => void;
}

export function ProviderDetailSheet({
  open,
  onOpenChange,
  provider,
  isMutating,
  onApprove,
  onReject,
}: ProviderDetailSheetProps) {
  return (
    <AdminSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Provider Details"
      description="View and manage provider application"
      maxWidth="sm:max-w-lg"
    >
      {provider && (
        <div className="space-y-6 pt-2">
          {/* Personal info */}
          <div className="space-y-3 rounded-lg border p-4">
            <h4 className="text-sm font-semibold">Personal Information</h4>
            <div className="space-y-2">
              <DetailRow label="Name" value={provider.user.name} />
              <DetailRow label="Email" value={provider.user.email} />
              <DetailRow
                label="Phone"
                value={provider.user.phone?.toString() ?? "—"}
              />
            </div>
          </div>
          {/* Profile */}
          <div className="space-y-3 rounded-lg border p-4">
            <h4 className="text-sm font-semibold">Profile</h4>
            <DetailRow label="Experience" value={`${provider.experience} ${provider.experience === 1 ? "year" : "years"}`} />
            <DetailRow label="Applied On" value={formatProviderDate(provider.createdAt)} />
            <div>
              <span className="text-xs font-medium text-muted-foreground">Bio</span>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{provider.bio || "No bio provided."}</p>
            </div>
          </div>
          {/* Status */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <span className="text-sm font-medium text-muted-foreground">
              Status
            </span>
            <ProviderStatusBadge status={provider.status} />
          </div>
          {provider.rejectionReason && (
            <div className="space-y-2 rounded-lg border border-rose-200 bg-rose-50 p-4 dark:border-rose-900/50 dark:bg-rose-900/20">
              <h4 className="text-sm font-semibold text-rose-800 dark:text-rose-400">
                Rejection Reason
              </h4>
              <p className="text-sm text-rose-700 dark:text-rose-300">
                {provider.rejectionReason}
              </p>
            </div>
          )}
          {provider.status === "PENDING" && (
            <div className="flex gap-3">
              <Button
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                onClick={() => onApprove(provider.id)}
                disabled={isMutating}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => onReject(provider)}
                disabled={isMutating}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </Button>
            </div>
          )}
        </div>
      )}
    </AdminSheet>
  );
}
