"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { useAuthStore } from "@/store/auth.store";
import {
  getProviderProfileAPI,
  updateProviderProfileAPI,
} from "@/api/provider/provider-profile.api";
import { ProviderProfileData, ProviderProfilePayload } from "@/types/provider/provider-profile.types";
import { asyncHandler } from "@/lib/utils";
import {
  useGenerateProviderPresignedUrl,
  useUploadFileToS3,
} from "@/hooks/provider/useProviderUpload";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ImageUpload } from "@/components/common/image-upload";

const STATUS_CONFIG = {
  PENDING: {
    label: "Pending Review",
    variant: "secondary" as const,
    className: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100",
  },
  APPROVED: {
    label: "Approved",
    variant: "secondary" as const,
    className: "bg-green-100 text-green-800 border-green-200 hover:bg-green-100",
  },
  REJECTED: {
    label: "Rejected",
    variant: "secondary" as const,
    className: "bg-red-100 text-red-800 border-red-200 hover:bg-red-100",
  },
};

export default function ProviderProfilePage() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<ProviderProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const generateUrlMutation = useGenerateProviderPresignedUrl();
  const uploadS3Mutation = useUploadFileToS3();
  const isUploadingImage =
    generateUrlMutation.isPending || uploadS3Mutation.isPending;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProviderProfilePayload>();

  async function handleProfileImageUpload(file: File | null) {
    if (!file) return;
    await asyncHandler(
      async () => {
        const presignedRes = await generateUrlMutation.mutateAsync({
          filename: file.name,
          contentType: file.type,
          folder: "profiles",
        });
        const { uploadUrl, publicUrl } = presignedRes.data;
        await uploadS3Mutation.mutateAsync({ uploadUrl, file });
        const res = await updateProviderProfileAPI({ profileImage: publicUrl });
        setProfile(res.data);
      },
      setSaveError,
      () => {},
      false,
    );
  }

  useEffect(() => {
    asyncHandler(
      async () => {
        const res = await getProviderProfileAPI();
        setProfile(res.data);
        reset({ bio: res.data.bio ?? "", experience: res.data.experience });
      },
      setFetchError,
      setIsLoading,
      false,
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(data: ProviderProfilePayload) {
    setSaveSuccess(false);
    await asyncHandler(
      async () => {
        const res = await updateProviderProfileAPI({
          bio: data.bio,
          experience: data.experience ? Number(data.experience) : undefined,
        });
        setProfile(res.data);
        setSaveSuccess(true);
        setIsEditing(false);
        setTimeout(() => setSaveSuccess(false), 3000);
      },
      setSaveError,
      setIsSaving,
      false,
    );
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

  const statusConfig = profile ? STATUS_CONFIG[profile.status] : null;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-6 md:p-8">
      <div className="w-full space-y-6">

        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Provider Profile
          </h1>
          <p className="text-slate-500 text-sm">
            Manage your provider information and service details
          </p>
        </div>

        {/* Identity Card */}
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              {profile?.profileImage ? (
                <div className="relative h-16 w-16 rounded-full overflow-hidden shrink-0">
                  <Image
                    src={profile.profileImage}
                    alt={user?.name ?? "Profile"}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-16 w-16 rounded-full bg-linear-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl select-none shrink-0">
                  {user?.name?.charAt(0).toUpperCase() ?? "P"}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-semibold text-slate-900 truncate">
                    {user?.name ?? "Provider"}
                  </h2>
                  {isLoading ? (
                    <Skeleton className="h-5 w-24 rounded-full" />
                  ) : statusConfig ? (
                    <Badge className={`text-xs font-medium border ${statusConfig.className}`}>
                      {statusConfig.label}
                    </Badge>
                  ) : null}
                </div>
                <p className="text-slate-500 text-sm truncate">{user?.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Photo Card */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-slate-900">Profile Photo</CardTitle>
            <CardDescription className="text-sm mt-0.5">
              Your photo is shown to customers on service pages and your profile
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="pt-5">
            <div className="max-w-xs">
              <ImageUpload
                value={profile?.profileImage ?? null}
                onChange={(file) => handleProfileImageUpload(file)}
                disabled={isUploadingImage}
                className="aspect-square max-h-48"
              />
              {isUploadingImage && (
                <p className="text-xs text-slate-500 mt-2">Uploading...</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Profile Info Card */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg text-slate-900">Profile Details</CardTitle>
                <CardDescription className="text-sm mt-0.5">
                  Your bio and experience shown to customers
                </CardDescription>
              </div>
              {!isLoading && !isEditing && (
                <Button variant="outline" size="sm" onClick={handleEdit}>
                  Edit
                </Button>
              )}
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="pt-5">
            {isLoading ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-20 w-full rounded-md" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              </div>
            ) : fetchError ? (
              <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
                {fetchError}
              </div>
            ) : isEditing ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-slate-700 font-medium">
                    Bio
                  </Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell customers about yourself and your services..."
                    rows={4}
                    className="resize-none text-sm"
                    {...register("bio")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience" className="text-slate-700 font-medium">
                    Years of Experience
                  </Label>
                  <Input
                    id="experience"
                    type="number"
                    min={0}
                    placeholder="e.g. 5"
                    className="text-sm w-40"
                    {...register("experience", {
                      min: { value: 0, message: "Experience cannot be negative" },
                    })}
                  />
                  {errors.experience && (
                    <p className="text-xs text-red-600">{errors.experience.message}</p>
                  )}
                </div>

                {saveError && (
                  <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
                    {saveError}
                  </div>
                )}

                <div className="flex gap-2 pt-1">
                  <Button type="submit" size="sm" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-5">
                {saveSuccess && (
                  <div className="rounded-lg bg-green-50 border border-green-100 px-4 py-3 text-sm text-green-700">
                    Profile updated successfully.
                  </div>
                )}

                <div className="space-y-1">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Bio</p>
                  {profile?.bio ? (
                    <p className="text-sm text-slate-800 leading-relaxed">{profile.bio}</p>
                  ) : (
                    <p className="text-sm text-slate-400 italic">No bio added yet.</p>
                  )}
                </div>

                <Separator />

                <div className="space-y-1">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Years of Experience
                  </p>
                  <p className="text-sm text-slate-800">
                    {profile?.experience != null
                      ? `${profile.experience} ${profile.experience === 1 ? "year" : "years"}`
                      : <span className="text-slate-400 italic">Not specified</span>}
                  </p>
                </div>

                <Separator />

                <div className="space-y-1">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Account Status
                  </p>
                  {statusConfig && (
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs font-medium border ${statusConfig.className}`}>
                        {statusConfig.label}
                      </Badge>
                      {profile?.status === "PENDING" && (
                        <span className="text-xs text-slate-400">
                          Your account is under review by our team.
                        </span>
                      )}
                      {profile?.status === "REJECTED" && (
                        <span className="text-xs text-slate-400">
                          Please contact support for more information.
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tips Card */}
        {!isLoading && !fetchError && !isEditing && (
          <Card className="border-0 shadow-sm bg-violet-50">
            <CardContent className="pt-5 pb-5">
              <p className="text-xs font-semibold text-violet-700 uppercase tracking-wide mb-2">
                Tips for a great profile
              </p>
              <ul className="space-y-1">
                {[
                  "Write a clear bio describing your expertise and services.",
                  "Keep your experience accurate to build customer trust.",
                  "A complete profile gets more visibility on the platform.",
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-1.5 text-xs text-violet-700">
                    <span className="mt-0.5 shrink-0">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
