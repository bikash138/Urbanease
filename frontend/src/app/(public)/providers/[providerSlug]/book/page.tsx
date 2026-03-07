"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  AlertCircle,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Home,
  IndianRupee,
  MapPin,
  Moon,
  Sparkles,
  Sun,
  Sunset,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  usePublicProviderDetail,
  usePublicProviderSlots,
} from "@/hooks/public/usePublic";
import { useCustomerAddresses } from "@/hooks/customer/useCustomerAddress";
import { useCreateBooking } from "@/hooks/customer/useCustomerBooking";
import { useAuthStore } from "@/store/auth.store";
import type { SlotLabel, PublicSlot } from "@/types/public/public.types";
import type { CustomerAddress } from "@/types/customer/customer-profile.types";
import PublicNavbar from "@/components/public/PublicNavbar";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function buildDateOptions(): { label: string; value: string }[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Array.from({ length: 3 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i + 1);
    const label =
      i === 0
        ? "Tomorrow"
        : d.toLocaleDateString("en-IN", {
            weekday: "long",
            month: "short",
            day: "numeric",
          });
    return { label, value: formatDate(d) };
  });
}

const ADDRESS_ICON: Record<
  "HOME" | "WORK" | "OTHER",
  { label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  HOME: { label: "Home", icon: Home },
  WORK: { label: "Work", icon: Briefcase },
  OTHER: { label: "Other", icon: MapPin },
};

const SLOT_META: Record<
  SlotLabel,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }
