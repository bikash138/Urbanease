"use client";

import { useMutation } from "@tanstack/react-query";
import {
  generateProviderPresignedUrlAPI,
  uploadFileToS3API,
  type PresignedUrlPayload,
} from "@/api/provider/provider-upload.api";

export function useGenerateProviderPresignedUrl() {
  return useMutation({
    mutationFn: (payload: PresignedUrlPayload) =>
      generateProviderPresignedUrlAPI(payload),
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
