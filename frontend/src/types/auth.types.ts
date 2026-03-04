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

export interface SigninResponse {
  token: string;
  user: AuthorizedUser;
}

export interface SignupResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
