import { Prisma } from "../../../../../generated/prisma/client";
import { AppError } from "../../../../common/errors/app.error";
import { ErrorCode } from "../../../../common/errors/error.types";
import { SlotRepository } from "./slot.repository";
import { prisma } from "../../../../../db";
import type { CreateSlotDTO, UpdateSlotDTO } from "./slot.validation";

export class SlotService {
  private slotRepository: SlotRepository;

  constructor() {
    this.slotRepository = new SlotRepository();
  }

  private async validateServiceExists(serviceId: string) {
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      select: { id: true },
    });
    if (!service) {
      throw new AppError("Service not found", 404, ErrorCode.NOT_FOUND);
    }
  }

  async addSlot(serviceId: string, data: CreateSlotDTO) {
    try {
      await this.validateServiceExists(serviceId);
      return await this.slotRepository.addSlot(serviceId, data);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to add slot",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllSlots(serviceId: string) {
    try {
      await this.validateServiceExists(serviceId);
      return await this.slotRepository.getAllSlots(serviceId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to fetch slots",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateSlot(serviceId: string, slotId: string, data: UpdateSlotDTO) {
    try {
      await this.validateServiceExists(serviceId);
      return await this.slotRepository.updateSlot(serviceId, slotId, data);
    } catch (error) {
      if (error instanceof AppError) throw error;
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new AppError("Slot not found", 404, ErrorCode.NOT_FOUND);
      }
      throw new AppError(
        "Failed to update slot",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteSlot(serviceId: string, slotId: string) {
    try {
      await this.validateServiceExists(serviceId);
      return await this.slotRepository.deleteSlot(serviceId, slotId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new AppError("Slot not found", 404, ErrorCode.NOT_FOUND);
      }
      throw new AppError(
        "Failed to delete slot",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
