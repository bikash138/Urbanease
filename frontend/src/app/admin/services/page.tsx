"use client";

import { useState } from "react";
import { useServices } from "@/hooks/admin/useAdminService";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ServicesStats } from "@/components/admin/services/services-stats";
import { ServicesTable } from "@/components/admin/services/services-table";
import { ServicesSheet } from "@/components/admin/services/services-sheet";

export default function AdminServicesPage() {
  const { data: services = [], isLoading } = useServices();

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    null,
  );

  const selectedService =
    services.find((s) => s.id === selectedServiceId) || null;

  const handleOpenCreate = () => {
    setSelectedServiceId(null);
    setIsSheetOpen(true);
  };

  const handleOpenUpdate = (id: string) => {
    setSelectedServiceId(id);
    setIsSheetOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <AdminPageHeader
        title="Services"
        description="Manage your service offerings and pricing"
        actionLabel="Add Service"
        onAction={handleOpenCreate}
      />

      <ServicesStats services={services} />

      <ServicesTable
        services={services}
        isLoading={isLoading}
        onEdit={handleOpenUpdate}
      />

      <ServicesSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        selectedService={selectedService}
      />
    </div>
  );
}
