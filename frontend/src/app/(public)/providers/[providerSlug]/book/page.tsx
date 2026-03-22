import { Suspense } from "react";
import { BookingPageSkeleton } from "@/components/public/providers/book";
import BookingPageClient from "./BookingPageClient";

export default function BookingPage({
  params,
}: {
  params: Promise<{ providerSlug: string }>;
}) {
  return (
    <Suspense fallback={<BookingPageSkeleton />}>
      <BookingPageClient params={params} />
    </Suspense>
  );
}