> = {
  MORNING: {
    label: "Morning",
    icon: Sun,
    color: "bg-amber-50 text-amber-700 border-amber-200",
  },
  AFTERNOON: {
    label: "Afternoon",
    icon: Sunset,
    color: "bg-sky-50 text-sky-700 border-sky-200",
  },
  NIGHT: {
    label: "Evening",
    icon: Moon,
    color: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
};

// ─── Success Overlay ──────────────────────────────────────────────────────────

function SuccessOverlay({
  slot,
  dateLabel,
  serviceName,
  onClose,
}: {
  slot: PublicSlot;
  dateLabel: string;
  serviceName: string;
  onClose: () => void;
}) {
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

        {/* Animated checkmark */}
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
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600"
          >
            Book another service
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BookingPage({
  params,
}: {
  params: Promise<{ providerSlug: string }>;
}) {
  const { providerSlug } = use(params);
  const router = useRouter();
  const { isAuthenticated, role } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && (!isAuthenticated || role !== "CUSTOMER")) {
      router.push("/auth/signin");
    }
  }, [mounted, isAuthenticated, role, router]);

  const { data: provider, isLoading: isLoadingProvider } =
    usePublicProviderDetail(providerSlug);
  const { data: addresses, isLoading: isLoadingAddresses } =
    useCustomerAddresses();

  type ServiceEntry = {
    id: string;
    slug: string;
    price: number;
    title: string;
  };

  const [selectedService, setSelectedService] = useState<ServiceEntry | null>(
    null,
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<PublicSlot | null>(null);
  const [selectedAddress, setSelectedAddress] =
    useState<CustomerAddress | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<{
    slot: PublicSlot;
    dateLabel: string;
    serviceName: string;
  } | null>(null);

  const dateOptions = useMemo(() => buildDateOptions(), []);

  const {
    data: slots,
    isLoading: isLoadingSlots,
    error: slotsError,
  } = usePublicProviderSlots(
    providerSlug,
    selectedService?.slug ?? null,
    selectedDate,
  );

  const slotsByLabel = useMemo(() => {
    const map = new Map<SlotLabel, typeof slots>([
      ["MORNING", []],
      ["AFTERNOON", []],
      ["NIGHT", []],
    ]);
    (slots ?? []).forEach((s) => map.get(s.label)?.push(s));
    return map;
  }, [slots]);

  // Reset slot when service or date changes
  useEffect(() => {
    setSelectedSlot(null);
  }, [selectedService, selectedDate]);

  // Pre-select default address
  useEffect(() => {
    if (addresses && addresses.length > 0 && !selectedAddress) {
      setSelectedAddress(addresses.find((a) => a.isDefault) ?? addresses[0]);
    }
  }, [addresses, selectedAddress]);

  const { mutate: createBooking, isPending } = useCreateBooking();

  function handleBook() {
    if (!selectedService || !selectedDate || !selectedSlot || !selectedAddress)
      return;
    createBooking(
      {
        providerServiceId: selectedService.id,
        addressId: selectedAddress.id,
        slotId: selectedSlot.id,
        date: selectedDate,
        totalAmount: selectedService.price,
      },
      {
        onSuccess: () => {
          setBookingSuccess({
            slot: selectedSlot,
            dateLabel:
              dateOptions.find((d) => d.value === selectedDate)?.label ??
              selectedDate,
            serviceName: selectedService.title,
          });
        },
      },
    );
  }

  const canBook = !!(
    selectedService &&
    selectedDate &&
    selectedSlot &&
    selectedAddress
  );

  const missingStep = !selectedService
    ? "Select a service to continue"
    : !selectedDate
      ? "Select a date to continue"
      : !selectedSlot
        ? "Pick a time slot to continue"
        : !selectedAddress
          ? "Select a service address to continue"
          : null;

  if (!mounted || !isAuthenticated || role !== "CUSTOMER") return null;

  if (isLoadingProvider) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <PublicNavbar />
        <div className="pt-28 max-w-5xl mx-auto px-6 space-y-4">
          <Skeleton className="h-6 w-56" />
          <div className="grid lg:grid-cols-[1fr_340px] gap-6">
            <div className="space-y-4">
              <Skeleton className="h-48 rounded-2xl" />
              <Skeleton className="h-32 rounded-2xl" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-48 rounded-2xl" />
              <Skeleton className="h-48 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <PublicNavbar />
        <div className="pt-28 flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <AlertCircle className="w-10 h-10 text-zinc-400" />
          <p className="font-semibold text-zinc-700">Provider not found</p>
          <Link href="/providers">
            <Button variant="outline" size="sm">
              Browse Providers
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <PublicNavbar />

      {bookingSuccess && (
        <SuccessOverlay
          slot={bookingSuccess.slot}
          dateLabel={bookingSuccess.dateLabel}
          serviceName={bookingSuccess.serviceName}
          onClose={() => {
            setBookingSuccess(null);
            setSelectedSlot(null);
            setSelectedDate(null);
          }}
        />
      )}

      <div className="pt-24 pb-16 max-w-5xl mx-auto px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-sm text-zinc-500 mb-6">
          <Link href="/" className="hover:text-zinc-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link
            href="/providers"
            className="hover:text-zinc-900 transition-colors"
          >
            Providers
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link
            href={`/providers/${providerSlug}`}
            className="hover:text-zinc-900 transition-colors"
          >
            {provider.user.name}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-zinc-900 font-medium">Book</span>
        </div>

        {/* Title */}
        <div className="flex items-center gap-4 mb-8">
          <Link href={`/providers/${providerSlug}`}>
            <Button
              variant="outline"
              size="icon"
              className="rounded-xl shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">
              Book a Service
            </h1>
            <p className="text-sm text-zinc-500 mt-0.5">
              with {provider.user.name}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_340px] gap-6 items-start">
          {/* ── LEFT COLUMN ──────────────────────────────────────────────────── */}
          <div className="space-y-5">
            {/* Step 1 — Service */}
            <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-4">
              <h2 className="font-semibold text-zinc-900 flex items-center gap-2.5 text-sm">
                <span className="w-6 h-6 rounded-full bg-zinc-900 text-white text-xs flex items-center justify-center font-bold shrink-0">
                  1
                </span>
                Select a Service
              </h2>
              {provider.servicesOffered.length === 0 ? (
                <p className="text-sm text-zinc-400 italic">
                  No services listed by this provider.
                </p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {provider.servicesOffered.map((entry) => {
                    const price =
                      entry.customPrice ?? entry.service.basePrice;
                    const isSelected = selectedService?.id === entry.id;
                    return (
                      <button
                        key={entry.id}
                        onClick={() =>
                          setSelectedService({
                            id: entry.id,
                            slug: entry.service.slug,
                            price,
                            title: entry.service.title,
                          })
                        }
                        className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all duration-150 ${
                          isSelected
                            ? "border-zinc-900 bg-zinc-900 text-white"
                            : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-400 hover:bg-white"
                        }`}
                      >
                        <p className="font-semibold text-sm truncate">
                          {entry.service.title}
                        </p>
                        <div
                          className={`flex items-center gap-0.5 mt-1 text-xs ${isSelected ? "text-zinc-300" : "text-zinc-400"}`}
                        >
                          <IndianRupee className="w-3 h-3" />
                          {price.toLocaleString("en-IN")}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Step 2 — Date */}
            <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-4">
              <h2 className="font-semibold text-zinc-900 flex items-center gap-2.5 text-sm">
                <span className="w-6 h-6 rounded-full bg-zinc-900 text-white text-xs flex items-center justify-center font-bold shrink-0">
                  2
                </span>
                Choose a Date
              </h2>
              <div className="grid grid-cols-3 gap-2.5">
                {dateOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSelectedDate(opt.value)}
                    className={`px-3 py-3.5 rounded-xl border text-sm font-medium transition-all duration-150 ${
                      selectedDate === opt.value
                        ? "border-zinc-900 bg-zinc-900 text-white"
                        : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-400 hover:bg-white"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3 — Slot */}
            {selectedService && selectedDate && (
              <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-4">
                <h2 className="font-semibold text-zinc-900 flex items-center gap-2.5 text-sm">
                  <span className="w-6 h-6 rounded-full bg-zinc-900 text-white text-xs flex items-center justify-center font-bold shrink-0">
                    3
                  </span>
                  Pick a Time Slot
                </h2>

                {isLoadingSlots ? (
                  <div className="grid grid-cols-3 gap-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton key={i} className="h-16 rounded-xl" />
                    ))}
                  </div>
                ) : slotsError ? (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Unable to load slots. Try a different date.</span>
                  </div>
                ) : (slots ?? []).length === 0 ? (
                  <div className="py-10 text-center space-y-2">
                    <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center mx-auto">
                      <Clock className="w-5 h-5 text-zinc-400" />
                    </div>
                    <p className="text-sm font-medium text-zinc-700">
                      No slots available
                    </p>
                    <p className="text-xs text-zinc-400">
                      Try a different date or service.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {(["MORNING", "AFTERNOON", "NIGHT"] as SlotLabel[]).map(
                      (label) => {
                        const labelSlots = slotsByLabel.get(label) ?? [];
                        if (labelSlots.length === 0) return null;
                        const { label: labelText, icon: Icon, color } =
                          SLOT_META[label];
                        return (
                          <div key={label} className="space-y-2.5">
                            <div
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${color}`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                              {labelText}
                            </div>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                              {labelSlots.map((slot) => {
                                const isSelected =
                                  selectedSlot?.id === slot.id;
                                return (
                                  <button
                                    key={slot.id}
                                    onClick={() => setSelectedSlot(slot)}
                                    className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl border transition-all duration-150 ${
                                      isSelected
                                        ? "border-zinc-900 bg-zinc-900"
                                        : "border-zinc-200 bg-zinc-50 hover:border-zinc-400 hover:bg-white"
                                    }`}
                                  >
                                    <span
                                      className={`text-sm font-semibold ${isSelected ? "text-white" : "text-zinc-900"}`}
                                    >
                                      {slot.startTime}
                                    </span>
                                    <span
                                      className={`text-xs mt-0.5 ${isSelected ? "text-zinc-300" : "text-zinc-400"}`}
                                    >
                                      {slot.endTime}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── RIGHT COLUMN ─────────────────────────────────────────────────── */}
          <div className="space-y-5 lg:sticky lg:top-24">
            {/* Address */}
            <div className="bg-white rounded-2xl border border-zinc-200 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-zinc-900 text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-zinc-400" />
                  Service Address
                </h2>
                <Link
                  href="/customer/profile"
                  className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors"
                >
                  Manage
                </Link>
              </div>

              {isLoadingAddresses ? (
                <div className="space-y-2">
                  <Skeleton className="h-16 w-full rounded-xl" />
                  <Skeleton className="h-16 w-full rounded-xl" />
                </div>
              ) : !addresses || addresses.length === 0 ? (
                <div className="py-6 text-center space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center mx-auto">
                    <MapPin className="w-5 h-5 text-zinc-400" />
                  </div>
                  <p className="text-xs text-zinc-500">No saved addresses</p>
                  <Link href="/customer/profile">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg text-xs"
                    >
                      Add Address
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {addresses.map((addr) => {
                    const { label, icon: Icon } = ADDRESS_ICON[addr.label];
                    const isSelected = selectedAddress?.id === addr.id;
                    return (
                      <button
                        key={addr.id}
                        onClick={() => setSelectedAddress(addr)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all duration-150 ${
                          isSelected
                            ? "border-zinc-900 bg-zinc-900"
                            : "border-zinc-200 bg-zinc-50 hover:border-zinc-400 hover:bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Icon
                            className={`w-3.5 h-3.5 ${isSelected ? "text-zinc-300" : "text-zinc-500"}`}
                          />
                          <span
                            className={`text-xs font-semibold ${isSelected ? "text-zinc-200" : "text-zinc-700"}`}
                          >
                            {label}
                          </span>
                          {addr.isDefault && (
                            <span
                              className={`text-xs px-1.5 py-0.5 rounded-full ${isSelected ? "bg-white/15 text-zinc-300" : "bg-zinc-100 text-zinc-500"}`}
                            >
                              Default
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-xs leading-relaxed ${isSelected ? "text-zinc-400" : "text-zinc-500"}`}
                        >
                          {addr.street}, {addr.city}, {addr.state} –{" "}
                          {addr.pincode}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl border border-zinc-200 p-5 space-y-4">
              <h2 className="font-semibold text-zinc-900 text-sm">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-zinc-500 shrink-0">Service</span>
                  <span className="font-medium text-zinc-900 text-right truncate max-w-[160px]">
                    {selectedService?.title ?? (
                      <span className="text-zinc-300">—</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-zinc-500 shrink-0">Date</span>
                  <span className="font-medium text-zinc-900">
                    {selectedDate ? (
                      dateOptions.find((d) => d.value === selectedDate)
                        ?.label ?? selectedDate
                    ) : (
                      <span className="text-zinc-300">—</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-zinc-500 shrink-0">Time Slot</span>
                  <span className="font-medium text-zinc-900">
                    {selectedSlot ? (
                      `${selectedSlot.startTime} – ${selectedSlot.endTime}`
                    ) : (
                      <span className="text-zinc-300">—</span>
                    )}
                  </span>
                </div>

                <div className="h-px bg-zinc-100" />

                <div className="flex justify-between items-center">
                  <span className="font-semibold text-zinc-900">Total</span>
                  <div className="flex items-center gap-0.5">
                    <IndianRupee className="w-4 h-4 text-zinc-900" />
                    <span className="text-xl font-bold text-zinc-900">
                      {selectedService
                        ? selectedService.price.toLocaleString("en-IN")
                        : "0"}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleBook}
                disabled={!canBook || isPending}
                className="w-full bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 text-white rounded-xl h-11 font-semibold text-sm"
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Confirming…
                  </span>
                ) : (
                  "Book Now"
                )}
              </Button>

              {missingStep && (
                <p className="text-xs text-zinc-400 text-center">
                  {missingStep}
                </p>
              )}
            </div>

            {/* Provider card */}
            <div className="bg-white rounded-2xl border border-zinc-200 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-white font-bold text-sm shrink-0">
                {provider.user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-zinc-900 text-sm truncate">
                  {provider.user.name}
                </p>
                {provider.experience !== null && (
                  <p className="text-xs text-zinc-400">
                    {provider.experience}{" "}
                    {provider.experience === 1 ? "year" : "years"} experience
                  </p>
                )}
              </div>
              <Building2 className="w-4 h-4 text-zinc-300 ml-auto shrink-0" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
