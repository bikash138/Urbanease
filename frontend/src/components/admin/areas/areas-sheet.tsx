"use client";

import { useEffect } from "react";
import { useCreateArea, useUpdateArea } from "@/hooks/admin/useAdminArea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createAreaSchema,
  updateAreaSchema,
  CreateAreaFormValues,
  UpdateAreaFormValues,
} from "@/schemas/admin/admin-area.schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AdminSheet } from "@/components/admin/admin-sheet";
import { SheetFormActions } from "@/components/admin/sheet-form-actions";
import { ActiveToggleField } from "@/components/admin/active-toggle-field";
import { Area } from "@/types/admin/admin-area.types";

interface AreasSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedArea: Area | null;
}

export function AreasSheet({
  open,
  onOpenChange,
  selectedArea,
}: AreasSheetProps) {
  const createMutation = useCreateArea();
  const updateMutation = useUpdateArea();

  const isUpdate = !!selectedArea;
  const isMutating = createMutation.isPending || updateMutation.isPending;

  const form = useForm<UpdateAreaFormValues>({
    resolver: zodResolver(isUpdate ? updateAreaSchema : createAreaSchema),
    defaultValues: {
      name: "",
      city: "",
      state: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (open) {
      if (selectedArea) {
        form.reset({
          name: selectedArea.name,
          city: selectedArea.city,
          state: selectedArea.state,
          isActive: selectedArea.isActive,
        });
      } else {
        form.reset({
          name: "",
          city: "",
          state: "",
          isActive: true,
        });
      }
    }
  }, [open, selectedArea, form]);

  const onSubmit = async (data: UpdateAreaFormValues) => {
    try {
      if (isUpdate && selectedArea) {
        await updateMutation.mutateAsync({
          id: selectedArea.id,
          payload: data,
        });
      } else {
        await createMutation.mutateAsync(data as CreateAreaFormValues);
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to submit area", error);
    }
  };

  return (
    <AdminSheet
      open={open}
      onOpenChange={onOpenChange}
      title={isUpdate ? "Update Service Area" : "Add Service Area"}
      description={
        isUpdate
          ? "Update the details of the service area below."
          : "Fill in the details to create a new service area."
      }
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 mt-6 px-4"
        >
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Area Details
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
                        placeholder="e.g. Downtown, North Side"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Mumbai" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Maharashtra" {...field} />
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
                description="Determine if this area is available for providers to select."
              />
            </section>
          )}

          <SheetFormActions
            isPending={isMutating}
            onCancel={() => onOpenChange(false)}
            submitLabel={isUpdate ? "Update Area" : "Create Area"}
          />
        </form>
      </Form>
    </AdminSheet>
  );
}
