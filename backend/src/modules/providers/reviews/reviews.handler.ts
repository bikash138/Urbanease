import { asyncHandler } from "../../../common/utils/asyncHandler";
import { ReviewsService } from "./reviews.service";
import type { Request, Response } from "express";

export class ReviewsHandler {
  private reviewsService: ReviewsService;

  constructor() {
    this.reviewsService = new ReviewsService();
  }

  getReviews = asyncHandler(async (req: Request, res: Response) => {
    const reviews = await this.reviewsService.getReviews(req.user!.id, {
      status: "VISIBLE",
    });
    res.status(200).json({ success: true, data: reviews });
  });

  flagReview = asyncHandler(async (req: Request, res: Response) => {
    const review = await this.reviewsService.flagReview(
      req.user!.id,
      req.params.id as string,
    );
    res.status(200).json({
      success: true,
      data: review,
      message: "Review flagged successfully",
    });
  });
}
