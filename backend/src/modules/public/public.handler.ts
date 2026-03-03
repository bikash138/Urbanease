import { AppError } from "../../common/errors/app.error";
import { ErrorCode } from "../../common/errors/error.types";
import { asyncHandler } from "../../common/utils/asyncHandler";
import { PublicService } from "./public.service";
import type { Request, Response } from "express";

export class PublicHandler {
  private publicService: PublicService;

  constructor() {
    this.publicService = new PublicService();
  }

  // ─── Categories ────

  getAllCategories = asyncHandler(async (req: Request, res: Response) => {
    const categories = await this.publicService.getAllCategories();
    res.status(200).json({ success: true, data: categories });
  });

  getCategoryByID = asyncHandler(async (req: Request, res: Response) => {
    const category = await this.publicService.getCategoryByID(
      req.params.id as string,
    );
    res.status(200).json({ success: true, data: category });
  });

  // ─── Services ────

  getAllServices = asyncHandler(async (req: Request, res: Response) => {
    const categoryId = req.query.categoryId as string | undefined;
    const services = await this.publicService.getAllServices(categoryId);
    res.status(200).json({ success: true, data: services });
  });

  getServiceByID = asyncHandler(async (req: Request, res: Response) => {
    const service = await this.publicService.getServiceByID(
      req.params.id as string,
    );
    res.status(200).json({ success: true, data: service });
  });

  // ─── Providers ────

  getAllProviders = asyncHandler(async (req: Request, res: Response) => {
    const providers = await this.publicService.getAllProviders();
    res.status(200).json({ success: true, data: providers });
  });

  getProviderByID = asyncHandler(async (req: Request, res: Response) => {
    const provider = await this.publicService.getProviderByID(
      req.params.id as string,
    );
    res.status(200).json({ success: true, data: provider });
  });

  getAvailableSlots = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const { date, serviceId } = req.query as {
      date: string;
      serviceId: string;
    };

    if (!date || !serviceId) {
      throw new AppError(
        "date and serviceId query params are required",
        400,
        ErrorCode.VALIDATION_ERROR,
      );
    }

    const result = await this.publicService.getAvailableSlots(
      id as string,
      serviceId,
      date,
    );
    res.status(200).json({ success: true, data: result });
  });

  getPublicReviews = asyncHandler(async (req: Request, res: Response) => {
    const providerId = req.query.providerId as string | undefined;
    const reviews = await this.publicService.getPublicReviews(providerId);
    res.status(200).json({ success: true, data: reviews });
  });
}
