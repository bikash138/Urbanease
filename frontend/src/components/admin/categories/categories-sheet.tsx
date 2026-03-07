import { useEffect } from "react";
import {
  useCreateCategory,
  useUpdateCategory,
} from "@/hooks/admin/useAdminCategory";
import {
  useGeneratePresignedUrl,
  useUploadFileToS3,
} from "@/hooks/admin/useAdminUpload";
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
import { AdminSheet } from "@/components/admin/admin-sheet";
import { SheetFormActions } from "@/components/admin/sheet-form-actions";
import { ActiveToggleField } from "@/components/admin/active-toggle-field";
import { ServiceCategory } from "@/types/admin/admin-category.types";
import { ImageUpload } from "@/components/common/image-upload";

interface CategoriesSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCategory: ServiceCategory | null;
}

export function CategoriesSheet({
  open,
  onOpenChange,
  selectedCategory,
}: CategoriesSheetProps) {
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const generateUrlMutation = useGeneratePresignedUrl();
  const uploadS3Mutation = useUploadFileToS3();

  const isUpdate = !!selectedCategory;
  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    generateUrlMutation.isPending ||
    uploadS3Mutation.isPending;

  const form = useForm<UpdateCategoryFormValues>({
    resolver: zodResolver(
      isUpdate ? updateCategorySchema : createCategorySchema,
    ),
    defaultValues: {
      name: "",
      description: "",
      isActive: true,
      image: undefined,
    },
  });

  useEffect(() => {
    if (open) {
      if (selectedCategory) {
        form.reset({
          name: selectedCategory.name,
          description: selectedCategory.description || "",
          isActive: selectedCategory.isActive,
          image: selectedCategory.imageUrl || undefined,
        });
      } else {
        form.reset({
          name: "",
          description: "",
          isActive: true,
          image: undefined,
        });
      }
    }
  }, [open, selectedCategory, form]);

  const onSubmit = async (data: UpdateCategoryFormValues) => {
    try {
      let finalImageUrl =
        typeof data.image === "string" ? data.image : undefined;

      if (data.image instanceof File) {
        // 1. Get the Presigned URL
        const presignedRes = await generateUrlMutation.mutateAsync({
          filename: data.image.name,
          contentType: data.image.type,
          folder: "categories",
        });

        const { uploadUrl, publicUrl } = presignedRes.data;

        // 2. Upload directly to S3 Bucket
        await uploadS3Mutation.mutateAsync({
          uploadUrl,
          file: data.image,
        });

        finalImageUrl = publicUrl;
      }

      if (!finalImageUrl) {
        // Handle error: require image for categories based on our updated schemas
        return; // Add a toast/alert ideally
      }

      const payload = {
        ...data,
        image: finalImageUrl,
      };

      if (isUpdate && selectedCategory) {
        await updateMutation.mutateAsync({
          id: selectedCategory.id,
          payload: payload,
        });
      } else {
        await createMutation.mutateAsync(payload as any);
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to submit category", error);
    }
  };

  return (
    <AdminSheet
      open={open}
      onOpenChange={onOpenChange}
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
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Image</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value}
                        onChange={field.onChange}
                        onRemove={() => field.onChange(null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Cleaning, Plumbing" {...field} />
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
            onCancel={() => onOpenChange(false)}
            submitLabel={isUpdate ? "Update Category" : "Create Category"}
          />
        </form>
      </Form>
    </AdminSheet>
  );
}
