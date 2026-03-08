import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import PublicNavbar from "@/components/public/PublicNavbar";

export function ProviderNotFound() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <PublicNavbar />
      <div className="pt-16 flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center">
          <AlertCircle className="w-7 h-7 text-zinc-400" />
        </div>
        <p className="font-semibold text-zinc-900">Provider not found</p>
        <p className="text-sm text-zinc-400">
          This provider profile doesn&apos;t exist or has been removed.
        </p>
        <Link href="/providers">
          <Button variant="outline" size="sm">
            Browse Providers
          </Button>
        </Link>
      </div>
    </div>
  );
}
