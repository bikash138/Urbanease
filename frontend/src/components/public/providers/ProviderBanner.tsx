import { Image } from "@imagekit/next";
import { getImageUrl } from "@/lib/imagekit-url-generator";
import { Users, Wrench } from "lucide-react";

export function ProviderBanner() {
  return (
    <div className="rounded-2xl p-4 sm:p-5 lg:p-6 flex flex-col gap-4 sm:gap-5">
      {/* Heading */}
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-zinc-900">
          Our Service Providers
        </h1>
        <p className="mt-1.5 text-sm text-zinc-500 leading-relaxed">
          Browse our network of verified, experienced professionals.
        </p>
      </div>

      {/* Image */}
      <div className="relative flex-1 rounded-xl bg-zinc-100 overflow-hidden min-h-40 sm:min-h-48 lg:min-h-52">
        <Image
          src={getImageUrl("public/provider-image1.webp", "banner")}
          alt="Service providers"
          fill
          className="object-cover"
        />
      </div>

      {/* Stats */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-100 flex-1 min-w-0">
          <Users className="w-4 h-4 text-zinc-400 shrink-0" />
          <span className="text-sm text-zinc-500 truncate">
            <span className="font-semibold text-zinc-800">5+</span> Verified
            Providers
          </span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-100 flex-1 min-w-0">
          <Wrench className="w-4 h-4 text-zinc-400 shrink-0" />
          <span className="text-sm text-zinc-500 truncate">
            <span className="font-semibold text-zinc-800">12+</span> Services
            Available
          </span>
        </div>
      </div>
    </div>
  );
}
