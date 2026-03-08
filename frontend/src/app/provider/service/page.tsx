"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Pencil,
  Trash2,
  ListChecks,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";

import {
  useProviderServices,
  useAddProviderService,
  useUpdateProviderService,
  useRemoveProviderService,
} from "@/hooks/provider/useProviderService";
import { useProviderAreas } from "@/hooks/provider/useProviderAreas";
import { usePublicServices, usePublicCategories } from "@/hooks/public/usePublic";
import type { PublicService } from "@/types/public/public.types";

import {
  addServiceSchema,
  updateServiceSchema,
  type AddServiceFormValues,
  type UpdateServiceFormValues,
} from "@/schemas/provider/provider-service.schema";
import type { ProviderServiceWithService } from "@/types/provider/provider-service.types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { StatCard } from "@/components/admin/stat-card";
import { AdminSheet } from "@/components/admin/admin-sheet";
import {
  TableLoadingRow,
  TableEmptyRow,
} from "@/components/admin/table-states";
import { SheetFormActions } from "@/components/admin/sheet-form-actions";

// ─────────────────────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────────────────────

export default function ProviderServicesPage() {
  const { data: myServices = [], isLoading } = useProviderServices();
  const { data: categories = [] } = usePublicCategories();
  const { data: areasRaw = [] } = useProviderAreas();
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>("");

  // Services: only fetch when user selects a category (sends slug to match backend)
  const {
    data: platformServices = [],
    isLoading: isLoadingServices,
    refetch: refetchServices,
  } = usePublicServices(selectedCategorySlug || undefined, {
    enabled: !!selectedCategorySlug,
  });

  const areas = Array.from(new Map(areasRaw.map((a) => [a.id, a])).values());

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

  // ── Stats ──────────────────────────────────────────────────────────
  const totalCount = myServices.length;
  const availableCount = myServices.filter((s) => s.isAvailable).length;
  const unavailableCount = myServices.filter((s) => !s.isAvailable).length;

  // ── IDs already listed by this provider ────────────────────────────
  const listedServiceIds = new Set(myServices.map((s) => s.serviceId));

  // ── Active categories from Public API (fetched on mount, all are active)
  const activeCategories = (categories as { id: string; slug: string; name: string }[]).map(
    (c) => ({ id: c.id, slug: c.slug, name: c.name }),
  );

  // ── Services for selected category (API returns filtered by category) ──
  // Exclude services already listed by this provider
  const platformServicesArray = Array.isArray(platformServices)
    ? (platformServices as PublicService[])
    : [];
  const listableServices = platformServicesArray.filter(
    (s: PublicService) => !listedServiceIds.has(s.id),
  );
  const allFilteredOut =
    platformServicesArray.length > 0 && listableServices.length === 0;

  // ── Forms ──────────────────────────────────────────────────────────
  const addForm = useForm<AddServiceFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(addServiceSchema) as any,
    defaultValues: {
      serviceId: "",
      customPrice: undefined,
      isAvailable: true,
      areaIds: [],
    },
  });

  const editForm = useForm<UpdateServiceFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(updateServiceSchema) as any,
    defaultValues: {
      customPrice: undefined,
      isAvailable: true,
    },
  });

  // ── Handlers ───────────────────────────────────────────────────────
  function handleOpenAdd() {
    setSheetMode("add");
    setSelectedCategorySlug("");
    addForm.reset({
      serviceId: "",
      customPrice: undefined,
      isAvailable: true,
      areaIds: [],
    });
    setIsSheetOpen(true);
  }

  function handleOpenEdit(item: ProviderServiceWithService) {
    setSheetMode("edit");
    setSelectedService(item);
    editForm.reset({
      customPrice: item.customPrice ?? undefined,
      isAvailable: item.isAvailable,
    });
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
      {/* Header */}
      <AdminPageHeader
        title="Listed Services"
        description="Manage the services you offer to customers"
        actionLabel="Add Service"
        onAction={handleOpenAdd}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Listed"
          count={totalCount}
          icon={<ListChecks className="h-5 w-5 text-violet-600" />}
          bgClass="bg-violet-50 dark:bg-violet-900/20"
        />
        <StatCard
          label="Available"
          count={availableCount}
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
          bgClass="bg-emerald-50 dark:bg-emerald-900/20"
        />
        <StatCard
          label="Unavailable"
          count={unavailableCount}
          icon={<XCircle className="h-5 w-5 text-rose-600" />}
          bgClass="bg-rose-50 dark:bg-rose-900/20"
        />
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Base Price</TableHead>
              <TableHead>Your Price</TableHead>
              <TableHead>Slots</TableHead>
              <TableHead>Availability</TableHead>
              <TableHead>Platform Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableLoadingRow colSpan={7} />}
            {myServices.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  {item.service.title}
                </TableCell>
                <TableCell>₹{item.service.basePrice.toFixed(2)}</TableCell>
                <TableCell>
                  {item.customPrice !== null ? (
                    <span className="font-medium">
                      ₹{item.customPrice!.toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-muted-foreground text-xs">
                    Morning, Afternoon, Night (auto-generated)
                  </span>
                </TableCell>
                <TableCell>
                  {item.isAvailable ? (
                    <Badge className="bg-green-100 text-green-800 border border-green-200 hover:bg-green-100 text-xs font-medium">
                      Available
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800 border border-red-200 hover:bg-red-100 text-xs font-medium">
                      Unavailable
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {item.service.isActive ? (
                    <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50 text-xs font-medium">
                      Active
                    </Badge>
                  ) : (
                    <Badge className="bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-100 text-xs font-medium">
                      Inactive
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenEdit(item)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setDeleteTarget(item)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {myServices.length === 0 && !isLoading && (
              <TableEmptyRow
                colSpan={7}
                message="No services listed yet. Click 'Add Service' to get started."
              />
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add / Edit Sheet */}
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
        {isEditing ? (
          /* ── Edit form ── */
          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit(onEditSubmit)}
              className="space-y-6 mt-6 px-4"
            >
              {/* Read-only service info */}
              {selectedService && (
                <div className="rounded-lg bg-muted/50 px-4 py-3 space-y-0.5">
                  <p className="text-xs text-muted-foreground">
                    Editing service
                  </p>
                  <p className="font-semibold text-sm">
                    {selectedService.service.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Base price: ₹{selectedService.service.basePrice.toFixed(2)}
                  </p>
                </div>
              )}

              <FormField
                control={editForm.control}
                name="customPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom Price (₹)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Leave blank to use base price"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : parseFloat(e.target.value),
                          )
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Overrides the platform base price for your listing.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="isAvailable"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Available</FormLabel>
                      <FormDescription>
                        Show this service as available to customers.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <SheetFormActions
                isPending={updateMutation.isPending}
                onCancel={() => setIsSheetOpen(false)}
                submitLabel="Save Changes"
                pendingLabel="Saving..."
              />
            </form>
          </Form>
        ) : (
          /* ── Add form ── */
          <Form {...addForm}>
            <form
              onSubmit={addForm.handleSubmit(onAddSubmit)}
              className="space-y-6 mt-6 px-4"
            >
              {/* Step 1 — Category (UI filter only, not in payload) */}
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  key={`categories-${activeCategories.length}`}
                  value={selectedCategorySlug}
                  onValueChange={(val) => {
                    setSelectedCategorySlug(val);
                    addForm.setValue("serviceId", "");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeCategories.length === 0 ? (
                      <div className="py-4 text-center text-sm text-muted-foreground px-3">
                        No active categories available.
                      </div>
                    ) : (
                      activeCategories.map((c) => (
                        <SelectItem key={c.id} value={c.slug}>
                          {c.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </FormItem>

              {/* Step 2 — Service (filtered by selected category) */}
              <FormField
                control={addForm.control}
                name="serviceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      onOpenChange={(open) => open && refetchServices()}
                      value={field.value}
                      disabled={!selectedCategorySlug}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              !selectedCategorySlug
                                ? "Select a category first"
                                : "Select a service"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent position="popper">
                        {!selectedCategorySlug ? (
                          <SelectItem value="__none__" disabled>
                            Select a category first
                          </SelectItem>
                        ) : isLoadingServices ? (
                          <SelectItem value="__loading__" disabled>
                            <span className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Loading services...
                            </span>
                          </SelectItem>
                        ) : listableServices.length === 0 ? (
                          <SelectItem value="__empty__" disabled>
                            {platformServicesArray.length > 0
                              ? "You've already added all services in this category"
                              : "No available services in this category"}
                          </SelectItem>
                        ) : (
                          listableServices.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.title} — ₹{s.basePrice.toFixed(2)}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Step 3 — Service Areas (optional) */}
              <FormField
                control={addForm.control}
                name="areaIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Areas</FormLabel>
                    <FormDescription>
                      Select the areas where you offer this service (optional).
                    </FormDescription>
                    <FormControl>
                      <div className="max-h-40 overflow-y-auto rounded-md border p-2 space-y-1.5">
                        {areas.length === 0 ? (
                          <p className="text-sm text-muted-foreground py-2 px-2">
                            No areas available. Ask admin to add service areas.
                          </p>
                        ) : (
                          areas.map((area) => {
                            const selected = (field.value ?? []).includes(area.id);
                            return (
                              <div
                                key={area.id}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    const next = selected
                                      ? (field.value ?? []).filter((id) => id !== area.id)
                                      : [...(field.value ?? []), area.id];
                                    field.onChange(next);
                                  }
                                }}
                                onClick={() => {
                                  const next = selected
                                    ? (field.value ?? []).filter((id) => id !== area.id)
                                    : [...(field.value ?? []), area.id];
                                  field.onChange(next);
                                }}
                                className={`flex items-center gap-2 rounded px-2 py-1.5 text-sm cursor-pointer transition-colors ${
                                  selected
                                    ? "bg-primary/10 text-primary"
                                    : "hover:bg-muted"
                                }`}
                              >
                                <div
                                  className={`size-4 rounded border flex items-center justify-center shrink-0 ${
                                    selected ? "bg-primary border-primary" : "border-input"
                                  }`}
                                >
                                  {selected && (
                                    <span className="text-primary-foreground text-xs">✓</span>
                                  )}
                                </div>
                                <span>
                                  {area.name}, {area.city}
                                </span>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={addForm.control}
                name="customPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom Price (₹)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Leave blank to use base price"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : parseFloat(e.target.value),
                          )
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Overrides the platform base price for your listing.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={addForm.control}
                name="isAvailable"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Available</FormLabel>
                      <FormDescription>
                        Show this service as available to customers.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <SheetFormActions
                isPending={addMutation.isPending}
                onCancel={() => setIsSheetOpen(false)}
                submitLabel="Add Service"
                pendingLabel="Adding..."
              />
            </form>
          </Form>
        )}
      </AdminSheet>

      {/* Delete confirmation modal */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                <Trash2 className="size-5 text-destructive" />
              </div>
              <AlertDialogTitle className="text-lg">
                Remove Service?
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-sm leading-relaxed">
              Are you sure you want to remove{" "}
              <span className="font-semibold text-foreground">
                {deleteTarget?.service.title}
              </span>{" "}
              from your listed services? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-2">
            <AlertDialogCancel className="flex-1">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
              disabled={removeMutation.isPending}
            >
              {removeMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Removing...
                </>
              ) : (
                "Yes, remove"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
