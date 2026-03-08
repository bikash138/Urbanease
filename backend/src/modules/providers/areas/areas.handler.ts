import { asyncHandler } from "../../../common/utils/asyncHandler";
import { ProviderAreasRepository } from "./areas.repository";
import type { Request, Response } from "express";

export class ProviderAreasHandler {
  private areasRepository: ProviderAreasRepository;

  constructor() {
    this.areasRepository = new ProviderAreasRepository();
  }

  getActiveAreas = asyncHandler(async (_req: Request, res: Response) => {
    const areas = await this.areasRepository.findActiveAreas();
    res.status(200).json({ success: true, data: areas });
  });
}
