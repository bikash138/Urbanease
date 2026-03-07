"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type LucideIcon, ChevronRight, LogOut, LayoutDashboard } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { LogoutConfirmModal } from "@/components/common/logout-confirm-modal";
import { cn } from "@/lib/utils";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
}

interface AppSidebarProps {
  navItems: NavItem[];
  appName?: string;
  roleLabel: string;
  logoIcon?: LucideIcon;
}

export function AppSidebar({
  navItems,
  appName = "Urbanease",
  roleLabel,
  logoIcon: LogoIcon = LayoutDashboard,
}: AppSidebarProps) {
  const pathname = usePathname();

  const isActive = (item: NavItem) => {
    if (item.href === "#") return false;
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border/60">
      {/* Header */}
      <SidebarHeader className="border-b border-border/60">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="hover:bg-transparent cursor-default"
            >
              <Link href={"/"}>
                <div className="flex items-center gap-2">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
                    <LogoIcon className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold text-sm">{appName}</span>
                    <span className="text-xs text-muted-foreground">
                      {roleLabel}
                    </span>
                  </div>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Nav Content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => {
              const active = isActive(item);
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={active}
                    tooltip={item.title}
                    className={cn(
                      "transition-all duration-200",
                      active &&
                        "bg-primary/10 text-primary font-medium hover:bg-primary/15 hover:text-primary",
                    )}
                  >
                    <Link href={item.href}>
                      <item.icon className="shrink-0" />
                      <span>{item.title}</span>
                      {active && (
                        <ChevronRight className="ml-auto size-3 opacity-60" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with Logout */}
      <SidebarFooter className="border-t border-border/60">
        <SidebarMenu>
          <SidebarMenuItem>
            <LogoutConfirmModal
              trigger={
                <SidebarMenuButton
                  tooltip="Logout"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors duration-200 w-full"
                >
                  <LogOut className="shrink-0" />
                  <span>Logout</span>
                </SidebarMenuButton>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
