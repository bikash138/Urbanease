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
      console.log("Create Service Category Error", error);
    }
  }

  async addService(data: CreateServiceSchemaDTO) {
    try {
      return await this.adminRepository.createService(data);
    } catch (error) {
      console.log("Create Service Error", error);
    }
  }
}
