import { asyncHandler } from "../../common/utils/asyncHandler";
import { AuthService } from "./auth.service";
import { env } from "../../config";
import { REFRESH_TOKEN_TTL_MS } from "../../utils/tokens";
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
    const data = await this.authService.signupService(req.body);
    const cookieOpts = getCookieOptions();
    res.cookie("access_token", data.accessToken, {
      ...cookieOpts,
      maxAge: data.accessExpiresInSeconds * 1000,
    });
    res.cookie("refreshToken", data.refreshToken, {
      ...cookieOpts,
      maxAge: REFRESH_TOKEN_TTL_MS,
    });
    res.cookie("role", data.user.role, cookieOpts);
    res.status(201).json({
      success: true,
      message: "Signed up successfully",
      data: {
        accessToken: data.accessToken,
        accessExpiresInSeconds: data.accessExpiresInSeconds,
        user: data.user,
      },
    });
  });

  createSignin = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.authService.signinService(req.body);
    const cookieOpts = getCookieOptions();
    res.cookie("access_token", data.accessToken, {
      ...cookieOpts,
      maxAge: data.accessExpiresInSeconds * 1000,
    });
    res.cookie("refreshToken", data.refreshToken, {
      ...cookieOpts,
      maxAge: REFRESH_TOKEN_TTL_MS,
    });
    res.cookie("role", data.user.role, cookieOpts);
    res.status(200).json({
      success: true,
      message: "Signed in successfully",
      data: {
        accessToken: data.accessToken,
        accessExpiresInSeconds: data.accessExpiresInSeconds,
        user: data.user,
      },
    });
  });

  createAdminSignin = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.authService.adminSigninService(req.body);
    const cookieOpts = getCookieOptions();
    res.cookie("access_token", data.accessToken, {
      ...cookieOpts,
      maxAge: data.accessExpiresInSeconds * 1000,
    });
    res.cookie("refreshToken", data.refreshToken, {
      ...cookieOpts,
      maxAge: REFRESH_TOKEN_TTL_MS,
    });
    res.cookie("role", data.user.role, cookieOpts);
    res.status(200).json({
      success: true,
      message: "Admin signed in successfully",
      data: {
        accessToken: data.accessToken,
        accessExpiresInSeconds: data.accessExpiresInSeconds,
        user: data.user,
      },
    });
  });

  createRefreshToken = asyncHandler(async (req: Request, res: Response) => {
    const raw =
      req.cookies?.refreshToken ??
      (typeof req.body?.refreshToken === "string"
        ? req.body.refreshToken
        : undefined);
    const data = await this.authService.refreshSessionService(raw ?? "");
    const cookieOpts = getCookieOptions();
    res.cookie("access_token", data.accessToken, {
      ...cookieOpts,
      maxAge: data.accessExpiresInSeconds * 1000,
    });
    res.cookie("refreshToken", data.refreshToken, {
      ...cookieOpts,
      maxAge: REFRESH_TOKEN_TTL_MS,
    });
    res.cookie("role", data.user.role, cookieOpts);
    res.status(200).json({
      success: true,
      message: "Session refreshed",
      data: {
        accessToken: data.accessToken,
        accessExpiresInSeconds: data.accessExpiresInSeconds,
        user: data.user,
      },
    });
  });

  createForgotPassword = asyncHandler(async (req: Request, res: Response) => {
    await this.authService.requestForgotPassword(req.body);
    res.status(200).json({
      success: true,
      message:
        "Verification email sent",
    });
  });

  createResetPassword = asyncHandler(async (req: Request, res: Response) => {
    await this.authService.resetPasswordService(req.body);
    res.status(200).json({
      success: true,
      message: "Password updated successfully.",
    });
  });

  createSignout = asyncHandler(async (req: Request, res: Response) => {
    const raw =
      req.cookies?.refreshToken ??
      (typeof req.body?.refreshToken === "string"
        ? req.body.refreshToken
        : undefined);
    await this.authService.signoutService(raw);
    const cookieOpts = getCookieOptions();
    res.clearCookie("access_token", cookieOpts);
    res.clearCookie("refreshToken", cookieOpts);
    res.clearCookie("role", cookieOpts);
    res.status(200).json({ success: true, message: "Signed out successfully" });
  });
}
