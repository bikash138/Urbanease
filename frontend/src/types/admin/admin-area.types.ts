import { ApiResponse } from "@/lib/api-client";

export interface Area {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAreaPayload {
  name: string;
  city: string;
  state: string;
}

export interface UpdateAreaPayload {
  name: string;
  city: string;
  state: string;
  isActive?: boolean;
}

export type AreaResponse = ApiResponse<Area>;
export type AreasResponse = ApiResponse<Area[]>;
