import { asyncHandler } from "../../../common/utils/asyncHandler";
import { ServicesService } from "./services.service";
import type { Request, Response } from "express";

export class ServicesHandler {
  private servicesService: ServicesService;

  constructor() {
    this.servicesService = new ServicesService();
  }

  addService = asyncHandler(async (req: Request, res: Response) => {
    const service = await this.servicesService.addService(
      req.user!.id,
      req.body,
    );
    res
      .status(201)
      .json({
        success: true,
        data: service,
        message: "Provider service created successfully",
      });
  });

  getAllServices = asyncHandler(async (req: Request, res: Response) => {
    const services = await this.servicesService.getAllServices(req.user!.id);
    res.status(200).json({ success: true, data: services });
  });

  updateService = asyncHandler(async (req: Request, res: Response) => {
    const service = await this.servicesService.updateService(
      req.user!.id,
      req.params.id as string,
      req.body,
    );
    res
      .status(200)
      .json({
        success: true,
        data: service,
        message: "Provider Service updated successfully",
      });
  });

  removeService = asyncHandler(async (req: Request, res: Response) => {
    const service = await this.servicesService.removeService(
      req.user!.id,
      req.params.id as string,
    );
    res
      .status(200)
      .json({
        success: true,
        data: service,
        message: "Service removed successfully",
      });
  });
}
