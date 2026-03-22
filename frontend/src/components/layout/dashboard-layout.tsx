"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

function formatSegmentLabel(seg: string): string {
  return seg
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function BreadcrumbNav() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav className="flex items-center gap-1 text-sm text-muted-foreground">
      {segments.map((seg, idx) => {
        const isLast = idx === segments.length - 1;
        const href = "/" + segments.slice(0, idx + 1).join("/");
        const label = formatSegmentLabel(seg);

        return (
          <span key={href} className="flex items-center gap-1">
            {idx > 0 && <ChevronRight className="size-3.5 opacity-50" />}
            {isLast ? (
              <span className="font-medium text-foreground">{label}</span>
            ) : (
              <Link
                href={href}
                className="hover:text-foreground transition-colors"
              >
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

export function DashboardLayout({ children, sidebar }: DashboardLayoutProps) {
  return (
    <SidebarProvider className="bg-white min-h-svh">
      <div className="flex min-h-screen w-full max-w-7xl mx-auto bg-white">
        {sidebar}

        {/* Main content area */}
        <div className="flex flex-1 flex-col overflow-hidden min-w-0 bg-white">
          {/* Top bar */}
          <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-border/60 bg-white px-4">
            <SidebarTrigger className="shrink-0" />
            <Separator orientation="vertical" className="h-5" />
            <BreadcrumbNav />
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto bg-white">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
