"use client";

import { useRef } from "react";
import { Camera, Loader2 } from "lucide-react";
import type { UseFormRegister, UseFormHandleSubmit, FieldErrors } from "react-hook-form";
import type {
  ProviderProfileData,
  ProviderProfilePayload,
} from "@/types/provider/provider-profile.types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { STATUS_CONFIG } from "./constants";

interface ProfileDetailsCardProps {
  profile: ProviderProfileData | null;
  isLoading: boolean;
  fetchError: string | null;
  isEditing: boolean;
  saveError: string | null;
  saveSuccess: boolean;
  isSaving: boolean;
  isUploadingImage?: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSubmit: (data: ProviderProfilePayload) => void | Promise<void>;
  onImageChange?: (file: File) => void | Promise<void>;
  register: UseFormRegister<ProviderProfilePayload>;
  handleSubmit: UseFormHandleSubmit<ProviderProfilePayload>;
  errors: FieldErrors<ProviderProfilePayload>;
}

export function ProfileDetailsCard({
  profile,
  isLoading,
  fetchError,
  isEditing,
  saveError,
  saveSuccess,
  isSaving,
  isUploadingImage = false,
  onEdit,
  onCancel,
  onSubmit,
  onImageChange,
  register,
  handleSubmit,
  errors,
}: ProfileDetailsCardProps) {
  const statusConfig = profile ? STATUS_CONFIG[profile.status] : null;
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg text-slate-900">
              Profile Details
            </CardTitle>
            <CardDescription className="text-sm mt-0.5">
              Your bio and experience shown to customers
            </CardDescription>
          </div>
          {!isLoading && !isEditing && (
            <div className="flex items-center gap-2">
              {onImageChange && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file?.type.startsWith("image/")) {
                        onImageChange(file);
                      }
                      e.target.value = "";
                    }}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingImage}
                    className="gap-1.5"
                  >
                    {isUploadingImage ? (
                      <Loader2 className="size-4 animate-spin shrink-0" />
                    ) : (
                      <Camera className="size-4 shrink-0" />
                    )}
                    Change Photo
                  </Button>
                </>
              )}
              <Button variant="outline" size="sm" onClick={onEdit}>
                Edit
              </Button>
            </div>
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
                  min: {
                    value: 0,
                    message: "Experience cannot be negative",
                  },
                })}
              />
              {errors.experience && (
                <p className="text-xs text-red-600">
                  {errors.experience.message}
                </p>
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
                onClick={onCancel}
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
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Bio
              </p>
              {profile?.bio ? (
                <p className="text-sm text-slate-800 leading-relaxed">
                  {profile.bio}
                </p>
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
                {profile?.experience != null ? (
                  `${profile.experience} ${profile.experience === 1 ? "year" : "years"}`
                ) : (
                  <span className="text-slate-400 italic">Not specified</span>
                )}
              </p>
            </div>

            <Separator />

            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Account Status
              </p>
              {statusConfig && (
                <div className="flex items-center gap-2">
                  <Badge
                    className={`text-xs font-medium border ${statusConfig.className}`}
                  >
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
  );
}
