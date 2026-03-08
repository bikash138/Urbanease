"use client";

import { useState } from "react";
import { useAreas } from "@/hooks/admin/useAdminArea";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AreasStats } from "@/components/admin/areas/areas-stats";
import { AreasTable } from "@/components/admin/areas/areas-table";
import { AreasSheet } from "@/components/admin/areas/areas-sheet";

export default function AdminAreasPage() {
  const { data: areas = [], isLoading } = useAreas();

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);

  const selectedArea =
    areas.find((a) => a.id === selectedAreaId) || null;

  const handleOpenCreate = () => {
    setSelectedAreaId(null);
    setIsSheetOpen(true);
  };

  const handleOpenUpdate = (id: string) => {
    setSelectedAreaId(id);
    setIsSheetOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <AdminPageHeader
        title="Service Areas"
        description="Manage service areas that providers can select when offering services"
        actionLabel="Add Area"
        onAction={handleOpenCreate}
      />

      <AreasStats areas={areas} />

      <AreasTable
        areas={areas}
        isLoading={isLoading}
        onEdit={handleOpenUpdate}
      />

      <AreasSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        selectedArea={selectedArea}
      />
    </div>
  );
}
