import { asyncHandler } from "../../../common/utils/asyncHandler";
import { CustomerReviewService } from "./reviews.service";
import type { Request, Response } from "express";

export class CustomerReviewHandler {
  private reviewService: CustomerReviewService;

  constructor() {
    this.reviewService = new CustomerReviewService();
  }

  createReview = asyncHandler(async (req: Request, res: Response) => {
    const review = await this.reviewService.createReview(
      req.user!.id,
      req.body,
    );
    res
      .status(201)
      .json({ success: true, data: review, message: "Review submitted" });
  });

  getAllReviews = asyncHandler(async (req: Request, res: Response) => {
    const reviews = await this.reviewService.getAllReviews(req.user!.id);
    res.status(200).json({ success: true, data: reviews });
  });

  updateReview = asyncHandler(async (req: Request, res: Response) => {
    const review = await this.reviewService.updateReview(
      req.user!.id,
      req.params.id as string,
      req.body,
    );
    res.status(200).json({ success: true, data: review });
  });

  deleteReview = asyncHandler(async (req: Request, res: Response) => {
    await this.reviewService.deleteReview(
      req.user!.id,
      req.params.id as string,
    );
    res.status(200).json({ success: true, message: "Review deleted" });
  });
}
