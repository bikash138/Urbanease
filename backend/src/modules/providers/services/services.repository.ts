import { prisma } from "../../../../db";
import type { SlotLabel } from "../../../../generated/prisma/enums";
import type { AddServiceDTO, UpdateServiceDTO } from "./services.validation";

const providerServiceSelect = {
  id: true,
  customPrice: true,
  isAvailable: true,
  providerId: true,
  serviceId: true,
  createdAt: true,
  updatedAt: true,
  service: true,
  serviceArea: {
    select: {
      areaId: true,
      area: {
        select: { id: true, name: true, slug: true, city: true, state: true },
      },
    },
  },
} as const;

const SLOT_LABELS: SlotLabel[] = ["MORNING", "AFTERNOON", "NIGHT"];
const TOTAL_SLOTS_PER_LABEL = 2;
const DAYS_AHEAD = 10;

export class ServicesRepository {
  async addService(providerId: string, data: AddServiceDTO) {
    return await prisma.providerService.create({
      data: {
        providerId,
        serviceId: data.serviceId,
        customPrice: data.customPrice,
        isAvailable: data.isAvailable ?? true,
        ...(data.areaIds &&
          data.areaIds.length > 0 && {
            serviceArea: {
              create: data.areaIds.map((areaId) => ({ areaId })),
            },
          }),
      },
      select: providerServiceSelect,
    });
  }

  async createSlotsForProvider(providerSlug: string): Promise<void> {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const slotData: { providerSlug: string; date: Date; slot: SlotLabel; totalSlots: number }[] = [];

    for (let d = 0; d <= DAYS_AHEAD; d++) {
      const date = new Date(today);
      date.setUTCDate(today.getUTCDate() + d);
      date.setUTCHours(0, 0, 0, 0);

      for (const label of SLOT_LABELS) {
        slotData.push({
          providerSlug,
          date,
          slot: label,
          totalSlots: TOTAL_SLOTS_PER_LABEL,
        });
      }
    }

    await prisma.providerSlot.createMany({
      data: slotData,
      skipDuplicates: true,
    });
  }

  async getAllServices(providerId: string) {
    return await prisma.providerService.findMany({
      where: { providerId },
      select: providerServiceSelect,
    });
  }

  async updateService(
    providerId: string,
    providerServiceId: string,
    data: UpdateServiceDTO,
  ) {
    return await prisma.providerService.update({
      where: {
        id: providerServiceId,
        providerId: providerId,
      },
      data: {
        ...(data.customPrice !== undefined && { customPrice: data.customPrice }),
        ...(data.isAvailable !== undefined && { isAvailable: data.isAvailable }),
      },
      select: providerServiceSelect,
    });
  }

  async removeService(providerId: string, providerServiceId: string) {
    return await prisma.providerService.delete({
      where: {
        id: providerServiceId,
        providerId: providerId,
      },
    });
  }
}
