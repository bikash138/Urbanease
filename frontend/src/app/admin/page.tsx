import Link from "next/link";
import { Users, Tags, Briefcase, Star, ArrowRight } from "lucide-react";

export default function AdminDashboardPage() {
  const sections = [
    {
      title: "Providers",
      description: "Manage service providers, their status, and details.",
      icon: Users,
      href: "/admin/providers",
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      title: "Categories",
      description: "Organize platform services into logical categories.",
      icon: Tags,
      href: "/admin/categories",
      color: "bg-indigo-500/10 text-indigo-500",
    },
    {
      title: "Services",
      description: "Configure available services, pricing, and rules.",
      icon: Briefcase,
      href: "/admin/services",
      color: "bg-emerald-500/10 text-emerald-500",
    },
    {
      title: "Reviews",
      description: "Monitor, moderate, and analyze customer feedback.",
      icon: Star,
      href: "/admin/reviews",
      color: "bg-amber-500/10 text-amber-500",
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Welcome back. Navigate quickly to your main administrative sections
          below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link
              key={section.title}
              href={section.href}
              className="group relative flex flex-col p-6 h-full overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div
                className={`p-3 rounded-xl w-14 h-14 flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 ${section.color}`}
              >
                <Icon className="w-7 h-7" />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-xl mb-2 flex items-center justify-between">
                  {section.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {section.description}
                </p>
              </div>

              <div className="mt-6 flex items-center text-sm font-medium text-primary">
                <span className="relative">
                  Manage {section.title}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                </span>
                <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </div>

              {/* Decorative background gradient */}
              <div className="absolute -z-10 -right-20 -top-20 w-48 h-48 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
