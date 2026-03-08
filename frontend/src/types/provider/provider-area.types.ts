import { ApiResponse } from "@/lib/api-client";

export interface ProviderArea {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
}

export type ProviderAreasResponse = ApiResponse<ProviderArea[]>;
