import { prisma } from "../../../../db";
import type {
  CreateAddressDTO,
  UpdateAddressDTO,
} from "./addresses.validation";

export class AddressRepository {
  async createAddress(customerId: string, data: CreateAddressDTO) {
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { customerId },
        data: { isDefault: false },
      });
    }

    return await prisma.address.create({
      data: {
        customerId,
        label: data.label,
        street: data.street,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        isDefault: data.isDefault ?? false,
      },
    });
  }

  async getAllAddresses(customerId: string) {
    return await prisma.address.findMany({
      where: { customerId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
  }

  async updateAddress(
    customerId: string,
    addressId: string,
    data: UpdateAddressDTO,
  ) {
    return await prisma.address.update({
      where: { id: addressId, customerId },
      data,
    });
  }

  async deleteAddress(customerId: string, addressId: string) {
    return await prisma.address.delete({
      where: { id: addressId, customerId },
      select: { id: true },
    });
  }

  async setDefaultAddress(customerId: string, addressId: string) {
    await prisma.address.updateMany({
      where: { customerId },
      data: { isDefault: false },
    });

    return await prisma.address.update({
      where: { id: addressId, customerId },
      data: { isDefault: true },
    });
  }
}
