"use client";

import { useMutation } from "@tanstack/react-query";
import {
  generatePresignedUrlAPI,
  uploadFileToS3API,
  deleteS3ImageAPI,
  PresignedUrlPayload,
} from "@/api/admin/admin-upload.api";

export function useGeneratePresignedUrl() {
  return useMutation({
    mutationFn: (payload: PresignedUrlPayload) =>
      generatePresignedUrlAPI(payload),
  });
}

export function useUploadFileToS3() {
  return useMutation({
    mutationFn: async ({
      uploadUrl,
      file,
    }: {
      uploadUrl: string;
      file: File;
    }) => {
      await uploadFileToS3API(uploadUrl, file);
    },
  });
}

export function useDeleteS3Image() {
  return useMutation({
    mutationFn: (key: string) => deleteS3ImageAPI(key),
  });
}
