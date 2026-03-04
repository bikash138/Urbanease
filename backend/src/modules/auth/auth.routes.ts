import { Router } from "express";
import { AuthHandler } from "./auth.handler";
import { validateRequest } from "../../common/middleware/validate.middleware";
import {
  createSigninSchema,
  createSignupSchema,
  createAdminSigninSchema,
} from "./auth.validation";

const authRoute = Router();
const authHandler = new AuthHandler();

authRoute.post(
  "/signin",
  validateRequest(createSigninSchema),
  authHandler.createSignin,
);

authRoute.post(
  "/signup",
  validateRequest(createSignupSchema),
  authHandler.createSignup,
);

authRoute.post(
  "/admin-signin",
  validateRequest(createAdminSigninSchema),
  authHandler.createAdminSignin,
);

export default authRoute;
