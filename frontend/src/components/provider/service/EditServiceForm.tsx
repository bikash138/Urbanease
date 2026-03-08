"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import type { ProviderServiceWithService } from "@/types/provider/provider-service.types";
import {
  updateServiceSchema,
  type UpdateServiceFormValues,
} from "@/schemas/provider/provider-service.schema";
import { Button } from "@/components/ui/button";
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
import { SheetFormActions } from "@/components/admin/sheet-form-actions";

interface EditServiceFormProps {
  service: ProviderServiceWithService;
  onSubmit: (data: UpdateServiceFormValues) => Promise<void>;
  onCancel: () => void;
  isPending: boolean;
}

export function EditServiceForm({
  service,
  onSubmit,
  onCancel,
  isPending,
}: EditServiceFormProps) {
  const form = useForm<UpdateServiceFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(updateServiceSchema) as any,
    defaultValues: {
      customPrice: service.customPrice ?? undefined,
      isAvailable: service.isAvailable,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 mt-6 px-4"
      >
        <div className="rounded-lg bg-muted/50 px-4 py-3 space-y-0.5">
          <p className="text-xs text-muted-foreground">Editing service</p>
          <p className="font-semibold text-sm">{service.service.title}</p>
          <p className="text-xs text-muted-foreground">
            Base price: ₹{service.service.basePrice.toFixed(2)}
          </p>
        </div>

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
          submitLabel="Save Changes"
          pendingLabel="Saving..."
        />
      </form>
    </Form>
  );
}
