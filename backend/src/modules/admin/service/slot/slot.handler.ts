import { asyncHandler } from "../../../../common/utils/asyncHandler";
import { SlotService } from "./slot.service";
import type { Request, Response } from "express";

export class SlotHandler {
  private slotService: SlotService;

  constructor() {
    this.slotService = new SlotService();
  }

  addSlot = asyncHandler(async (req: Request, res: Response) => {
    const slot = await this.slotService.addSlot(
      req.params.serviceId as string,
      req.body,
    );
    res.status(201).json({ success: true, data: slot });
  });

  getAllSlots = asyncHandler(async (req: Request, res: Response) => {
    const slots = await this.slotService.getAllSlots(
      req.params.serviceId as string,
    );
    res.status(200).json({ success: true, data: slots });
  });

  updateSlot = asyncHandler(async (req: Request, res: Response) => {
    const slot = await this.slotService.updateSlot(
      req.params.serviceId as string,
      req.params.slotId as string,
      req.body,
    );
    res.status(200).json({ success: true, data: slot });
  });

  deleteSlot = asyncHandler(async (req: Request, res: Response) => {
    await this.slotService.deleteSlot(
      req.params.serviceId as string,
      req.params.slotId as string,
    );
    res
      .status(200)
      .json({
        success: true,
        message: "Slot deleted. Service deactivated if no slots remain.",
      });
  });
}
