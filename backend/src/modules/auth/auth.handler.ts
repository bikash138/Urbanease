import { asyncHandler } from "../../common/utils/asyncHandler";
import { AuthService } from "./auth.service";
import { env } from "../../config";
import type { Request, Response } from "express";

function getCookieOptions() {
  const base = {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
  };
  return {
    ...base,
    ...(env.COOKIE_DOMAIN && { domain: env.COOKIE_DOMAIN }),
    ...(env.NODE_ENV === "production" && { secure: true }),
  };
}

export class AuthHandler {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  createSignup = asyncHandler(async (req: Request, res: Response) => {
    const signupData = await this.authService.signupService(req.body);
    const cookieOpts = getCookieOptions();
    res.cookie("token", signupData.token, cookieOpts);
    res.cookie("role", signupData.user.role, cookieOpts);
    res.status(201).json({
      success: true,
      data: signupData,
      message: "Signed up successfully",
    });
  });

  createSignin = asyncHandler(async (req: Request, res: Response) => {
    const signinData = await this.authService.signinService(req.body);
    const cookieOpts = getCookieOptions();
    res.cookie("token", signinData.token, cookieOpts);
    res.cookie("role", signinData.user.role, cookieOpts);
    res.status(201).json({
      success: true,
      data: signinData,
      message: "Signed in successfully",
    });
  });

  createAdminSignin = asyncHandler(async (req: Request, res: Response) => {
    const signinData = await this.authService.adminSigninService(req.body);
    const cookieOpts = getCookieOptions();
    res.cookie("token", signinData.token, cookieOpts);
    res.cookie("role", signinData.user.role, cookieOpts);
    res.status(200).json({
      success: true,
      data: signinData,
      message: "Admin signed in successfully",
    });
  });

  createSignout = asyncHandler(async (req: Request, res: Response) => {
    const cookieOpts = getCookieOptions();
    res.clearCookie("token", cookieOpts);
    res.clearCookie("role", cookieOpts);
    res.status(200).json({ success: true, message: "Signed out successfully" });
  });
}
