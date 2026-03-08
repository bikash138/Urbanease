export function TabBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span className="ml-1.5 inline-flex items-center justify-center size-5 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold">
      {count > 99 ? "99+" : count}
    </span>
  );
}
