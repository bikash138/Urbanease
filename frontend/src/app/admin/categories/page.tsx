"use client";

import { useState } from "react";
import {
  useCategories,
  useCategory,
  useCreateCategory,
  useUpdateCategory,
} from "@/hooks/admin/useAdminCategory";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createCategorySchema,
  updateCategorySchema,
  CreateCategoryFormValues,
  UpdateCategoryFormValues,
} from "@/schemas/admin/admin-category.schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, LayoutGrid, CheckCircle, XCircle } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { StatCard } from "@/components/admin/stat-card";
import { ActiveBadge } from "@/components/admin/status-badge";
import { AdminSheet } from "@/components/admin/admin-sheet";
import {
  TableLoadingRow,
  TableEmptyRow,
} from "@/components/admin/table-states";
import { SheetFormActions } from "@/components/admin/sheet-form-actions";
import { ActiveToggleField } from "@/components/admin/active-toggle-field";

export default function AdminCategoriesPage() {
  const { data: categories = [], isLoading } = useCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  useCategory(selectedCategoryId); // prefetch if needed

  const isUpdate = !!selectedCategoryId;
  const isMutating = createMutation.isPending || updateMutation.isPending;

  const form = useForm<UpdateCategoryFormValues>({
    resolver: zodResolver(
      isUpdate ? updateCategorySchema : createCategorySchema,
    ),
    defaultValues: { name: "", description: "", isActive: true },
  });

  const handleOpenCreate = () => {
    setSelectedCategoryId(null);
    form.reset({ name: "", description: "", isActive: true });
    setIsSheetOpen(true);
  };

  const handleOpenUpdate = (id: string) => {
    setSelectedCategoryId(id);
    const cat = categories.find((c) => c.id === id);
    if (cat)
      form.reset({
        name: cat.name,
        description: cat.description || "",
        isActive: cat.isActive,
      });
    setIsSheetOpen(true);
  };

  const onSubmit = async (data: UpdateCategoryFormValues) => {
    if (isUpdate && selectedCategoryId) {
      await updateMutation.mutateAsync({
        id: selectedCategoryId,
        payload: data,
      });
    } else {
      await createMutation.mutateAsync(data as CreateCategoryFormValues);
    }
    setIsSheetOpen(false);
  };

  const totalCount = categories.length;
  const activeCount = categories.filter((c) => c.isActive).length;
  const inactiveCount = categories.filter((c) => !c.isActive).length;

  return (
    <div className="p-6 space-y-6">
      <AdminPageHeader
        title="Categories"
        description="Manage service categories and their visibility"
        actionLabel="Add Category"
        onAction={handleOpenCreate}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Categories"
          count={totalCount}
          icon={<LayoutGrid className="h-5 w-5 text-blue-600" />}
          bgClass="bg-blue-50 dark:bg-blue-900/20"
        />
        <StatCard
          label="Active"
          count={activeCount}
          icon={<CheckCircle className="h-5 w-5 text-emerald-600" />}
          bgClass="bg-emerald-50 dark:bg-emerald-900/20"
        />
        <StatCard
          label="Inactive"
          count={inactiveCount}
          icon={<XCircle className="h-5 w-5 text-rose-600" />}
          bgClass="bg-rose-50 dark:bg-rose-900/20"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && categories.length === 0 && (
              <TableLoadingRow colSpan={4} />
            )}
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="text-muted-foreground max-w-[300px] truncate">
                  {category.description || "—"}
                </TableCell>
                <TableCell>
                  <ActiveBadge isActive={category.isActive} />
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenUpdate(category.id)}
                    disabled={isLoading}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {categories.length === 0 && !isLoading && (
              <TableEmptyRow colSpan={4} message="No categories found." />
            )}
          </TableBody>
        </Table>
      </div>

      <AdminSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        title={isUpdate ? "Update Category" : "Add Category"}
        description={
          isUpdate
            ? "Update the details of the category below."
            : "Fill in the details to create a new category."
        }
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mt-6 px-4"
          >
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Category Details
              </h3>
              <div className="rounded-lg border p-4 space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Cleaning, Plumbing"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Briefly describe what this category covers..."
                          className="min-h-[100px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            {isUpdate && (
              <section className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Visibility
                </h3>
                <ActiveToggleField
                  control={form.control}
                  description="Determine if this category is visible to users."
                />
              </section>
            )}

            <SheetFormActions
              isPending={isMutating}
              onCancel={() => setIsSheetOpen(false)}
              submitLabel={isUpdate ? "Update Category" : "Create Category"}
            />
          </form>
        </Form>
      </AdminSheet>
    </div>
  );
}
