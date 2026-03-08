"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import type { PublicService } from "@/types/public/public.types";
import type { ProviderArea } from "@/types/provider/provider-area.types";
import {
  addServiceSchema,
  type AddServiceFormValues,
} from "@/schemas/provider/provider-service.schema";
import { usePublicServices } from "@/hooks/public/usePublic";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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
import { SheetFormActions } from "@/components/admin/sheet-form-actions";

interface CategoryOption {
  id: string;
  slug: string;
  name: string;
}

interface AddServiceFormProps {
  categories: CategoryOption[];
  areas: ProviderArea[];
  listedServiceIds: Set<string>;
  onSubmit: (data: AddServiceFormValues) => Promise<void>;
  onCancel: () => void;
  isPending: boolean;
}

export function AddServiceForm({
  categories,
  areas,
  listedServiceIds,
  onSubmit,
  onCancel,
  isPending,
}: AddServiceFormProps) {
  const [selectedCategorySlug, setSelectedCategorySlug] = useState("");

  const {
    data: platformServices = [],
    isLoading: isLoadingServices,
    refetch: refetchServices,
  } = usePublicServices(selectedCategorySlug || undefined, {
    enabled: !!selectedCategorySlug,
  });

  const platformServicesArray = Array.isArray(platformServices)
    ? (platformServices as PublicService[])
    : [];
  const listableServices = platformServicesArray.filter(
    (s) => !listedServiceIds.has(s.id)
  );

  const form = useForm<AddServiceFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(addServiceSchema) as any,
    defaultValues: {
      serviceId: "",
      customPrice: undefined,
      isAvailable: true,
      areaIds: [],
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6 px-4">
        <FormItem>
          <FormLabel>Category</FormLabel>
          <Select
            key={`categories-${categories.length}`}
            value={selectedCategorySlug}
            onValueChange={(val) => {
              setSelectedCategorySlug(val);
              form.setValue("serviceId", "");
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.length === 0 ? (
                <div className="py-4 text-center text-sm text-muted-foreground px-3">
                  No active categories available.
                </div>
              ) : (
                categories.map((c) => (
                  <SelectItem key={c.id} value={c.slug}>
                    {c.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </FormItem>

        <FormField
          control={form.control}
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
                      {platformServices.length > 0
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

        <FormField
          control={form.control}
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
                              <span className="text-primary-foreground text-xs">
                                ✓
                              </span>
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
          control={form.control}
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
                        : parseFloat(e.target.value)
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
          control={form.control}
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
          isPending={isPending}
          onCancel={onCancel}
          submitLabel="Add Service"
          pendingLabel="Adding..."
        />
      </form>
    </Form>
  );
}
