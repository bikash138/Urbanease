import apiClient from "@/lib/api-client";
import {
  AdminSigninPayload,
  SigninPayload,
  SigninResponse,
  SignupPayload,
  SignupResponse,
} from "@/types/auth.types";

export async function signinAPI(
  payload: SigninPayload,
): Promise<SigninResponse> {
  return apiClient.post("/auth/signin", payload);
}

export async function adminSigninAPI(
  payload: AdminSigninPayload,
): Promise<SigninResponse> {
  return apiClient.post("/auth/admin-signin", payload);
}

export async function signupAPI(
  payload: SignupPayload,
): Promise<SignupResponse> {
  return apiClient.post("/auth/signup", payload);
}
