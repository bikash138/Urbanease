"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingCart, UserCircle } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { PublicNavbarAuthSkeleton } from "@/components/public/PublicNavbarAuthSkeleton";

const profileHref: Record<string, string> = {
  CUSTOMER: "/customer",
  PROVIDER: "/provider",
  ADMIN: "/admin",
};

export default function PublicNavbarAuth() {
  const [hydrated, setHydrated] = useState(false);
  const { isAuthenticated, role } = useAuthStore();

  useEffect(() => {
    const id = requestAnimationFrame(() => setHydrated(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!hydrated) {
    return <PublicNavbarAuthSkeleton />;
  }

  if (isAuthenticated && role) {
    return (
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 min-w-0 md:min-w-[168px] justify-end">
        {role === "CUSTOMER" && (
          <Link href="/customer/bookings">
            <Button
              type="button"
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
            type="button"
            variant="ghost"
            size="icon"
            className="text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100"
            aria-label="Profile"
          >
            <UserCircle className="w-5 h-5" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 shrink-0 min-w-0 justify-end">
      <Link href="/auth/signin" className="hidden md:block">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-zinc-800 hover:text-zinc-900 hover:bg-zinc-100"
        >
          Sign In
        </Button>
      </Link>
      <Link href="/auth/signup">
        <Button
          type="button"
          size="sm"
          className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg px-3 sm:px-4"
        >
          Get Started
        </Button>
      </Link>
    </div>
  );
}
