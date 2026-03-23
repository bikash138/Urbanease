import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import QueryProvider from "@/components/tanstack-providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";
import { ImageKitProvider } from "@imagekit/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
            <div className="w-full min-h-screen">{children}</div>
            <Toaster />
            <Analytics />
            <SpeedInsights />
          </ImageKitProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
