import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Careers — Urbanease",
  description: "Careers at Urbanease.",
};

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="pt-24 pb-16 max-w-3xl mx-auto px-6">
        <h1 className="text-2xl font-bold text-zinc-900">Careers</h1>
        <p className="mt-4 text-zinc-600 text-sm leading-relaxed">
          We are not hiring for listed roles yet. Check back soon or{" "}
          <Link href="/contact" className="text-amber-700 hover:underline">
            get in touch
          </Link>
          .
        </p>
      </main>
    </div>
  );
}
