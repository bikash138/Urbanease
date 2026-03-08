"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ProfileIdentityCardProps {
  name: string;
  email: string;
  isLoading?: boolean;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "C";
}

export function ProfileIdentityCard({
  name,
  email,
  isLoading = false,
}: ProfileIdentityCardProps) {
  const initials = getInitials(name);

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="pt-6 pb-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-linear-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white font-bold text-2xl select-none shrink-0">
            {isLoading ? (
              <Skeleton className="h-16 w-16 rounded-full" />
            ) : (
              initials
            )}
          </div>
          <div className="min-w-0 flex-1">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-56" />
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-slate-900 truncate">
                  {name}
                </h2>
                <p className="text-slate-500 text-sm truncate">{email}</p>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
