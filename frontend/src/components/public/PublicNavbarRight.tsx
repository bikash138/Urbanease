"use client";

import PublicNavbarAuth from "@/components/public/PublicNavbarAuth";

/**
 * Auth UI is fully client-rendered after hydration so localStorage-backed
 * auth state never flashes guest CTAs for signed-in users.
 */
export function PublicNavbarRight() {
  return <PublicNavbarAuth />;
}
