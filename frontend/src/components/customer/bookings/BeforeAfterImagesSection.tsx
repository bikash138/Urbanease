"use client";

import { Image } from "@imagekit/next";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

interface BeforeAfterImagesSectionProps {
  images?: { id: string; url: string; type: "BEFORE" | "AFTER" }[];
}

export function BeforeAfterImagesSection({ images = [] }: BeforeAfterImagesSectionProps) {
  const beforeImage = images.find((img) => img.type === "BEFORE");
  const afterImage = images.find((img) => img.type === "AFTER");

  if (!beforeImage && !afterImage) return null;

  return (
    <>
      <Separator />
      <div className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Service Photos
        </p>
        <div className="grid grid-cols-2 gap-3">
          {beforeImage && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Before</p>
              <a
                href={beforeImage.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg overflow-hidden border border-border aspect-video bg-muted/50 hover:opacity-90 transition-opacity relative"
              >
                <Image
                  src={beforeImage.url || "/error-placeholder-image.webp"}
                  alt="Before service"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 250px"
                />
              </a>
            </div>
          )}
          {afterImage && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">After</p>
              <Link
                href={afterImage.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg overflow-hidden border border-border aspect-video bg-muted/50 hover:opacity-90 transition-opacity relative"
              >
                <Image
                  src={afterImage.url || "/error-placeholder-image.webp"}
                  alt="After service"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 250px"
                />
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
