import Link from "next/link";
import {
  User,
  ShoppingBag,
  ListChecks,
  CalendarDays,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const quickLinks = [
  {
    title: "Profile",
    description: "Update your bio, experience, and account details.",
    icon: User,
    href: "/provider/profile",
    color: "bg-violet-500/10 text-violet-600",
  },
  {
    title: "Orders",
    description: "View and manage incoming service requests.",
    icon: ShoppingBag,
    href: "#",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    title: "Listed Services",
    description: "Manage the services you offer to customers.",
    icon: ListChecks,
    href: "#",
    color: "bg-emerald-500/10 text-emerald-600",
  },
  {
    title: "Bookings",
    description: "Track your upcoming and past appointments.",
    icon: CalendarDays,
    href: "#",
    color: "bg-amber-500/10 text-amber-600",
  },
];

const stats = [
  {
    label: "Total Orders",
    value: "—",
    icon: ShoppingBag,
    sub: "Coming soon",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    label: "Bookings",
    value: "—",
    icon: CalendarDays,
    sub: "Coming soon",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    label: "Completed",
    value: "—",
    icon: CheckCircle2,
    sub: "Coming soon",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    label: "Pending",
    value: "—",
    icon: Clock,
    sub: "Coming soon",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
];

export default function ProviderDashboardPage() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      {/* Page header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="size-5 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Overview
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
          Provider Dashboard
        </h1>
        <p className="text-muted-foreground mt-1.5 text-base">
          Welcome back. Here&apos;s a summary of your activity on Urbanease.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="border shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <CardContent className="p-5 flex items-start gap-4">
                <div
                  className={`p-2.5 rounded-xl shrink-0 ${stat.bg}`}
                >
                  <Icon className={`size-5 ${stat.color}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-2xl font-bold text-foreground leading-none">
                    {stat.value}
                  </p>
                  <p className="text-sm font-medium text-foreground mt-1 truncate">
                    {stat.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {stat.sub}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Quick Access
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {quickLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.href}
                className="group relative flex flex-col p-6 h-full overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div
                  className={`p-3 rounded-xl w-14 h-14 flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 ${item.color}`}
                >
                  <Icon className="w-7 h-7" />
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 flex items-center text-sm font-medium text-primary">
                  <span className="relative">
                    Go to {item.title}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                  </span>
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>

                {/* Decorative background glow */}
                <div className="absolute -z-10 -right-16 -top-16 w-40 h-40 bg-linear-to-br from-primary/5 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
