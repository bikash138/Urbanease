"use client";

import { useState } from "react";
import {
  useServices,
  useCreateService,
  useUpdateService,
} from "@/hooks/admin/useAdminService";
import { useCategories } from "@/hooks/admin/useAdminCategory";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createServiceSchema,
  updateServiceSchema,
  CreateServiceFormValues,
  UpdateServiceFormValues,
} from "@/schemas/admin/admin-service";
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
  Pencil,
  Wrench,
  CheckCircle,
  XCircle,
  IndianRupee,
} from "lucide-react";

// Shared admin components
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

export default function AdminServicesPage() {
  const { data: services = [], isLoading: isServiceLoading } = useServices();
  const { data: categories = [], isLoading: isCategoryLoading } =
    useCategories();
  const createMutation = useCreateService();
  const updateMutation = useUpdateService();

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    null,
  );

  const isLoading = isServiceLoading || isCategoryLoading;
  const isUpdate = !!selectedServiceId;
  const isMutating = createMutation.isPending || updateMutation.isPending;

  const form = useForm<UpdateServiceFormValues | CreateServiceFormValues>({
    resolver: zodResolver(
      isUpdate ? updateServiceSchema : createServiceSchema,
    ) as any,
    defaultValues: {
      title: "",
      description: "",
      basePrice: 0,
      categoryId: "",
      isActive: true,
    },
  });

  const handleOpenCreate = () => {
    setSelectedServiceId(null);
    form.reset({
      title: "",
      description: "",
      basePrice: 0,
      categoryId: "",
      isActive: true,
    });
    setIsSheetOpen(true);
  };

  const handleOpenUpdate = (id: string) => {
    setSelectedServiceId(id);
    const srv = services.find((s) => s.id === id);
    if (srv) {
      form.reset({
        title: srv.title,
        description: srv.description || "",
        basePrice: srv.basePrice,
        categoryId: srv.categoryId,
        isActive: srv.isActive,
      });
    }
    setIsSheetOpen(true);
  };

  const onSubmit = async (
    data: UpdateServiceFormValues | CreateServiceFormValues,
  ) => {
    if (isUpdate && selectedServiceId) {
      await updateMutation.mutateAsync({
        id: selectedServiceId,
        payload: data as UpdateServiceFormValues,
      });
    } else {
      await createMutation.mutateAsync(data as CreateServiceFormValues);
    }
    setIsSheetOpen(false);
  };

  const totalCount = services.length;
  const activeCount = services.filter((s) => s.isActive).length;
  const inactiveCount = services.filter((s) => !s.isActive).length;
  const avgPrice =
    services.length > 0
      ? services.reduce((sum, s) => sum + s.basePrice, 0) / services.length
      : 0;

  return (
    <div className="p-6 space-y-6">
      <AdminPageHeader
        title="Services"
        description="Manage your service offerings and pricing"
        actionLabel="Add Service"
        onAction={handleOpenCreate}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Services"
          count={totalCount}
          icon={<Wrench className="h-5 w-5 text-blue-600" />}
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
        <StatCard
          label="Avg. Price"
          count={avgPrice}
          icon={<IndianRupee className="h-5 w-5 text-violet-600" />}
          bgClass="bg-violet-50 dark:bg-violet-900/20"
          isPrice
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && services.length === 0 && (
              <TableLoadingRow colSpan={5} />
            )}
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell className="font-medium">{service.title}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {service.category.name ?? "Unknown"}
                  </span>
                </TableCell>
                <TableCell className="font-medium">
                  ₹{service.basePrice.toFixed(2)}
                </TableCell>
                <TableCell>
                  <ActiveBadge isActive={service.isActive} />
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenUpdate(service.id)}
                    disabled={isServiceLoading}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {services.length === 0 && !isServiceLoading && (
              <TableEmptyRow colSpan={5} message="No services found." />
            )}
          </TableBody>
        </Table>
      </div>

      <AdminSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        title={isUpdate ? "Update Service" : "Add Service"}
        description={
          isUpdate
            ? "Update the details of the service below."
            : "Fill in the details to create a new service."
        }
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mt-6 px-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Service title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    <Textarea placeholder="Service description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="basePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base Price (₹)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isUpdate && (
              <ActiveToggleField
                control={form.control}
                description="Determine if this service is visible to users."
              />
            )}
            <SheetFormActions
              isPending={isMutating}
              onCancel={() => setIsSheetOpen(false)}
              submitLabel={isUpdate ? "Update Service" : "Create Service"}
            />
          </form>
        </Form>
      </AdminSheet>
    </div>
  );
}
