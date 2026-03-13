"use client";

import React, { useCallback, useState, useRef, useEffect } from "react";
import { UploadCloud, X, Pencil, Image as ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  value?: File | string | null;
  onChange: (file: File | null) => void;
  onRemove?: () => void;
  className?: string;
  disabled?: boolean;
  isUploading?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  className,
  disabled = false,
  isUploading = false,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!value) {
      setPreview(null);
      return;
    }
    if (typeof value === "string") {
      setPreview(value);
    } else {
      const objectUrl = URL.createObjectURL(value);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [value]);

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!disabled) setIsDragging(true);
    },
    [disabled],
  );

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      const droppedFiles = e.dataTransfer.files;
      if (droppedFiles && droppedFiles.length > 0) {
        const file = droppedFiles[0];
        if (file.type.startsWith("image/")) {
          onChange(file);
        }
      }
    },
    [disabled, onChange],
  );

  const handleClick = useCallback(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.click();
    }
  }, [disabled]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      const files = e.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (file.type.startsWith("image/")) {
          onChange(file);
        }
      }
      e.target.value = "";
    },
    [disabled, onChange],
  );

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (disabled) return;
      onChange(null);
      if (onRemove) onRemove();
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
    [disabled, onChange, onRemove],
  );

  const uploadOverlay = isUploading && (
    <div
      className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 rounded-lg bg-background/90 backdrop-blur-md animate-in fade-in duration-300"
    >
      <style>{`
        @keyframes uploadShimmer {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }
      `}</style>
      <div className="relative flex items-center justify-center">
        <div className="absolute h-14 w-14 rounded-full bg-primary/20 animate-ping animation-duration-[2s]" />
        <div className="relative flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary/30 bg-primary/5 shadow-lg">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <p className="text-sm font-semibold text-foreground">Uploading...</p>
        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full w-1/3 rounded-full bg-primary"
            style={{ animation: "uploadShimmer 1.5s ease-in-out infinite" }}
          />
        </div>
      </div>
    </div>
  );

  if (preview) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-lg border border-border group w-full aspect-video flex items-center justify-center bg-muted/50",
          className,
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={preview}
          alt="Upload preview"
          className="object-cover w-full h-full"
        />
        {uploadOverlay}
        <div
          className={cn(
            "absolute inset-0 bg-black/40 flex items-center justify-center gap-2 transition-opacity",
            isUploading ? "opacity-0" : "opacity-0 group-hover:opacity-100",
          )}
        >
          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={handleClick}
            className="h-10 w-10 shrink-0"
            disabled={disabled}
            title="Change photo"
          >
            <Pencil className="h-5 w-5" />
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={handleRemove}
            className="h-10 w-10 shrink-0"
            disabled={disabled}
            title="Remove"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative cursor-pointer flex flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors w-full aspect-video overflow-hidden",
        isDragging
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
        disabled && "pointer-events-none opacity-50",
        isUploading && "border-primary/50 bg-primary/5",
        className,
      )}
    >
      {uploadOverlay}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
      <div className="flex flex-col items-center justify-center p-6 space-y-3 text-center">
        <div className="rounded-full bg-primary/10 p-4">
          <UploadCloud className="h-8 w-8 text-primary" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">
            Click to upload{" "}
            <span className="text-muted-foreground font-normal">
              or drag and drop
            </span>
          </p>
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
            <ImageIcon className="h-3 w-3" /> PNG, JPG, WEBP up to 5MB
          </p>
        </div>
      </div>
    </div>
  );
}
