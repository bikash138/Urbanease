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
  role: UserRole;
}

//----Responses----

export interface AuthorizedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface SigninData {
  token: string;
  user: AuthorizedUser;
}

export type SigninResponse = ApiResponse<SigninData>;

export interface SignupData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type SignupResponse = ApiResponse<SignupData>;
