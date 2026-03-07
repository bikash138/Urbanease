"use client";

import { User, CalendarDays, Star, ShoppingBag } from "lucide-react";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

const navItems = [
  {
    title: "Profile",
    href: "/customer/profile",
    icon: User,
  },
  {
    title: "Your Bookings",
    href: "/customer/bookings",
    icon: ShoppingBag,
  },
  {
    title: "Reviews",
    href: "#",
    icon: Star,
  },
];

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout
      sidebar={
        <AppSidebar
          navItems={navItems}
          roleLabel="Customer Panel"
          logoIcon={CalendarDays}
        />
      }
    >
      {children}
    </DashboardLayout>
  );
}
