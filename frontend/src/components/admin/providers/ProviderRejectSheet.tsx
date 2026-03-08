import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ProviderProfile } from "@/types/admin/admin-provider.types";
import { AdminSheet } from "@/components/admin/admin-sheet";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SheetFormActions } from "@/components/admin/sheet-form-actions";
import { rejectProviderSchema, type RejectProviderFormValues } from "./constants";
import { XCircle } from "lucide-react";

interface ProviderRejectSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  provider: ProviderProfile | null;
  isPending: boolean;
  onSubmit: (providerId: string, data: RejectProviderFormValues) => void;
}

export function ProviderRejectSheet({
  open,
  onOpenChange,
  provider,
  isPending,
  onSubmit,
}: ProviderRejectSheetProps) {
  const form = useForm<RejectProviderFormValues>({
    resolver: zodResolver(rejectProviderSchema),
    defaultValues: { rejectionReason: "" },
  });

  const handleSubmit = form.handleSubmit((data) => {
    if (provider) {
      onSubmit(provider.id, data);
      form.reset();
      onOpenChange(false);
    }
  });

  const handleOpenChange = (next: boolean) => {
    if (!next) form.reset();
    onOpenChange(next);
  };

  return (
    <AdminSheet
      open={open}
      onOpenChange={handleOpenChange}
      title="Reject Provider"
      description={
        provider
          ? `Reject application from ${provider.user.name}. Provide a reason.`
          : undefined
      }
      maxWidth="sm:max-w-md"
    >
      {provider && (
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <FormField
              control={form.control}
              name="rejectionReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rejection Reason</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Explain why the application was rejected..."
                      className="min-h-[120px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFormActions
              isPending={isPending}
              onCancel={() => handleOpenChange(false)}
              submitLabel="Reject Provider"
              pendingLabel="Rejecting..."
              destructive
              submitIcon={<XCircle className="h-4 w-4" />}
            />
          </form>
        </Form>
      )}
    </AdminSheet>
  );
}
