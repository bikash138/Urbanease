import type { Metadata } from "next";
import PublicNavbar from "@/components/public/PublicNavbar";
import CTABanner from "@/components/common/CTABanner";
import Footer from "@/components/common/Footer";
import { AboutContent } from "@/components/public/about/AboutContent";

export const metadata: Metadata = {
  title: "About — Urbanease",
  description:
    "Learn about Urbanease—connecting homeowners and urban residents with trusted service professionals.",
  openGraph: {
    title: "About — Urbanease",
    description:
      "Learn about Urbanease—connecting homeowners and urban residents with trusted service professionals.",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <PublicNavbar />

      <main className="pt-16">
        <AboutContent />
      </main>

      <CTABanner />
      <Footer />
    </div>
  );
}
