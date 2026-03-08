"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface AuthBrandProps {
  icon: LucideIcon;
  subtitle: string;
}

export function AuthBrand({ icon: Icon, subtitle }: AuthBrandProps) {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-zinc-900 mb-4 shadow-lg shadow-zinc-900/20">
        <Icon className="w-7 h-7 text-white" />
      </div>
      <Link href="/">
        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">
          Urbanease
        </h1>
      </Link>
      <p className="text-zinc-500 text-sm mt-1">{subtitle}</p>
    </div>
  );
}
