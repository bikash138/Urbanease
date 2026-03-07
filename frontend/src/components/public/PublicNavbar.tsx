"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Building2, ShoppingCart, UserCircle } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";

const navItems = [
  { label: "Categories", href: "/categories" },
  { label: "Providers", href: "/providers" },
  { label: "Testimonials", href: "#" },
  { label: "About", href: "#" },
];

const profileHref: Record<string, string> = {
  CUSTOMER: "/customer",
  PROVIDER: "/provider",
  ADMIN: "/admin",
};

export default function PublicNavbar() {
  const pathname = usePathname();
  const { isAuthenticated, role } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-zinc-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center">
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-semibold text-zinc-900 tracking-tight">
            Urbanease
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map(({ label, href }) =>
            href ? (
              <Link
                key={label}
                href={href}
                className={`text-sm transition-colors ${
                  pathname === href
                    ? "text-zinc-900 font-medium"
                    : "text-zinc-800 hover:text-zinc-900"
                }`}
              >
                {label}
              </Link>
            ) : (
              <span
                key={label}
                className="text-sm text-zinc-500 cursor-default"
              >
                {label}
              </span>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          {!mounted ? (
            <div className="w-[140px]" />
          ) : isAuthenticated && role ? (
            <>
              {role === "CUSTOMER" && (
                <Link href="/customer/bookings">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100"
                    aria-label="Cart"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </Button>
                </Link>
              )}
              <Link href={profileHref[role]}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100"
                  aria-label="Profile"
                >
                  <UserCircle className="w-5 h-5" />
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth/signin">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-zinc-800 hover:text-zinc-900 hover:bg-zinc-100"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button
                  size="sm"
                  className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg"
                >
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
