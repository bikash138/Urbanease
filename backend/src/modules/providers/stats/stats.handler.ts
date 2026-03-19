import { asyncHandler } from "../../../common/utils/asyncHandler";
import { StatsService } from "./stats.service";
import type { Request, Response } from "express";

export class StatsHandler {
  private statsService: StatsService;

  constructor() {
    this.statsService = new StatsService();
  }

  getStats = asyncHandler(async (req: Request, res: Response) => {
    const stats = await this.statsService.getStats(req.user!.id);
    res.status(200).json({ success: true, data: stats });
  });
}
