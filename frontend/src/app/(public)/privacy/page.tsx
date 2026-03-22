import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy policy — Urbanease",
  description: "How Urbanease handles your data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="pt-24 pb-16 max-w-3xl mx-auto px-6">
        <h1 className="text-2xl font-bold text-zinc-900">Privacy policy</h1>
        <p className="mt-4 text-zinc-600 text-sm leading-relaxed">
          This page will describe how we collect, use, and protect your
          information. For questions, please{" "}
          <Link href="/contact" className="text-amber-700 hover:underline">
            contact us
          </Link>
          .
        </p>
      </main>
    </div>
  );
}
