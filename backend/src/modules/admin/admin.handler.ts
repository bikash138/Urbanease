import { AdminService } from "./admin.service";
import type { Request, Response, NextFunction } from "express";

export class AdminHandler {
  private adminService: AdminService;

  constructor() {
    this.adminService = new AdminService();
  }

  createServiceCategory = async (req: Request, res: Response) => {
    try {
      const serviceCategory = await this.adminService.addServiceCategory(
        req.body,
      );

      res.status(201).json({
        success: true,
        data: serviceCategory,
        message: "Category created successfully",
      });
    } catch (error) {
      console.log("Internal server error", error);
    }
  };

  createService = async (req: Request, res: Response) => {
    try {
      const service = await this.adminService.addService(req.body);
      res.status(201).json({
        success: true,
        data: service,
        message: "Service created successfully",
      });
    } catch (error) {
      console.log("Something went wrong", error);
    }
  };
}
