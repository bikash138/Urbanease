import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact us — Urbanease",
  description: "Reach the Urbanease team.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="pt-24 pb-16 max-w-3xl mx-auto px-6">
        <h1 className="text-2xl font-bold text-zinc-900">Contact us</h1>
        <p className="mt-4 text-zinc-600 text-sm leading-relaxed">
          For support and partnerships, email us at{" "}
          <a
            href="mailto:support@urbanease.in"
            className="text-amber-700 hover:underline font-medium"
          >
            support@urbanease.in
          </a>
          .
        </p>
      </main>
    </div>
  );
}
