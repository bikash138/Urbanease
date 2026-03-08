import { Prisma } from "../../../../generated/prisma/client";
import { AppError } from "../../../common/errors/app.error";
import { ErrorCode } from "../../../common/errors/error.types";
import { AreaRepository } from "./area.repository";
import type {
  CreateAreaSchemaDTO,
  AreaIdParamDTO,
  UpdateAreaDTO,
} from "./area.validation";

export class AreaService {
  private areaRepository: AreaRepository;

  constructor() {
    this.areaRepository = new AreaRepository();
  }

  async create(data: CreateAreaSchemaDTO) {
    try {
      return await this.areaRepository.create(data);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new AppError(
          "An area with this name, city and state already exists",
          409,
          ErrorCode.CONFLICT,
        );
      }
      throw new AppError(
        "Area creation failed",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    try {
      return await this.areaRepository.findAll();
    } catch {
      throw new AppError(
        "Failed to fetch areas",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findById(data: AreaIdParamDTO) {
    const area = await this.areaRepository.findById(data);
    if (!area) {
      throw new AppError("Area not found", 404, ErrorCode.NOT_FOUND);
    }
    return area;
  }

  async update(id: string, data: UpdateAreaDTO) {
    try {
      return await this.areaRepository.update(id, data);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new AppError("Area not found", 404, ErrorCode.NOT_FOUND);
      }
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new AppError(
          "An area with this name, city and state already exists",
          409,
          ErrorCode.CONFLICT,
        );
      }
      throw new AppError(
        "Area update failed",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(data: AreaIdParamDTO) {
    try {
      return await this.areaRepository.delete(data);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new AppError("Area not found", 404, ErrorCode.NOT_FOUND);
      }
      throw new AppError(
        "Area deletion failed",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
