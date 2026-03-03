import { asyncHandler } from "../../../common/utils/asyncHandler";
import { AdminReviewService } from "./review.service";
import type { Request, Response } from "express";

export class AdminReviewHandler {
  private reviewService: AdminReviewService;

  constructor() {
    this.reviewService = new AdminReviewService();
  }

  getFlaggedReviews = asyncHandler(async (req: Request, res: Response) => {
    const providerServiceId = req.query.providerServiceId as string;
    const reviews =
      await this.reviewService.getFlaggedReviews(providerServiceId);
    res.status(200).json({ success: true, data: reviews });
  });

  // PATCH /admin/review/:id/status
  updateReviewStatus = asyncHandler(async (req: Request, res: Response) => {
    const review = await this.reviewService.updateReviewStatus(
      req.params.id as string,
      req.body,
    );
    res.status(200).json({
      success: true,
      data: review,
      message: `Review status updated to ${review.status}`,
    });
  });
}
