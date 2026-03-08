"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookingPageHeaderProps {
  providerSlug: string;
  providerName: string;
}

export function BookingPageHeader({
  providerSlug,
  providerName,
}: BookingPageHeaderProps) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <Link href={`/providers/${providerSlug}`}>
        <Button
          variant="outline"
          size="icon"
          className="rounded-xl shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      </Link>
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Book a Service</h1>
        <p className="text-sm text-zinc-500 mt-0.5">with {providerName}</p>
      </div>
    </div>
  );
}
