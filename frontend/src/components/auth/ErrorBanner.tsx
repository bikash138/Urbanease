"use client";

import { AlertCircle } from "lucide-react";

interface ErrorBannerProps {
  message: string;
}

export function ErrorBanner({ message }: ErrorBannerProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
      <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
      <p className="text-sm text-red-600">{message}</p>
    </div>
  );
}
