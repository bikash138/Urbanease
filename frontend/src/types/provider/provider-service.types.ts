import { ApiResponse } from "@/lib/api-client";

// ──────────────────────────────────────────────
// Nested types (from Prisma includes)
// ──────────────────────────────────────────────

export interface ServiceData {
  id: string;
  title: string;
  description: string | null;
  basePrice: number;
  isActive: boolean;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderServiceData {
  id: string;
  customPrice: number | null;
  isAvailable: boolean;
  providerId: string;
  serviceId: string;
  createdAt: string;
  updatedAt: string;
}

/** Shape returned by GET /provider/services (includes nested service + slots) */
export interface ProviderServiceWithService extends ProviderServiceData {
  service: ServiceData;
}

// ──────────────────────────────────────────────
// Payloads
// ──────────────────────────────────────────────

/** POST /provider/services */
export interface AddServicePayload {
  serviceId: string;
  customPrice?: number;
  isAvailable?: boolean;
}

/** PATCH /provider/services/:id */
export interface UpdateServicePayload {
  customPrice?: number;
  isAvailable?: boolean;
}

// ──────────────────────────────────────────────
// Responses
// ──────────────────────────────────────────────

/** POST /provider/services → 201 */
export type AddServiceResponse = ApiResponse<ProviderServiceData>;

/** GET /provider/services → 200 */
export type GetAllServicesResponse = ApiResponse<ProviderServiceWithService[]>;

/** PATCH /provider/services/:id → 200 */
export type UpdateServiceResponse = ApiResponse<ProviderServiceData>;

/** DELETE /provider/services/:id → 200 */
export type RemoveServiceResponse = ApiResponse<ProviderServiceData>;
