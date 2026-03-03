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
}
