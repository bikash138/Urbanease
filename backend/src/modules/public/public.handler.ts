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
    const categorySlug = req.query.categorySlug as string | undefined;
    const categoryId = req.query.categoryId as string | undefined;
    const services = await this.publicService.getAllServices(
      categorySlug ?? categoryId,
    );
    res.status(200).json({ success: true, data: services });
  });

  getServiceBySlug = asyncHandler(async (req: Request, res: Response) => {
    const { page: pageStr, limit: limitStr } = req.query as {
      page?: string;
      limit?: string;
    };
    const pageNum = Math.max(1, parseInt(pageStr ?? "1", 10) || 1);
    const limitNum = Math.min(
      100,
      Math.max(1, parseInt(limitStr ?? "20", 10) || 20),
    );
    const skip = (pageNum - 1) * limitNum;
    const result = await this.publicService.getServiceBySlug(
      req.params.slug as string,
      skip,
      limitNum,
    );
    if (!result) {
      return res.status(404).json({
        success: false,
        message: `Service not found`,
      });
    }
    const { total, ...service } = result;
    res.status(200).json({
      success: true,
      data: service,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
        hasNext: pageNum * limitNum < total,
        hasPrev: pageNum > 1,
      },
    });
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

  //Search

  searchProviders = asyncHandler(async (req: Request, res: Response) => {
    const { category, service, city, page, limit } = req.query as {
      category?: string;
      service?: string;
      city?: string;
      page?: string;
      limit?: string;
    };

    const hasFilters = category || service || city;
    if (!hasFilters) {
      throw new AppError(
        "At least one search filter is required (category, service, or city)",
        400,
        ErrorCode.VALIDATION_ERROR,
      );
    }

    const pageNum = Math.max(1, parseInt(page ?? "1", 10) || 1);
    const limitNum = Math.min(
      100,
      Math.max(1, parseInt(limit ?? "20", 10) || 20),
    );

    const result = await this.publicService.searchProviders({
      category: category?.trim(),
      service: service?.trim(),
      city: city?.trim(),
      pageNum,
      limitNum,
    });

    res.status(200).json({
      success: true,
      data: result.providerServices,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: result.total,
        totalPages: Math.ceil(result.total / limitNum),
        hasNext: pageNum * limitNum < result.total,
        hasPrev: pageNum > 1,
      },
    });
  });

  //Reviews

  getPublicReviews = asyncHandler(async (req: Request, res: Response) => {
    const providerId = req.query.providerId as string | undefined;
    const reviews = await this.publicService.getPublicReviews(providerId);
    res.status(200).json({ success: true, data: reviews });
  });
}
