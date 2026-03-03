import { asyncHandler } from "../../../common/utils/asyncHandler";
import { ServiceService } from "./service.service";
import type { Request, Response } from "express";

export class ServiceHandler {
  private serviceService: ServiceService;

  constructor() {
    this.serviceService = new ServiceService();
  }

  createService = asyncHandler(async (req: Request, res: Response) => {
    const service = await this.serviceService.addService(req.body);
    res.status(201).json({
      success: true,
      data: service,
      message: "Service created successfully",
    });
  });

  getAllServices = asyncHandler(async (req: Request, res: Response) => {
    const services = await this.serviceService.getAllServices();
    res.status(200).json({ success: true, data: services });
  });

  getServiceByID = asyncHandler(async (req: Request, res: Response) => {
    const service = await this.serviceService.getServiceByID({
      id: req.params.id as string,
    });
    res.status(200).json({ success: true, data: service });
  });

  updateServiceByID = asyncHandler(async (req: Request, res: Response) => {
    const service = await this.serviceService.updateServiceByID(
      req.params.id as string,
      req.body,
    );
    res.status(200).json({
      success: true,
      data: service,
      message: "Service updated successfully",
    });
  });

  deleteServiceByID = asyncHandler(async (req: Request, res: Response) => {
    const service = await this.serviceService.deleteServiceByID({
      id: req.params.id as string,
    });
    res.status(200).json({
      success: true,
      data: service,
      message: "Service deleted successfully",
    });
  });
}
