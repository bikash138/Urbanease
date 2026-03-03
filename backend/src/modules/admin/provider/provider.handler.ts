import { asyncHandler } from "../../../common/utils/asyncHandler";
import { ProviderService } from "./provider.service";
import type { Request, Response } from "express";

export class ProviderHandler {
  private providerService: ProviderService;

  constructor() {
    this.providerService = new ProviderService();
  }

  getAllProviders = asyncHandler(async (req: Request, res: Response) => {
    const providers = await this.providerService.getAllProviders({
      status: req.query.status as
        | "PENDING"
        | "APPROVED"
        | "REJECTED"
        | undefined,
    });
    res.status(200).json({ success: true, data: providers });
  });

  getProviderByID = asyncHandler(async (req: Request, res: Response) => {
    const provider = await this.providerService.getProviderByID({
      id: req.params.id as string,
    });
    res.status(200).json({ success: true, data: provider });
  });

  approveProvider = asyncHandler(async (req: Request, res: Response) => {
    const provider = await this.providerService.approveProvider({
      id: req.params.id as string,
    });
    res.status(200).json({
      success: true,
      data: provider,
      message: "Provider approved successfully",
    });
  });

  rejectProvider = asyncHandler(async (req: Request, res: Response) => {
    const provider = await this.providerService.rejectProvider(
      { id: req.params.id as string },
      req.body,
    );
    res.status(200).json({
      success: true,
      data: provider,
      message: "Provider rejected",
    });
  });
}
