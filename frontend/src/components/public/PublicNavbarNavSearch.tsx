"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const navItems = [
  { label: "Categories", href: "/categories" },
  { label: "Providers", href: "/providers" },
  { label: "About", href: "/about" },
];

export default function PublicNavbarNavSearch() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) {
      router.push("/search");
      return;
    }
    router.push(`/search?service=${encodeURIComponent(q)}`);
  }

  return (
    <div className="flex flex-1 min-w-0 items-center gap-3 md:gap-6">
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

      <form
        onSubmit={handleSearch}
        className="flex flex-1 min-w-0 w-full md:max-w-md"
      >
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
    </div>
  );
}
