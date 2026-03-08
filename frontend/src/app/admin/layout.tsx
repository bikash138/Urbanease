"use client";

import { Tags, Briefcase, Users, Star, LayoutDashboard, MapPin, Shield } from "lucide-react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

const navItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    title: "Categories",
    href: "/admin/categories",
    icon: Tags,
  },
  {
    title: "Services",
    href: "/admin/services",
    icon: Briefcase,
  },
  {
    title: "Service Areas",
    href: "/admin/areas",
    icon: MapPin,
  },
  {
    title: "Providers",
    href: "/admin/providers",
    icon: Users,
  },
  {
    title: "Reviews",
    href: "/admin/reviews",
    icon: Star,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout
      sidebar={
        <AppSidebar
          navItems={navItems}
          roleLabel="Admin Panel"
          logoIcon={Shield}
        />
      }
    >
      {children}
    </DashboardLayout>
  );
}
