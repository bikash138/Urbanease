"use client";

import { useState } from "react";
import {
  useProviders,
  useApproveProvider,
  useRejectProvider,
} from "@/hooks/admin/useAdminProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Eye,
  CheckCircle,
  XCircle,
  Loader2,
  UserCheck,
  UserX,
  Clock,
  Users,
} from "lucide-react";
import type { ProviderProfile } from "@/types/admin/admin-provider.types";

// Shared admin components
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { StatCard } from "@/components/admin/stat-card";
import { ProviderStatusBadge } from "@/components/admin/status-badge";
import { AdminSheet } from "@/components/admin/admin-sheet";
import {
  TableLoadingRow,
  TableEmptyRow,
} from "@/components/admin/table-states";
import { SheetFormActions } from "@/components/admin/sheet-form-actions";

// ── Rejection form schema ──────────────────────────────────────────
const rejectProviderSchema = z.object({
  rejectionReason: z
    .string()
    .min(10, "Rejection reason must be at least 10 characters")
    .max(500, "Rejection reason must be at most 500 characters"),
});
type RejectProviderFormValues = z.infer<typeof rejectProviderSchema>;

// ── Detail row helper ──────────────────────────────────────────────
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────
export default function AdminProvidersPage() {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const statusQuery =
    statusFilter === "ALL"
      ? undefined
      : { status: statusFilter as "PENDING" | "APPROVED" | "REJECTED" };

  const { data: providers = [], isLoading } = useProviders(statusQuery);
  const approveMutation = useApproveProvider();
  const rejectMutation = useRejectProvider();

  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
  const [isRejectSheetOpen, setIsRejectSheetOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] =
    useState<ProviderProfile | null>(null);

  const isMutating = approveMutation.isPending || rejectMutation.isPending;

  const rejectForm = useForm<RejectProviderFormValues>({
    resolver: zodResolver(rejectProviderSchema),
    defaultValues: { rejectionReason: "" },
  });

  const handleViewDetails = (id: string) => {
    const provider = providers.find((p) => p.id === id);
    if (provider) {
      setSelectedProvider(provider);
      setIsDetailSheetOpen(true);
    }
  };

  const handleApprove = async (id: string) => {
    await approveMutation.mutateAsync(id);
    setIsDetailSheetOpen(false);
  };

  const handleOpenReject = (provider: ProviderProfile) => {
    setSelectedProvider(provider);
    rejectForm.reset({ rejectionReason: "" });
    setIsRejectSheetOpen(true);
  };

  const onRejectSubmit = async (data: RejectProviderFormValues) => {
    if (!selectedProvider) return;
    await rejectMutation.mutateAsync({
      id: selectedProvider.id,
      payload: { rejectionReason: data.rejectionReason },
    });
    setIsRejectSheetOpen(false);
    setIsDetailSheetOpen(false);
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const totalCount = providers.length;
  const pendingCount = providers.filter((p) => p.status === "PENDING").length;
  const approvedCount = providers.filter((p) => p.status === "APPROVED").length;
  const rejectedCount = providers.filter((p) => p.status === "REJECTED").length;

  return (
    <div className="p-6 space-y-6">
      <AdminPageHeader
        title="Providers"
        description="Manage service provider applications and approvals"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Providers"
          count={totalCount}
          icon={<Users className="h-5 w-5 text-blue-600" />}
          bgClass="bg-blue-50 dark:bg-blue-900/20"
        />
        <StatCard
          label="Pending"
          count={pendingCount}
          icon={<Clock className="h-5 w-5 text-amber-600" />}
          bgClass="bg-amber-50 dark:bg-amber-900/20"
        />
        <StatCard
          label="Approved"
          count={approvedCount}
          icon={<UserCheck className="h-5 w-5 text-emerald-600" />}
          bgClass="bg-emerald-50 dark:bg-emerald-900/20"
        />
        <StatCard
          label="Rejected"
          count={rejectedCount}
          icon={<UserX className="h-5 w-5 text-rose-600" />}
          bgClass="bg-rose-50 dark:bg-rose-900/20"
        />
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground">
          Filter by status:
        </span>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Applied On</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && providers.length === 0 && (
              <TableLoadingRow colSpan={7} />
            )}
            {providers.map((provider) => (
              <TableRow key={provider.id}>
                <TableCell className="font-medium">
                  {provider.user.name}
                </TableCell>
                <TableCell>{provider.user.email}</TableCell>
                <TableCell>{provider.user.phone ?? "—"}</TableCell>
                <TableCell>
                  {provider.experience}{" "}
                  {provider.experience === 1 ? "year" : "years"}
                </TableCell>
                <TableCell>
                  <ProviderStatusBadge status={provider.status} />
                </TableCell>
                <TableCell>{formatDate(provider.createdAt)}</TableCell>
                <TableCell className="text-right space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    title="View details"
                    onClick={() => handleViewDetails(provider.id)}
                    disabled={isLoading}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {provider.status === "PENDING" && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Approve"
                        className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                        onClick={() => handleApprove(provider.id)}
                        disabled={isMutating}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Reject"
                        className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                        onClick={() => handleOpenReject(provider)}
                        disabled={isMutating}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {providers.length === 0 && !isLoading && (
              <TableEmptyRow colSpan={7} message="No providers found." />
            )}
          </TableBody>
        </Table>
      </div>

      {/* Detail Sheet */}
      <AdminSheet
        open={isDetailSheetOpen}
        onOpenChange={setIsDetailSheetOpen}
        title="Provider Details"
        description="Full profile and application info for this provider."
      >
        {selectedProvider && (
          <div className="space-y-6 mt-6 px-4">
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Personal Information
              </h3>
              <div className="rounded-lg border p-4 space-y-2">
                <DetailRow label="Name" value={selectedProvider.user.name} />
                <DetailRow label="Email" value={selectedProvider.user.email} />
                <DetailRow
                  label="Phone"
                  value={
                    selectedProvider.user.phone
                      ? String(selectedProvider.user.phone)
                      : "Not provided"
                  }
                />
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Provider Profile
              </h3>
              <div className="rounded-lg border p-4 space-y-2">
                <DetailRow
                  label="Experience"
                  value={`${selectedProvider.experience} ${selectedProvider.experience === 1 ? "year" : "years"}`}
                />
                <DetailRow
                  label="Applied On"
                  value={formatDate(selectedProvider.createdAt)}
                />
                <div>
                  <span className="text-xs font-medium text-muted-foreground">
                    Bio
                  </span>
                  <p className="mt-1 text-sm leading-relaxed">
                    {selectedProvider.bio || "No bio provided."}
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Status
              </h3>
              <div className="rounded-lg border p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    Current Status
                  </span>
                  <ProviderStatusBadge status={selectedProvider.status} />
                </div>
                {selectedProvider.rejectionReason && (
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">
                      Rejection Reason
                    </span>
                    <p className="mt-1 text-sm text-rose-600 leading-relaxed">
                      {selectedProvider.rejectionReason}
                    </p>
                  </div>
                )}
              </div>
            </section>

            {selectedProvider.status === "PENDING" && (
              <div className="flex gap-3 pt-2">
                <Button
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => handleApprove(selectedProvider.id)}
                  disabled={isMutating}
                >
                  {approveMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="mr-2 h-4 w-4" />
                  )}
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleOpenReject(selectedProvider)}
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

      {/* Reject Sheet */}
      <AdminSheet
        open={isRejectSheetOpen}
        onOpenChange={setIsRejectSheetOpen}
        title="Reject Provider"
        description={
          selectedProvider
            ? `Provide a reason for rejecting ${selectedProvider.user.name}'s application.`
            : "Provide a reason for rejection."
        }
      >
        <Form {...rejectForm}>
          <form
            onSubmit={rejectForm.handleSubmit(onRejectSubmit)}
            className="space-y-6 mt-6 px-4"
          >
            <FormField
              control={rejectForm.control}
              name="rejectionReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rejection Reason</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Explain why this application is being rejected..."
                      className="min-h-[120px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFormActions
              isPending={rejectMutation.isPending}
              onCancel={() => setIsRejectSheetOpen(false)}
              submitLabel="Reject Provider"
              pendingLabel="Rejecting..."
              destructive
              submitIcon={<XCircle className="h-4 w-4" />}
            />
          </form>
        </Form>
      </AdminSheet>
    </div>
  );
}
