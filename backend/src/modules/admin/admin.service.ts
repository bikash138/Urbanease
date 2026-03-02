import { AppError } from "../../common/errors/app.error";
import { ErrorCode } from "../../common/errors/error.types";
import { AdminRepository } from "./admin.repository";
import type {
  CreateServiceSchemaDTO,
  CreateServiceCategorySchemaDTO,
} from "./admin.validation";

export class AdminService {
  private adminRepository: AdminRepository;

  constructor() {
    this.adminRepository = new AdminRepository();
  }

  async addServiceCategory(data: CreateServiceCategorySchemaDTO) {
    try {
      return await this.adminRepository.createServiceCategory(data);
    } catch (error) {
      throw new AppError(
        "Service Category creation failed",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addService(data: CreateServiceSchemaDTO) {
    try {
      return await this.adminRepository.createService(data);
    } catch (error) {
      throw new AppError(
        "Service creation failed",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
