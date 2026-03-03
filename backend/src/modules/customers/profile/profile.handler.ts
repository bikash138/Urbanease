import { asyncHandler } from "../../../common/utils/asyncHandler";
import { CustomerProfileService } from "./profile.service";
import type { Request, Response } from "express";

export class CustomerProfileHandler {
  private profileService: CustomerProfileService;

  constructor() {
    this.profileService = new CustomerProfileService();
  }

  createProfile = asyncHandler(async (req: Request, res: Response) => {
    const profile = await this.profileService.createProfile(req.user!.id);
    res.status(201).json({ success: true, data: profile });
  });

  getProfile = asyncHandler(async (req: Request, res: Response) => {
    const profile = await this.profileService.getProfile(req.user!.id);
    res.status(200).json({ success: true, data: profile });
  });
}
