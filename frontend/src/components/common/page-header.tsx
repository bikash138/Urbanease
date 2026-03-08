"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  endContent?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  actionLabel,
  onAction,
  endContent,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
      </div>
      {endContent !== undefined ? (
        endContent
      ) : actionLabel != null && onAction != null ? (
        <Button onClick={onAction} className="shrink-0">
          <Plus className="mr-2 h-4 w-4" />
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
