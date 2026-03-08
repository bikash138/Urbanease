import { prisma } from "../../../../db";
import { createSlug } from "../../../common/utils/slug-generator";
import type { CreateAreaSchemaDTO, AreaIdParamDTO, UpdateAreaDTO } from "./area.validation";

export class AreaRepository {
  async create(data: CreateAreaSchemaDTO) {
    const slug = createSlug(`${data.name}-${data.city}-${data.state}`);
    return await prisma.area.create({
      data: { ...data, slug },
    });
  }

  async findAll() {
    return await prisma.area.findMany({
      orderBy: [{ city: "asc" }, { name: "asc" }],
    });
  }

  async findById(data: AreaIdParamDTO) {
    return await prisma.area.findUnique({
      where: { id: data.id },
    });
  }

  async update(id: string, data: UpdateAreaDTO) {
    const slug = createSlug(`${data.name}-${data.city}-${data.state}`);
    return await prisma.area.update({
      where: { id },
      data: { ...data, slug },
    });
  }

  async delete(data: AreaIdParamDTO) {
    return await prisma.area.delete({
      where: { id: data.id },
    });
  }
}
