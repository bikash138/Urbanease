"use client";

interface AuthPageLayoutProps {
  children: React.ReactNode;
}

export function AuthPageLayout({ children }: AuthPageLayoutProps) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(251,243,219,0.6)_0%,transparent_70%)]" />
      <div className="w-full max-w-md relative z-10">{children}</div>
    </div>
  );
}
