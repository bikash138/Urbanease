import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/tanstack-providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";
import { ImageKitProvider } from "@imagekit/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://urbanease.bikashshaw.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Urbanease — Your Urban Services Platform",
  description:
    "Book trusted home services at your fingertips. From cleaning to carpentry — verified professionals, transparent pricing, flexible slots.",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Urbanease",
    title: "Urbanease — Your Urban Services Platform",
    description:
      "Book trusted home services at your fingertips. From cleaning to carpentry — verified professionals, transparent pricing, flexible slots.",
    images: [
      {
        url: "/opengraph.png",
        width: 1200,
        height: 630,
        alt: "Urbanease — Urban Services Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Urbanease — Your Urban Services Platform",
    description:
      "Book trusted home services at your fingertips. Verified professionals, transparent pricing.",
    images: ["/opengraph.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <ImageKitProvider
            urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_BASE_URL!}
          >
            <div className="max-w-7xl mx-auto w-full min-h-screen">
              <Suspense
                fallback={
                  <div className="min-h-screen w-full flex items-center justify-center bg-zinc-50">
                    <div
                      className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900"
                      aria-hidden
                    />
                    <span className="sr-only">Loading…</span>
                  </div>
                }
              >
                {children}
              </Suspense>
            </div>
            <Toaster />
            <Analytics />
          </ImageKitProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
