import { Router } from "express";
import { AuthHandler } from "./auth.handler";
import { validateRequest } from "../../common/middleware/validate.middleware";
import {
  createSigninSchema,
  createSignupSchema,
  createAdminSigninSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./auth.validation";
import { authRateLimit } from "../../common/middleware/rate-limiter.middleware";

const authRoute = Router();
const authHandler = new AuthHandler();

authRoute.post(
  "/signin",
  authRateLimit,
  validateRequest(createSigninSchema),
  authHandler.createSignin,
);

authRoute.post(
  "/signup",
  authRateLimit,
  validateRequest(createSignupSchema),
  authHandler.createSignup,
);

authRoute.post(
  "/admin-signin",
  authRateLimit,
  validateRequest(createAdminSigninSchema),
  authHandler.createAdminSignin,
);

authRoute.post("/signout", authHandler.createSignout);

authRoute.post("/refresh", authRateLimit, authHandler.createRefreshToken);

authRoute.post(
  "/forgot-password",
  authRateLimit,
  validateRequest(forgotPasswordSchema),
  authHandler.createForgotPassword,
);

authRoute.post(
  "/reset-password",
  authRateLimit,
  validateRequest(resetPasswordSchema),
  authHandler.createResetPassword,
);

export default authRoute;
