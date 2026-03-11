"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, Search, ShoppingCart, UserCircle } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";

const navItems = [
  { label: "Categories", href: "/categories" },
  { label: "Providers", href: "/providers" },
  { label: "About", href: "/about" },
];

const profileHref: Record<string, string> = {
  CUSTOMER: "/customer",
  PROVIDER: "/provider",
  ADMIN: "/admin",
};

export default function PublicNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, role } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    queueMicrotask(() => setMounted(true))
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) {
      router.push("/search");
      return;
    }
    router.push(`/search?service=${encodeURIComponent(q)}`);
  };

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

        <nav className="hidden md:flex items-center gap-8 shrink-0">
          {navItems.map(({ label, href }) => (
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
          ))}
        </nav>

        <form onSubmit={handleSearch} className="flex flex-1 min-w-0 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
            <Input
              type="search"
              placeholder="Search for a service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 w-full rounded-lg border-zinc-200 bg-zinc-50/50 focus:bg-white"
            />
          </div>
        </form>

        <div className="flex items-center gap-2 shrink-0 ml-auto">
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
