import { asyncHandler } from "../../common/utils/asyncHandler";
import { AdminService } from "./admin.service";
import type { Request, Response } from "express";

export class AdminHandler {
  private adminService: AdminService;

  constructor() {
    this.adminService = new AdminService();
  }

  createServiceCategory = asyncHandler(async (req: Request, res: Response) => {
    const serviceCategory = await this.adminService.addServiceCategory(
      req.body,
    );
    res.status(201).json({
      success: true,
      data: serviceCategory,
      message: "Category created successfully",
    });
  });

  createService = asyncHandler(async (req: Request, res: Response) => {
    const service = await this.adminService.addService(req.body);
    res.status(201).json({
      success: true,
      data: service,
      message: "Service created successfully",
    });
  });
}
