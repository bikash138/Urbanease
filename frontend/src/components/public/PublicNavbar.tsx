import { Suspense } from "react";
import Link from "next/link";
import { Building2 } from "lucide-react";
import { PublicNavbarClientFallback } from "@/components/public/fallbacks/PublicNavbarClientFallback";
import PublicNavbarNavSearch from "@/components/public/PublicNavbarNavSearch";
import { PublicNavbarRight } from "@/components/public/PublicNavbarRight";

export default function PublicNavbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border-b border-zinc-200/50 dark:border-zinc-800/50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center">
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <span className="hidden md:inline text-xl font-semibold text-zinc-900 tracking-tight">
            Urbanease
          </span>
        </Link>

        <Suspense fallback={<PublicNavbarClientFallback />}>
          <PublicNavbarNavSearch />
          <PublicNavbarRight />
        </Suspense>
      </div>
    </header>
  );
}
