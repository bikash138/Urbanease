import { ApiResponse } from "@/lib/api-client";

export type UserRole = "CUSTOMER" | "PROVIDER" | "ADMIN";

export interface SigninPayload {
  email: string;
  password: string;
}

export interface AdminSigninPayload {
  email: string;
  password: string;
  adminKey: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  role: "CUSTOMER" | "PROVIDER";
}

//----Responses----

export interface AuthorizedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthSessionData {
  accessToken: string;
  accessExpiresInSeconds: number;
  user: AuthorizedUser;
}

export type SigninResponse = ApiResponse<AuthSessionData>;

export type SignupResponse = ApiResponse<AuthSessionData>;

export type AdminSigninResponse = ApiResponse<AuthSessionData>;

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

/** Auth endpoints that return only success + message (no data). */
export interface AuthMessageResponse {
  success: boolean;
  message: string;
}
