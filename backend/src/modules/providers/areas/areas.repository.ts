import { prisma } from "../../../../db";

export class ProviderAreasRepository {
  async findActiveAreas() {
    return await prisma.area.findMany({
      where: { isActive: true },
      orderBy: [{ city: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        slug: true,
        city: true,
        state: true,
      },
    });
  }
}
