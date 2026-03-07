"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Star,
  Home,
  Zap,
  Sparkles,
  CheckCircle2,
  BadgeCheck,
  MapPin,
  CalendarCheck,
} from "lucide-react";
import type { PublicCategory } from "@/types/public/public.types";

const stats = [
  { value: "500+", label: "Verified Providers", icon: BadgeCheck },
  { value: "50+", label: "Service Categories", icon: Sparkles },
  { value: "20+", label: "Cities Covered", icon: MapPin },
  { value: "10K+", label: "Happy Customers", icon: CalendarCheck },
];

interface HeroSectionProps {
  isLoadingCategories: boolean;
  displayCategories: PublicCategory[];
}

export default function HeroSection({
  isLoadingCategories,
  displayCategories,
}: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden bg-linear-to-br from-zinc-950 via-zinc-900 to-slate-900">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-amber-400/10 blur-3xl" />
          <div className="absolute top-1/2 -left-40 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-64 h-64 rounded-full bg-purple-500/8 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center w-full">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs text-zinc-300 font-medium">
                Your Urban Services Platform
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight">
              Your City.
              <br />
              Your Services.
              <br />
              <span className="text-amber-400">Simplified.</span>
            </h1>

            <p className="text-lg text-zinc-400 max-w-md leading-relaxed">
              Book trusted home services at your fingertips. From cleaning to
              carpentry — verified professionals, transparent pricing, flexible
              slots.
            </p>

            <div className="flex gap-2 bg-white rounded-xl p-1.5 shadow-2xl max-w-lg">
              <div className="flex-1 flex items-center gap-2 px-3">
                <Search className="w-4 h-4 text-zinc-400 shrink-0" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for a service..."
                  className="border-0 shadow-none focus-visible:ring-0 text-zinc-900 placeholder:text-zinc-400 h-10 p-0 bg-transparent"
                />
              </div>
              <Link
                href={`/categories${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ""}`}
              >
                <Button className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg px-5 h-10">
                  Search
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap gap-2">
              {isLoadingCategories
                ? Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-7 w-20 rounded-full" />
                  ))
                : displayCategories.slice(0, 5).map((cat) => (
                    <Link key={cat.id} href={`/categories/${cat.slug}`}>
                      <button className="text-xs text-zinc-400 bg-white/10 border border-white/15 rounded-full px-3 py-1 hover:bg-white/20 transition-colors cursor-pointer">
                        {cat.name}
                      </button>
                    </Link>
                  ))}
            </div>
          </div>

          {/* Right: Floating UI cards */}
          <div className="hidden lg:block relative h-[480px]">
            <div className="absolute top-6 left-6 right-6 bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400/20 flex items-center justify-center shrink-0">
                  <Home className="w-5 h-5 text-amber-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-white font-medium text-sm">
                    Home Deep Cleaning
                  </p>
                  <p className="text-zinc-400 text-xs">Home Cleaning</p>
                </div>
                <div className="ml-auto text-right shrink-0">
                  <p className="text-white font-semibold text-sm">₹799</p>
                  <div className="flex items-center gap-1 justify-end">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-zinc-400 text-xs">4.8</span>
                  </div>
                </div>
              </div>
              <Separator className="bg-white/10" />
              <div className="flex gap-2">
                {["Morning", "Afternoon"].map((slot) => (
                  <span
                    key={slot}
                    className="text-xs text-zinc-300 bg-white/10 rounded-md px-2.5 py-1"
                  >
                    {slot}
                  </span>
                ))}
              </div>
            </div>

            <div className="absolute top-48 right-2 w-52 bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-4 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-blue-400/20 flex items-center justify-center">
                <Zap className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-white font-medium text-sm">
                Electrical Fitting
              </p>
              <p className="text-zinc-400 text-xs">From ₹599</p>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                ))}
              </div>
            </div>

            <div className="absolute bottom-20 left-4 bg-green-500/20 border border-green-500/30 rounded-xl px-4 py-3 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
              <div>
                <p className="text-white text-xs font-medium">
                  Booking Confirmed!
                </p>
                <p className="text-zinc-400 text-xs">Today at 10:00 AM</p>
              </div>
            </div>

            <div className="absolute bottom-8 right-4 bg-white/10 border border-white/15 rounded-xl px-4 py-3">
              <p className="text-2xl font-bold text-white">10K+</p>
              <p className="text-zinc-400 text-xs">Happy Customers</p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 72"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full block"
          >
            <path
              d="M0,36 C480,72 960,0 1440,36 L1440,72 L0,72 Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label} className="text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center mx-auto">
                  <Icon className="w-5 h-5 text-zinc-700" />
                </div>
                <p className="text-3xl font-bold text-zinc-900">{value}</p>
                <p className="text-sm text-zinc-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Separator />
    </>
  );
}
