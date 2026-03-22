"use client";

import { use, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import {
  BookingSuccessOverlay,
  BookingPageHeader,
  ServiceSelector,
  DateSelector,
  SlotSelector,
  AddressSelector,
  OrderSummary,
  BookingProviderCard,
  BookingPageSkeleton,
  BookingNotFound,
  buildDateOptions,
  type ServiceEntry,
} from "@/components/public/providers/book";

export default function BookingPage({
  params,
}: {
  params: Promise<{ providerSlug: string }>;
}) {
  const { providerSlug } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceSlugFromUrl = searchParams.get("service");
  const { isAuthenticated, role } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  useEffect(() => {
    if (mounted && (!isAuthenticated || role !== "CUSTOMER")) {
      const bookPath = serviceSlugFromUrl
        ? `/providers/${providerSlug}/book?service=${encodeURIComponent(serviceSlugFromUrl)}`
        : `/providers/${providerSlug}/book`;
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(bookPath)}`);
    }
  }, [
    mounted,
    isAuthenticated,
    role,
    router,
    providerSlug,
    serviceSlugFromUrl,
  ]);

  const { data: provider, isLoading: isLoadingProvider } =
    usePublicProviderDetail(providerSlug);
  const { data: addresses, isLoading: isLoadingAddresses } =
    useCustomerAddresses();

  const serviceFromUrl = useMemo(() => {
    if (!provider || !serviceSlugFromUrl) return null;
    const match = provider.servicesOffered.find(
      (e) => e.service.slug === serviceSlugFromUrl,
    );
    return match
      ? {
          id: match.id,
          slug: match.service.slug,
          price: match.customPrice ?? match.service.basePrice,
          title: match.service.title,
        }
      : null;
  }, [provider, serviceSlugFromUrl]);
  const [userSelectedService, setUserSelectedService] =
    useState<ServiceEntry | null>(null);
  const selectedService = userSelectedService ?? serviceFromUrl;

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<PublicSlot | null>(null);

  const defaultAddress = useMemo(
    () =>
      addresses && addresses.length > 0
        ? (addresses.find((a) => a.isDefault) ?? addresses[0])
        : null,
    [addresses],
  );
  const [userSelectedAddress, setUserSelectedAddress] =
    useState<CustomerAddress | null>(null);
  const selectedAddress = userSelectedAddress ?? defaultAddress;
  const [customerNote, setCustomerNote] = useState("");
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
  } = usePublicProviderSlots(providerSlug, selectedDate, selectedService?.id);

  const slotsByLabel = useMemo(() => {
    const map = new Map<SlotLabel, PublicSlot[]>([
      ["MORNING", []],
      ["AFTERNOON", []],
      ["NIGHT", []],
    ]);
    (slots ?? []).forEach((s) => map.get(s.label)?.push(s));
    return map;
  }, [slots]);

  const effectiveSelectedSlot =
    selectedSlot && slots?.some((s) => s.id === selectedSlot.id)
      ? selectedSlot
      : null;

  const { mutate: createBooking, isPending } = useCreateBooking();

  function handleBook() {
    if (
      !selectedService ||
      !selectedDate ||
      !effectiveSelectedSlot ||
      !selectedAddress
    )
      return;
    createBooking(
      {
        providerServiceId: selectedService.id,
        addressId: selectedAddress.id,
        slotId: effectiveSelectedSlot.id,
        date: selectedDate,
        totalAmount: selectedService.price,
        ...(customerNote.trim() && { customerNote: customerNote.trim() }),
      },
      {
        onSuccess: () => {
          setBookingSuccess({
            slot: effectiveSelectedSlot,
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
    effectiveSelectedSlot &&
    selectedAddress
  );

  const missingStep = !selectedService
    ? "Select a service to continue"
    : !selectedDate
      ? "Select a date to continue"
      : !effectiveSelectedSlot
        ? "Pick a time slot to continue"
        : !selectedAddress
          ? "Select a service address to continue"
          : null;

  if (!mounted || !isAuthenticated || role !== "CUSTOMER") return null;

  if (isLoadingProvider) return <BookingPageSkeleton />;

  if (!provider) return <BookingNotFound />;

  return (
    <div className="min-h-screen bg-zinc-50">
      <PublicNavbar />

      {bookingSuccess && (
        <BookingSuccessOverlay
          slot={bookingSuccess.slot}
          dateLabel={bookingSuccess.dateLabel}
          serviceName={bookingSuccess.serviceName}
          onClose={() => {
            setBookingSuccess(null);
            setSelectedSlot(null);
            setSelectedDate(null);
            setUserSelectedService(null);
          }}
        />
      )}

      <div className="pt-24 pb-16 max-w-5xl mx-auto px-6">
        <BookingPageHeader
          providerSlug={providerSlug}
          providerName={provider.user.name}
        />

        <div className="grid lg:grid-cols-[1fr_340px] gap-6 items-start">
          <div className="space-y-5">
            <ServiceSelector
              provider={provider}
              selectedService={selectedService}
              onSelect={setUserSelectedService}
            />
            <DateSelector
              selectedDate={selectedDate}
              onSelect={setSelectedDate}
            />
            {selectedService && selectedDate && (
              <SlotSelector
                slots={slots}
                slotsByLabel={slotsByLabel}
                selectedSlot={effectiveSelectedSlot}
                isLoading={isLoadingSlots}
                error={slotsError}
                onSelect={setSelectedSlot}
              />
            )}
          </div>

          <div className="space-y-5 lg:sticky lg:top-24">
            <AddressSelector
              addresses={addresses}
              isLoading={isLoadingAddresses}
              selectedAddress={selectedAddress}
              onSelect={setUserSelectedAddress}
            />
            <OrderSummary
              selectedService={selectedService}
              selectedDate={selectedDate}
              selectedSlot={effectiveSelectedSlot}
              customerNote={customerNote}
              onCustomerNoteChange={setCustomerNote}
              isPending={isPending}
              canBook={canBook}
              missingStep={missingStep}
              onBook={handleBook}
            />
            <BookingProviderCard provider={provider} />
          </div>
        </div>
      </div>
    </div>
  );
}
