import { Building2 } from "lucide-react";

export function ProviderDetailFooter() {
  return (
    <footer className="bg-white border-t border-zinc-200 py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-zinc-200 flex items-center justify-center">
              <Building2 className="w-3.5 h-3.5 text-zinc-700" />
            </div>
            <span className="text-zinc-900 font-semibold">Urbanease</span>
          </div>
          <p className="text-zinc-600 text-sm">
            © 2026 Urbanease. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy", "Terms", "Support"].map((item) => (
              <span
                key={item}
                className="text-zinc-600 text-sm hover:text-zinc-900 cursor-pointer transition-colors"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
