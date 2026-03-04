import { asyncHandler } from "../../common/utils/asyncHandler";
import { AuthService } from "./auth.service";
import type { Request, Response } from "express";

export class AuthHandler {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  createSignin = asyncHandler(async (req: Request, res: Response) => {
    const signinData = await this.authService.signinService(req.body);
    res.status(201).json({
      success: true,
      data: signinData,
      message: "Signed in successfully",
    });
  });

  createSignup = asyncHandler(async (req: Request, res: Response) => {
    const signupData = await this.authService.singupService(req.body);
    res.status(201).json({
      success: true,
      data: signupData,
      message: "Signed up successfully",
    });
  });

  createAdminSignin = asyncHandler(async (req: Request, res: Response) => {
    const signinData = await this.authService.adminSigninService(req.body);
    res.status(200).json({
      success: true,
      data: signinData,
      message: "Admin signed in successfully",
    });
  });
}
