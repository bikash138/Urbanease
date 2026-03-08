"use client";

import { useState } from "react";
import {
  useProviderServices,
  useAddProviderService,
  useUpdateProviderService,
  useRemoveProviderService,
} from "@/hooks/provider/useProviderService";
import { useProviderAreas } from "@/hooks/provider/useProviderAreas";
import { usePublicCategories } from "@/hooks/public/usePublic";
import type { ProviderServiceWithService } from "@/types/provider/provider-service.types";
import type { AddServiceFormValues, UpdateServiceFormValues } from "@/schemas/provider/provider-service.schema";

import { PageHeader } from "@/components/common/page-header";
import { AdminSheet } from "@/components/admin/admin-sheet";

import { ConfirmDialog } from "@/components/common/confirm-dialog";
import {
  ServicesStatsCards,
  ServicesList,
  AddServiceForm,
  EditServiceForm,
} from "@/components/provider/service";

export default function ProviderServicesPage() {
  const { data: myServices = [], isLoading } = useProviderServices();
  const { data: categories = [] } = usePublicCategories();
  const { data: areasRaw = [] } = useProviderAreas();

  const addMutation = useAddProviderService();
  const updateMutation = useUpdateProviderService();
  const removeMutation = useRemoveProviderService();

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<"add" | "edit">("add");
  const [selectedService, setSelectedService] =
    useState<ProviderServiceWithService | null>(null);
  const [deleteTarget, setDeleteTarget] =
    useState<ProviderServiceWithService | null>(null);

  const isEditing = sheetMode === "edit";
  const areas = Array.from(new Map(areasRaw.map((a) => [a.id, a])).values());

  const totalCount = myServices.length;
  const availableCount = myServices.filter((s) => s.isAvailable).length;
  const unavailableCount = myServices.filter((s) => !s.isAvailable).length;
  const listedServiceIds = new Set(myServices.map((s) => s.serviceId));

  const activeCategories = (
    categories as { id: string; slug: string; name: string }[]
  ).map((c) => ({ id: c.id, slug: c.slug, name: c.name }));

  function handleOpenAdd() {
    setSheetMode("add");
    setSelectedService(null);
    setIsSheetOpen(true);
  }

  function handleOpenEdit(item: ProviderServiceWithService) {
    setSheetMode("edit");
    setSelectedService(item);
    setIsSheetOpen(true);
  }

  async function onAddSubmit(data: AddServiceFormValues) {
    await addMutation.mutateAsync({
      serviceId: data.serviceId,
      customPrice: data.customPrice || undefined,
      isAvailable: data.isAvailable,
      areaIds: data.areaIds?.length ? data.areaIds : undefined,
    });
    setIsSheetOpen(false);
  }

  async function onEditSubmit(data: UpdateServiceFormValues) {
    if (!selectedService) return;
    await updateMutation.mutateAsync({
      id: selectedService.id,
      payload: {
        customPrice: data.customPrice || undefined,
        isAvailable: data.isAvailable,
      },
    });
    setIsSheetOpen(false);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await removeMutation.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  }

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Listed Services"
        description="Manage the services you offer to customers"
        actionLabel="Add Service"
        onAction={handleOpenAdd}
      />

      <ServicesStatsCards
        totalCount={totalCount}
        availableCount={availableCount}
        unavailableCount={unavailableCount}
      />

      <ServicesList
        services={myServices}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onDelete={setDeleteTarget}
      />

      <AdminSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        title={isEditing ? "Edit Service" : "Add Service"}
        description={
          isEditing
            ? "Update pricing or availability for this service."
            : "Select a platform service to offer. Slots (Morning, Afternoon, Night) are auto-generated for the next 10 days."
        }
      >
        {isEditing && selectedService ? (
          <EditServiceForm
            key={selectedService.id}
            service={selectedService}
            onSubmit={onEditSubmit}
            onCancel={() => setIsSheetOpen(false)}
            isPending={updateMutation.isPending}
          />
        ) : (
          <AddServiceForm
            categories={activeCategories}
            areas={areas}
            listedServiceIds={listedServiceIds}
            onSubmit={onAddSubmit}
            onCancel={() => setIsSheetOpen(false)}
            isPending={addMutation.isPending}
          />
        )}
      </AdminSheet>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        primaryText="Remove Service?"
        secondaryText={
          deleteTarget ? (
            <>
              Are you sure you want to remove{" "}
              <span className="font-semibold text-foreground">
                {deleteTarget.service.title}
              </span>{" "}
              from your listed services? This cannot be undone.
            </>
          ) : (
            ""
          )
        }
        primaryButtonText="Yes, remove"
        pendingButtonText="Removing..."
        onConfirm={handleDelete}
        variant="delete"
        isPending={removeMutation.isPending}
      />
    </div>
  );
}
