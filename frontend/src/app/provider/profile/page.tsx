"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuthStore } from "@/store/auth.store";
import type { ProviderProfilePayload } from "@/types/provider/provider-profile.types";
import {
  useProviderProfile,
  useUpdateProviderProfile,
} from "@/hooks/provider/useProviderProfile";
import {
  useGenerateProviderPresignedUrl,
  useUploadFileToS3,
} from "@/hooks/provider/useProviderUpload";

import { PageHeader } from "@/components/common/page-header";
import {
  ProviderIdentityCard,
  ProfileDetailsCard,
  ProfileTipsCard,
} from "@/components/provider/profile";

export default function ProviderProfilePage() {
  const { user } = useAuthStore();
  const { data: profile = null, isLoading, error: fetchError } = useProviderProfile();
  const updateMutation = useUpdateProviderProfile();
  const generateUrlMutation = useGenerateProviderPresignedUrl();
  const uploadS3Mutation = useUploadFileToS3();

  const [isEditing, setIsEditing] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const isUploadingImage =
    generateUrlMutation.isPending || uploadS3Mutation.isPending;

  const { register, handleSubmit, reset, formState: { errors } } =
    useForm<ProviderProfilePayload>();

  useEffect(() => {
    if (profile) {
      reset({ bio: profile.bio ?? "", experience: profile.experience });
    }
  }, [profile, reset]);

  async function handleProfileImageUpload(file: File | null) {
    if (!file) return;
    setSaveError(null);
    try {
      const presignedRes = await generateUrlMutation.mutateAsync({
        filename: file.name,
        contentType: file.type,
        folder: "profiles",
      });
      const { uploadUrl, publicUrl } = presignedRes.data;
      await uploadS3Mutation.mutateAsync({ uploadUrl, file });
      await updateMutation.mutateAsync({ profileImage: publicUrl });
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to upload image");
    }
  }

  async function onSubmit(data: ProviderProfilePayload) {
    setSaveSuccess(false);
    setSaveError(null);
    try {
      await updateMutation.mutateAsync({
        bio: data.bio,
        experience: data.experience ? Number(data.experience) : undefined,
      });
      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save profile");
    }
  }

  function handleEdit() {
    setSaveError(null);
    setSaveSuccess(false);
    setIsEditing(true);
  }

  function handleCancel() {
    reset({ bio: profile?.bio ?? "", experience: profile?.experience });
    setSaveError(null);
    setIsEditing(false);
  }

  const fetchErrorMessage =
    fetchError instanceof Error ? fetchError.message : fetchError ? String(fetchError) : null;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-6 md:p-8">
      <div className="w-full space-y-6">
        <PageHeader
          title="Provider Profile"
          description="Manage your provider information and service details"
        />

        <ProviderIdentityCard
          profile={profile}
          userName={user?.name ?? "Provider"}
          userEmail={user?.email ?? ""}
          isLoading={isLoading}
          isUploadingImage={isUploadingImage}
        />

        <ProfileDetailsCard
          profile={profile}
          isLoading={isLoading}
          fetchError={fetchErrorMessage}
          isEditing={isEditing}
          saveError={saveError}
          saveSuccess={saveSuccess}
          isSaving={updateMutation.isPending}
          isUploadingImage={isUploadingImage}
          onEdit={handleEdit}
          onCancel={handleCancel}
          onSubmit={onSubmit}
          onImageChange={handleProfileImageUpload}
          register={register}
          handleSubmit={handleSubmit}
          errors={errors}
        />

        {!isLoading && !fetchErrorMessage && !isEditing && <ProfileTipsCard />}
      </div>
    </div>
  );
}
