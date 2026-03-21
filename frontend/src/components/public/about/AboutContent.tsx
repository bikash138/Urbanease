import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  HeartHandshake,
  MapPin,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function AboutContent() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-zinc-200/80 bg-linear-to-b from-zinc-100/90 via-zinc-50 to-zinc-50">
        <div
          className="pointer-events-none absolute -right-24 top-0 h-96 w-96 rounded-full bg-amber-200/25 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-teal-200/20 blur-3xl"
          aria-hidden
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            About Urbanease
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl sm:text-5xl font-bold text-zinc-900 tracking-tight leading-[1.1]">
            Home and urban services, without the runaround.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-zinc-600 leading-relaxed">
            We connect people who need work done with trusted professionals who
            show up on time, communicate clearly, and take pride in their craft.
            Urbanease is built for real life in your city—simple booking, clear
            pricing, and support when you need it.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
              Why we started
            </h2>
            <p className="mt-4 text-zinc-600 leading-relaxed">
              Finding reliable help for your home shouldn&apos;t mean endless
              calls, vague quotes, or no-shows. Urbanease brings categories,
              providers, and booking into one place so you can compare, choose,
              and move on with your day.
            </p>
            <p className="mt-4 text-zinc-600 leading-relaxed">
              For professionals, we offer a fair way to grow: reach customers
              who are ready to book, keep your profile and services organized,
              and focus on the work you do best.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-sm">
            <blockquote className="text-zinc-700 leading-relaxed">
              <span className="text-4xl font-serif text-zinc-300 leading-none">
                &ldquo;
              </span>
              We believe great service starts with respect—respect for your
              time, your space, and the trust you place in us when you invite
              someone through your door.
            </blockquote>
            <p className="mt-6 text-sm font-medium text-zinc-900">
              — The Urbanease team
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
            What guides us
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-zinc-600">
            Principles we hold ourselves to—whether you&apos;re booking a visit
            or building your business on the platform.
          </p>

          <ul className="mt-12 grid gap-6 sm:grid-cols-3">
            <li className="rounded-2xl border border-zinc-200 bg-zinc-50/80 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-900 text-white">
                <BadgeCheck className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="mt-4 font-semibold text-zinc-900">Trust first</h3>
              <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
                Verified profiles, honest listings, and clear expectations so
                you know what you&apos;re getting before you book.
              </p>
            </li>
            <li className="rounded-2xl border border-zinc-200 bg-zinc-50/80 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-900 text-white">
                <Sparkles className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="mt-4 font-semibold text-zinc-900">
                Quality that lasts
              </h3>
              <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
                We spotlight professionals who deliver workmanship and service
                you&apos;d recommend to a neighbor.
              </p>
            </li>
            <li className="rounded-2xl border border-zinc-200 bg-zinc-50/80 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-900 text-white">
                <MapPin className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="mt-4 font-semibold text-zinc-900">Local at heart</h3>
              <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
                Built for urban homes and busy lives—find help near you, on
                your schedule.
              </p>
            </li>
          </ul>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="flex flex-col items-center rounded-2xl border border-zinc-200 bg-linear-to-br from-zinc-900 to-zinc-800 px-6 py-12 sm:px-12 sm:py-14 text-center">
          <HeartHandshake className="h-10 w-10 text-amber-200/90" aria-hidden />
          <h2 className="mt-6 text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Ready to explore?
          </h2>
          <p className="mt-3 max-w-lg text-zinc-300 leading-relaxed">
            Browse categories, meet providers, or sign up to offer your services
            on Urbanease.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button
              asChild
              className="bg-white text-zinc-900 hover:bg-zinc-100 rounded-xl px-6"
            >
              <Link href="/categories">
                View categories
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-zinc-500 bg-transparent text-white hover:bg-white/10 rounded-xl px-6"
            >
              <Link href="/providers">Meet providers</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
