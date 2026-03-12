"use client";

import { Image } from "@imagekit/next";
import { Loader2 } from "lucide-react";
import type { ProviderProfileData } from "@/types/provider/provider-profile.types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { STATUS_CONFIG } from "./constants";

interface ProviderIdentityCardProps {
  profile: ProviderProfileData | null;
  userName: string;
  userEmail: string;
  isLoading: boolean;
  isUploadingImage?: boolean;
}

export function ProviderIdentityCard({
  profile,
  userName,
  userEmail,
  isLoading,
  isUploadingImage = false,
}: ProviderIdentityCardProps) {
  const statusConfig = profile ? STATUS_CONFIG[profile.status] : null;

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 shrink-0">
            <div className="relative h-16 w-16 rounded-full overflow-hidden">
              <Image
                src={profile?.profileImage || "/error-placeholder-image.webp"}
                alt={userName}
                fill
                className="object-cover"
              />
              {isUploadingImage && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-background/80">
                  <Loader2 className="size-6 animate-spin text-primary" />
                </div>
              )}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-semibold text-slate-900 truncate">
                {userName ?? "Provider"}
              </h2>
              {isLoading ? (
                <Skeleton className="h-5 w-24 rounded-full" />
              ) : statusConfig ? (
                <Badge
                  className={`text-xs font-medium border ${statusConfig.className}`}
                >
                  {statusConfig.label}
                </Badge>
              ) : null}
            </div>
            <p className="text-slate-500 text-sm truncate">{userEmail}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
