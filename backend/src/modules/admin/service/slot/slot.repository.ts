import { prisma } from "../../../../../db";
import type { CreateSlotDTO, UpdateSlotDTO } from "./slot.validation";

export class SlotRepository {
  async addSlot(serviceId: string, data: CreateSlotDTO) {
    // Create the slot
    const slot = await prisma.slot.create({
      data: {
        serviceId,
        label: data.label,
        startTime: data.startTime,
        endTime: data.endTime,
      },
    });

    // Auto-activate the service now that it has at least one slot
    await prisma.service.update({
      where: { id: serviceId },
      data: { isActive: true },
    });

    return slot;
  }

  async getAllSlots(serviceId: string) {
    return await prisma.slot.findMany({
      where: { serviceId },
      orderBy: { startTime: "asc" },
    });
  }

  async updateSlot(serviceId: string, slotId: string, data: UpdateSlotDTO) {
    return await prisma.slot.update({
      where: { id: slotId, serviceId },
      data,
    });
  }

  async deleteSlot(serviceId: string, slotId: string) {
    const deleted = await prisma.slot.delete({
      where: { id: slotId, serviceId },
      select: { id: true },
    });

    // Count remaining slots for this service
    const remainingSlots = await prisma.slot.count({
      where: { serviceId },
    });

    // If no slots left, deactivate the service
    if (remainingSlots === 0) {
      await prisma.service.update({
        where: { id: serviceId },
        data: { isActive: false },
      });
    }

    return deleted;
  }
}
