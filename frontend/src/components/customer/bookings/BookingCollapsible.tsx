"use client";

import { CalendarDays, ChevronDown } from "lucide-react";

import type { CustomerBookingListItem } from "@/types/customer/customer-booking.types";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

import { formatDate, STATUS_CONFIG } from "./constants";
import { BookingCardContent } from "./BookingCard";
import { BeforeAfterImagesSection } from "./BeforeAfterImagesSection";
import { ReviewSection } from "./ReviewSection";

interface BookingCollapsibleProps {
  booking: CustomerBookingListItem;
}

export function BookingCollapsible({ booking }: BookingCollapsibleProps) {
  const s = STATUS_CONFIG[booking.status];

  return (
    <Collapsible className="border border-border/60 rounded-xl overflow-hidden">
      <CollapsibleTrigger asChild>
        <button
          type="button"
          className="w-full flex items-center gap-3 px-4 py-3 text-left bg-white hover:bg-slate-50/80 transition-colors group"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <CalendarDays className="size-4" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-slate-800 truncate">
                {booking.providerService.service.title}
              </span>
              <Badge
                variant="secondary"
                className={cn("text-xs font-medium border shrink-0", s.className)}
              >
                {s.label}
              </Badge>
            </div>
            <p className="text-xs text-slate-400 truncate mt-0.5">
              {formatDate(booking.date)} · {booking.providerService.provider.user.name}
            </p>
          </div>

          <ChevronDown className="size-4 text-slate-400 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </button>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <Separator />
        <div className="bg-slate-50/60 px-4 py-4 space-y-4">
          <BookingCardContent booking={booking} />
          <BeforeAfterImagesSection images={booking.images ?? []} />
          <ReviewSection key={`${booking.id}-${booking.review?.id ?? "new"}`} booking={booking} />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
