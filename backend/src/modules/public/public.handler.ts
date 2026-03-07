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

  //  Categories 

  getAllCategories = asyncHandler(async (req: Request, res: Response) => {
    const categories = await this.publicService.getAllCategories();
    res.status(200).json({ success: true, data: categories });
  });

  getCategoryBySlug = asyncHandler(async (req: Request, res: Response) => {
    const category = await this.publicService.getCategoryBySlug(
      req.params.slug as string,
    );
    res.status(200).json({ success: true, data: category });
  });

  //  Services 

  getAllServices = asyncHandler(async (req: Request, res: Response) => {
    const categoryId = req.query.categoryId as string | undefined;
    const services = await this.publicService.getAllServices(categoryId);
    res.status(200).json({ success: true, data: services });
  });

  getServiceBySlug = asyncHandler(async (req: Request, res: Response) => {
    const service = await this.publicService.getServiceBySlug(
      req.params.slug as string,
    );
    res.status(200).json({ success: true, data: service });
  });

  //Providers

  getAllProviders = asyncHandler(async (req: Request, res: Response) => {
    const providers = await this.publicService.getAllProviders();
    res.status(200).json({ success: true, data: providers });
  });

  getProviderBySlug = asyncHandler(async (req: Request, res: Response) => {
    const provider = await this.publicService.getProviderBySlug(
      req.params.slug as string,
    );
    res.status(200).json({ success: true, data: provider });
  });

  getAvailableSlots = asyncHandler(async (req: Request, res: Response) => {
    const providerSlug = req.params.slug;
    const { date, providerServiceId } = req.query as {
      date: string;
      providerServiceId?: string;
    };

    if (!date) {
      throw new AppError(
        "Date as query params is needed",
        400,
        ErrorCode.VALIDATION_ERROR,
      );
    }

    const result = await this.publicService.getAvailableSlots(
      providerSlug as string,
      date,
      providerServiceId,
    );
    res.status(200).json({ success: true, data: result });
  });

  getPublicReviews = asyncHandler(async (req: Request, res: Response) => {
    const providerId = req.query.providerId as string | undefined;
    const reviews = await this.publicService.getPublicReviews(providerId);
    res.status(200).json({ success: true, data: reviews });
  });
}
