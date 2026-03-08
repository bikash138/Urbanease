import { asyncHandler } from "../../../common/utils/asyncHandler";
import { AreaService } from "./area.service";
import type { Request, Response } from "express";

export class AreaHandler {
  private areaService: AreaService;

  constructor() {
    this.areaService = new AreaService();
  }

  create = asyncHandler(async (req: Request, res: Response) => {
    const area = await this.areaService.create(req.body);
    res.status(201).json({
      success: true,
      data: area,
      message: "Area created successfully",
    });
  });

  findAll = asyncHandler(async (req: Request, res: Response) => {
    const areas = await this.areaService.findAll();
    res.status(200).json({ success: true, data: areas });
  });

  findById = asyncHandler(async (req: Request, res: Response) => {
    const area = await this.areaService.findById({ id: req.params.id as string });
    res.status(200).json({ success: true, data: area });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const area = await this.areaService.update(req.params.id as string, req.body);
    res.status(200).json({
      success: true,
      data: area,
      message: "Area updated successfully",
    });
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await this.areaService.delete({ id: req.params.id as string });
    res.status(200).json({
      success: true,
      message: "Area deleted successfully",
    });
  });
}
