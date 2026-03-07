import { useEffect } from "react";
import {
  useCreateService,
  useUpdateService,
} from "@/hooks/admin/useAdminService";
import {
  useGeneratePresignedUrl,
  useUploadFileToS3,
} from "@/hooks/admin/useAdminUpload";
import { useCategories } from "@/hooks/admin/useAdminCategory";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createServiceSchema,
  updateServiceSchema,
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
import { AdminSheet } from "@/components/admin/admin-sheet";
import { SheetFormActions } from "@/components/admin/sheet-form-actions";
import { ActiveToggleField } from "@/components/admin/active-toggle-field";
import { ImageUpload } from "@/components/common/image-upload";
import {
  Service,
  CreateServicePayload,
  UpdateServicePayload,
} from "@/types/admin/admin-service.types";

interface ServicesSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedService: Service | null;
}

type ServiceFormValues = {
  title: string;
  description: string;
  basePrice: number;
  categoryId: string;
  isActive: boolean;
  image?: any;
};

export function ServicesSheet({
  open,
  onOpenChange,
  selectedService,
}: ServicesSheetProps) {
  const { data: categories = [] } = useCategories();
  const createMutation = useCreateService();
  const updateMutation = useUpdateService();
  const generateUrlMutation = useGeneratePresignedUrl();
  const uploadS3Mutation = useUploadFileToS3();

  const isUpdate = !!selectedService;
  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    generateUrlMutation.isPending ||
    uploadS3Mutation.isPending;

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(
      isUpdate ? updateServiceSchema : createServiceSchema,
    ) as unknown as Resolver<ServiceFormValues>,
    defaultValues: {
      title: "",
      description: "",
      basePrice: 100,
      categoryId: "",
      isActive: true,
      image: undefined,
    },
  });

  useEffect(() => {
    if (open) {
      if (selectedService) {
        form.reset({
          title: selectedService.title,
          description: selectedService.description || "",
          basePrice: selectedService.basePrice,
          categoryId: selectedService.categoryId,
          isActive: selectedService.isActive,
          image: selectedService.image || undefined,
        });
      } else {
        form.reset({
          title: "",
          description: "",
          basePrice: 0,
          categoryId: "",
          isActive: true,
          image: undefined,
        });
      }
    }
  }, [open, selectedService, form]);

  const onSubmit = async (data: ServiceFormValues) => {
    try {
      let finalImageUrl =
        typeof data.image === "string" ? data.image : undefined;

      if (data.image instanceof File) {
        const presignedRes = await generateUrlMutation.mutateAsync({
          filename: data.image.name,
          contentType: data.image.type,
          folder: "services",
        });

        const { uploadUrl, publicUrl } = presignedRes.data;

        await uploadS3Mutation.mutateAsync({
          uploadUrl,
          file: data.image,
        });

        finalImageUrl = publicUrl;
      }

      if (!finalImageUrl) {
        return; // Early return if image is required
      }

      if (isUpdate && selectedService) {
        const updatePayload: UpdateServicePayload = {
          title: data.title,
          description: data.description,
          basePrice: data.basePrice,
          categoryId: data.categoryId,
          isActive: data.isActive,
          image: finalImageUrl,
        };
        await updateMutation.mutateAsync({
          id: selectedService.id,
          payload: updatePayload,
        });
      } else {
        const createPayload: CreateServicePayload = {
          title: data.title,
          description: data.description,
          basePrice: data.basePrice,
          categoryId: data.categoryId,
          image: finalImageUrl,
        };
        await createMutation.mutateAsync(createPayload);
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to submit service", error);
    }
  };

  return (
    <AdminSheet
      open={open}
      onOpenChange={onOpenChange}
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
          className="space-y-5 mt-6 px-4"
        >
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    onRemove={() => field.onChange(null)}
                    disabled={isMutating}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
              description="Determine if this service is active and available."
            />
          )}

          <SheetFormActions
            isPending={isMutating}
            onCancel={() => onOpenChange(false)}
            submitLabel={isUpdate ? "Update Service" : "Create Service"}
          />
        </form>
      </Form>
    </AdminSheet>
  );
}
