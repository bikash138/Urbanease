"use client";

import {
  CalendarDays,
  ChevronDown,
  User,
  Phone,
  MapPin,
  IndianRupee,
  MessageSquare,
} from "lucide-react";
import type { BookingListItem } from "@/types/provider/provider-booking.types";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { STATUS_CONFIG } from "./constants";
import { formatDate } from "./utils";
import { ProviderReviewSection } from "./ProviderReviewSection";

interface BookingHistoryCollapsibleProps {
  booking: BookingListItem;
  onFlag: (reviewId: string) => void;
  isFlagging: boolean;
}

export function BookingHistoryCollapsible({
  booking,
  onFlag,
  isFlagging,
}: BookingHistoryCollapsibleProps) {
  const s = STATUS_CONFIG[booking.status];

  return (
    <Collapsible className="border border-border/60 rounded-xl overflow-hidden">
      <CollapsibleTrigger asChild>
        <button
          type="button"
          className="w-full flex items-center gap-3 px-4 py-3 text-left bg-white hover:bg-slate-50/80 dark:hover:bg-slate-900/50 transition-colors group"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <CalendarDays className="size-4" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-foreground truncate">
                {booking.providerService.service.title}
              </span>
              <Badge
                variant="secondary"
                className={cn("text-xs font-medium border shrink-0", s.className)}
              >
                {s.label}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground truncate mt-0.5 flex items-center gap-1">
              <User className="size-3 shrink-0" />
              {booking.customer.user.name} · {formatDate(booking.date)}
            </p>
          </div>

          <ChevronDown className="size-4 text-muted-foreground shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </button>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <Separator />
        <div className="bg-muted/30 px-4 py-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="size-3.5 shrink-0 text-muted-foreground/70" />
              <span className="font-medium text-foreground truncate">
                {booking.customer.user.name}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <IndianRupee className="size-3.5 shrink-0 text-emerald-600" />
              <span className="font-semibold text-foreground">
                {booking.totalAmount.toFixed(2)}
              </span>
            </div>

            {booking.customer.user.phone && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="size-3.5 shrink-0 text-muted-foreground/70" />
                <span>{booking.customer.user.phone}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="size-3.5 shrink-0 text-muted-foreground/70" />
              <span className="truncate">
                {booking.address.city}, {booking.address.state}
              </span>
            </div>
          </div>

          {booking.customerNote && (
            <div className="flex items-start gap-2 text-sm bg-muted/50 rounded-lg px-3 py-2">
              <MessageSquare className="size-3.5 shrink-0 mt-0.5 text-muted-foreground/70" />
              <span className="text-muted-foreground leading-relaxed">
                {booking.customerNote}
              </span>
            </div>
          )}

          <ProviderReviewSection
            booking={booking}
            onFlag={onFlag}
            isFlagging={isFlagging}
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
