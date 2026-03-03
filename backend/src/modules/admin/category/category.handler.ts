import { asyncHandler } from "../../../common/utils/asyncHandler";
import { CategoryService } from "./category.service";
import type { Request, Response } from "express";

export class CategoryHandler {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  createServiceCategory = asyncHandler(async (req: Request, res: Response) => {
    const category = await this.categoryService.addServiceCategory(req.body);
    res.status(201).json({
      success: true,
      data: category,
      message: "Category created successfully",
    });
  });

  getAllServiceCategories = asyncHandler(
    async (req: Request, res: Response) => {
      const categories = await this.categoryService.getAllServiceCategory();
      res.status(200).json({ success: true, data: categories });
    },
  );

  getServiceCategoryByID = asyncHandler(async (req: Request, res: Response) => {
    const category = await this.categoryService.getServiceCategoryByID({
      id: req.params.id as string,
    });
    res.status(200).json({ success: true, data: category });
  });

  updateServiceCategoryByID = asyncHandler(
    async (req: Request, res: Response) => {
      const category = await this.categoryService.updateServiceCategoryByID(
        req.params.id as string,
        req.body,
      );
      res.status(200).json({
        success: true,
        data: category,
        message: "Category updated successfully",
      });
    },
  );

  deleteServiceCategoryByID = asyncHandler(
    async (req: Request, res: Response) => {
      const category = await this.categoryService.deleteServiceCategoryByID({
        id: req.params.id as string,
      });
      res.status(200).json({
        success: true,
        data: category,
        message: "Category deleted successfully",
      });
    },
  );
}
