import { Suspense } from "react";
import { ProviderProfileSkeleton } from "@/components/public/providers/providerDetail/ProviderProfileSkeleton";
import { getPublicProviderBySlug } from "@/server/public";
import ProviderProfileClient from "./ProviderProfileClient";

async function ProviderProfileLoader({
  params,
}: {
  params: Promise<{ providerSlug: string }>;
}) {
  const { providerSlug } = await params;
  const initialProvider = await getPublicProviderBySlug(providerSlug);

  return (
    <ProviderProfileClient
      providerSlug={providerSlug}
      initialProvider={initialProvider}
    />
  );
}

export default function ProviderProfilePage({
  params,
}: {
  params: Promise<{ providerSlug: string }>;
}) {
  return (
    <Suspense fallback={<ProviderProfileSkeleton />}>
      <ProviderProfileLoader params={params} />
    </Suspense>
  );
}
