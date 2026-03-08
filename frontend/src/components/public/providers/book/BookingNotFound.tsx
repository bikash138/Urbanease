"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import PublicNavbar from "@/components/public/PublicNavbar";

export function BookingNotFound() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <PublicNavbar />
      <div className="pt-28 flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <AlertCircle className="w-10 h-10 text-zinc-400" />
        <p className="font-semibold text-zinc-700">Provider not found</p>
        <Link href="/providers">
          <Button variant="outline" size="sm">
            Browse Providers
          </Button>
        </Link>
      </div>
    </div>
  );
}
