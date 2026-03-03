import { asyncHandler } from "../../../common/utils/asyncHandler";
import { ProfileService } from "./profile.service";
import type { Request, Response } from "express";

export class ProfileHandler {
  private profileService: ProfileService;

  constructor() {
    this.profileService = new ProfileService();
  }

  createProfile = asyncHandler(async (req: Request, res: Response) => {
    const profile = await this.profileService.createProfile(
      req.user!.id,
      req.body,
    );
    res.status(201).json({ success: true, data: profile });
  });

  getProfile = asyncHandler(async (req: Request, res: Response) => {
    const profile = await this.profileService.getProfile(req.user!.id);
    res.status(200).json({ success: true, data: profile });
  });

  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const profile = await this.profileService.updateProfile(
      req.user!.id,
      req.body,
    );
    res.status(200).json({ success: true, data: profile });
  });
}
