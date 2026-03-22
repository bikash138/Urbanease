export function PublicApiUnavailableMessage() {
  return (
    <div
      className="rounded-2xl border border-zinc-200 bg-zinc-50 px-6 py-10 text-center"
      role="alert"
    >
      <p className="text-sm font-medium text-zinc-900">
        We can&apos;t reach our servers right now.
      </p>
      <p className="mt-2 text-sm text-zinc-600">
        Please try again in a moment — this is usually temporary.
      </p>
    </div>
  );
}
