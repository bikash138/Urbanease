"use client";

import Link from "next/link";
import { CheckCircle2, Calendar, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PublicSlot } from "@/types/public/public.types";

interface BookingSuccessOverlayProps {
  slot: PublicSlot;
  dateLabel: string;
  serviceName: string;
  onClose: () => void;
}

export function BookingSuccessOverlay({
  slot,
  dateLabel,
  serviceName,
  onClose,
}: BookingSuccessOverlayProps) {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        className="bg-white rounded-3xl p-10 max-w-sm w-full mx-4 text-center shadow-2xl"
        style={{ animation: "bookingSuccess 0.4s cubic-bezier(0.16,1,0.3,1)" }}
      >
        <style>{`
          @keyframes bookingSuccess {
            from { opacity: 0; transform: scale(0.85) translateY(16px); }
            to   { opacity: 1; transform: scale(1) translateY(0); }
          }
          @keyframes ringPulse {
            0%   { transform: scale(1); opacity: 0.4; }
            100% { transform: scale(1.8); opacity: 0; }
          }
        `}</style>

        <div className="relative flex items-center justify-center w-24 h-24 mx-auto mb-6">
          <div
            className="absolute inset-0 rounded-full bg-green-200"
            style={{ animation: "ringPulse 1.2s ease-out infinite" }}
          />
          <div className="relative w-24 h-24 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-zinc-900 mb-1">
          Booking Confirmed!
        </h2>
        <p className="text-sm text-zinc-500 mb-6">
          Your booking has been placed successfully.
        </p>

        <div className="bg-zinc-50 rounded-2xl p-4 space-y-3 text-left mb-6 border border-zinc-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-zinc-400">Service</p>
              <p className="text-sm font-semibold text-zinc-900 truncate">
                {serviceName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-zinc-400">Date</p>
              <p className="text-sm font-semibold text-zinc-900">{dateLabel}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-zinc-400">Time Slot</p>
              <p className="text-sm font-semibold text-zinc-900">
                {slot.startTime} – {slot.endTime}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Link href="/customer/bookings">
            <Button className="w-full bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl h-11">
              View My Bookings
            </Button>
          </Link>
          <Link href={"/"}>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-zinc-400 hover:text-zinc-600"
            >
              Book another service
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
