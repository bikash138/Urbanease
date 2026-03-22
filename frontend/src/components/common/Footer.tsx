import { Building2 } from "lucide-react";
import { socialLinks } from "@/data/socialLinks";
import { footerColumns } from "@/data/footerLinks";
import Link from "next/link";
import { Suspense } from "react";
import { FooterCopyrightYear } from "./FooterCopyrightYear";

export default function Footer() {
  return (
    <footer className="border-0 bg-white">
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-8 sm:pt-14 sm:pb-10">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
          <Link
            href="/"
            className="flex items-center gap-2.5 shrink-0 w-fit rounded-md outline-offset-2 focus-visible:outline-2 focus-visible:outline-zinc-400"
          >
            <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold text-zinc-900 tracking-tight">
              Urbanease
            </span>
          </Link>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-10 flex-1 lg:max-w-4xl">
            {footerColumns.map((col) => (
              <div key={col.title} className="min-w-0">
                <p className="text-sm font-semibold text-zinc-900 mb-3">
                  {col.title}
                </p>
                <ul className="space-y-2.5">
                  {col.links.map((item) => (
                    <li key={item.href + item.label}>
                      <Link
                        href={item.href}
                        className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="col-span-2 sm:col-span-1 min-w-0">
              <p className="text-sm font-semibold text-zinc-900 mb-3">
                Social links
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {socialLinks.map(({ label, href, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-zinc-200/80">
          <p className="text-xs text-zinc-500 leading-relaxed max-w-4xl">
            Urbanease connects customers with verified service professionals.
            Service availability and pricing may vary by location.
          </p>
          <p className="mt-4 text-xs text-zinc-500 leading-relaxed">
            ©{" "}
            <Suspense fallback={<span className="tabular-nums">…</span>}>
              <FooterCopyrightYear />
            </Suspense>{" "}
            Urbanease. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
