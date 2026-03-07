"use client";

import { useState } from "react";
import { useCategories, useCategory } from "@/hooks/admin/useAdminCategory";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CategoriesStats } from "@/components/admin/categories/categories-stats";
import { CategoriesTable } from "@/components/admin/categories/categories-table";
import { CategoriesSheet } from "@/components/admin/categories/categories-sheet";

export default function AdminCategoriesPage() {
  const { data: categories = [], isLoading } = useCategories();

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  useCategory(selectedCategoryId);

  const selectedCategory =
    categories.find((c) => c.id === selectedCategoryId) || null;

  const handleOpenCreate = () => {
    setSelectedCategoryId(null);
    setIsSheetOpen(true);
  };

  const handleOpenUpdate = (id: string) => {
    setSelectedCategoryId(id);
    setIsSheetOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <AdminPageHeader
        title="Categories"
        description="Manage service categories and their visibility"
        actionLabel="Add Category"
        onAction={handleOpenCreate}
      />

      <CategoriesStats categories={categories} />

      <CategoriesTable
        categories={categories}
        isLoading={isLoading}
        onEdit={handleOpenUpdate}
      />

      <CategoriesSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        selectedCategory={selectedCategory}
      />
    </div>
  );
}
