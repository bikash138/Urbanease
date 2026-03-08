"use client";

import {
  LayoutDashboard,
  User,
  ListChecks,
  CalendarDays,
  Wrench,
} from "lucide-react";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

const navItems = [
  {
    title: "Dashboard",
    href: "/provider",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    title: "Profile",
    href: "/provider/profile",
    icon: User,
  },
  {
    title: "Listed Services",
    href: "/provider/service",
    icon: ListChecks,
  },
  {
    title: "Bookings",
    href: "/provider/bookings",
    icon: CalendarDays,
  },
];

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout
      sidebar={
        <AppSidebar
          navItems={navItems}
          roleLabel="Provider Dashboard"
          logoIcon={Wrench}
        />
      }
    >
      {children}
    </DashboardLayout>
  );
}
