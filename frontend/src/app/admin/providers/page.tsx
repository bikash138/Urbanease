"use client";

import { useState } from "react";
import {
  useProviders,
  useApproveProvider,
  useRejectProvider,
} from "@/hooks/admin/useAdminProvider";
import type { ProviderProfile } from "@/types/admin/admin-provider.types";
import type { RejectProviderFormValues } from "@/components/admin/providers";

import { PageHeader } from "@/components/common/page-header";
import {
  ProviderStatsCards,
  ProviderFilterBar,
  ProvidersTable,
  ProviderDetailSheet,
  ProviderRejectSheet,
} from "@/components/admin/providers";

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
    setIsDetailSheetOpen(false);
    setIsRejectSheetOpen(true);
  };

  const handleRejectSubmit = async (
    providerId: string,
    data: RejectProviderFormValues
  ) => {
    await rejectMutation.mutateAsync({
      id: providerId,
      payload: { rejectionReason: data.rejectionReason },
    });
    setIsRejectSheetOpen(false);
  };

  const totalCount = providers.length;
  const pendingCount = providers.filter((p) => p.status === "PENDING").length;
  const approvedCount = providers.filter((p) => p.status === "APPROVED").length;
  const rejectedCount = providers.filter((p) => p.status === "REJECTED").length;

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Providers"
        description="Manage service provider applications and approvals"
      />

      <ProviderStatsCards
        totalCount={totalCount}
        pendingCount={pendingCount}
        approvedCount={approvedCount}
        rejectedCount={rejectedCount}
      />

      <ProviderFilterBar value={statusFilter} onValueChange={setStatusFilter} />

      <ProvidersTable
        providers={providers}
        isLoading={isLoading}
        isMutating={isMutating}
        onViewDetails={handleViewDetails}
        onApprove={handleApprove}
        onReject={handleOpenReject}
      />

      <ProviderDetailSheet
        open={isDetailSheetOpen}
        onOpenChange={setIsDetailSheetOpen}
        provider={selectedProvider}
        isMutating={isMutating}
        onApprove={handleApprove}
        onReject={handleOpenReject}
      />

      <ProviderRejectSheet
        open={isRejectSheetOpen}
        onOpenChange={setIsRejectSheetOpen}
        provider={selectedProvider}
        isPending={rejectMutation.isPending}
        onSubmit={handleRejectSubmit}
      />
    </div>
  );
}
