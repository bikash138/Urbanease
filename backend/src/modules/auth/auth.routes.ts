import { Router } from "express";
import { AuthHandler } from "./auth.handler";
import { validateRequest } from "../../common/middleware/validate.middleware";
import {
  createSigninSchema,
  createSignupSchema,
  createAdminSigninSchema,
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

export default authRoute;
