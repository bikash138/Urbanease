import apiClient from "@/lib/api-client";
import axios from "axios";

export interface PresignedUrlPayload {
  filename: string;
  contentType: string;
  folder?: string;
}

export interface PresignedUrlResponse {
  message: string;
  data: {
    uploadUrl: string;
    key: string;
    publicUrl: string;
  };
}

export async function generatePresignedUrlAPI(
  payload: PresignedUrlPayload,
): Promise<PresignedUrlResponse> {
  return apiClient.post("/admin/upload/presigned-url", payload);
}

export async function uploadFileToS3API(
  uploadUrl: string,
  file: File,
): Promise<void> {
  const response = await axios.put(uploadUrl, file, {
    headers: {
      "Content-Type": file.type,
    },
  });

  if (response.status !== 200) {
    throw new Error("Failed to upload image to S3");
  }
}

export async function deleteS3ImageAPI(
  key: string,
): Promise<{ message: string }> {
  return apiClient.delete("/admin/upload", { data: { key } });
}
