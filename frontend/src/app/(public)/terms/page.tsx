import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & conditions — Urbanease",
  description: "Terms and conditions for using Urbanease.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="pt-24 pb-16 max-w-3xl mx-auto px-6">
        <h1 className="text-2xl font-bold text-zinc-900">Terms & conditions</h1>
        <p className="mt-4 text-zinc-600 text-sm leading-relaxed">
          This page will include the full terms of use for Urbanease. For
          questions, please{" "}
          <Link href="/contact" className="text-amber-700 hover:underline">
            contact us
          </Link>
          .
        </p>
      </main>
    </div>
  );
}
