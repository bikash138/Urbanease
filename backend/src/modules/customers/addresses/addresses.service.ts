import { Prisma } from "../../../../generated/prisma/client";
import { AppError } from "../../../common/errors/app.error";
import { ErrorCode } from "../../../common/errors/error.types";
import { AddressRepository } from "./addresses.repository";
import { prisma } from "../../../../db";
import type {
  CreateAddressDTO,
  UpdateAddressDTO,
} from "./addresses.validation";

export class AddressService {
  private addressRepository: AddressRepository;

  constructor() {
    this.addressRepository = new AddressRepository();
  }

  private async getCustomerProfileId(userId: string) {
    const profile = await prisma.customerProfile.findUnique({
      where: { userId },
    });
    if (!profile) {
      throw new AppError(
        "Customer profile not found. Please create one first.",
        404,
        ErrorCode.NOT_FOUND,
      );
    }
    return profile.id;
  }

  async createAddress(userId: string, data: CreateAddressDTO) {
    try {
      const customerId = await this.getCustomerProfileId(userId);
      return await this.addressRepository.createAddress(customerId, data);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to create address",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllAddresses(userId: string) {
    try {
      const customerId = await this.getCustomerProfileId(userId);
      return await this.addressRepository.getAllAddresses(customerId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to fetch addresses",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateAddress(
    userId: string,
    addressId: string,
    data: UpdateAddressDTO,
  ) {
    try {
      const customerId = await this.getCustomerProfileId(userId);
      return await this.addressRepository.updateAddress(
        customerId,
        addressId,
        data,
      );
    } catch (error) {
      if (error instanceof AppError) throw error;
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new AppError("Address not found", 404, ErrorCode.NOT_FOUND);
      }
      throw new AppError(
        "Failed to update address",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteAddress(userId: string, addressId: string) {
    try {
      const customerId = await this.getCustomerProfileId(userId);
      return await this.addressRepository.deleteAddress(customerId, addressId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new AppError("Address not found", 404, ErrorCode.NOT_FOUND);
      }
      throw new AppError(
        "Failed to delete address",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async setDefaultAddress(userId: string, addressId: string) {
    try {
      const customerId = await this.getCustomerProfileId(userId);
      return await this.addressRepository.setDefaultAddress(
        customerId,
        addressId,
      );
    } catch (error) {
      if (error instanceof AppError) throw error;
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new AppError("Address not found", 404, ErrorCode.NOT_FOUND);
      }
      throw new AppError(
        "Failed to set default address",
        500,
        ErrorCode.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
