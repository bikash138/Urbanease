import { Router } from "express";
import { AuthHandler } from "./auth.handler";
import { validateRequest } from "../../common/middleware/validate.middleware";
import { createSigninSchema, createSignupSchema } from "./auth.validation";

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

export default authRoute;
