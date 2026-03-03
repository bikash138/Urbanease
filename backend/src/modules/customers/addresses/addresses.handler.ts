import { asyncHandler } from "../../../common/utils/asyncHandler";
import { AddressService } from "./addresses.service";
import type { Request, Response } from "express";

export class AddressHandler {
  private addressService: AddressService;

  constructor() {
    this.addressService = new AddressService();
  }

  createAddress = asyncHandler(async (req: Request, res: Response) => {
    const address = await this.addressService.createAddress(
      req.user!.id,
      req.body,
    );
    res.status(201).json({ success: true, data: address });
  });

  getAllAddresses = asyncHandler(async (req: Request, res: Response) => {
    const addresses = await this.addressService.getAllAddresses(req.user!.id);
    res.status(200).json({ success: true, data: addresses });
  });

  updateAddress = asyncHandler(async (req: Request, res: Response) => {
    const address = await this.addressService.updateAddress(
      req.user!.id,
      req.params.id as string,
      req.body,
    );
    res.status(200).json({ success: true, data: address });
  });

  deleteAddress = asyncHandler(async (req: Request, res: Response) => {
    await this.addressService.deleteAddress(
      req.user!.id,
      req.params.id as string,
    );
    res
      .status(200)
      .json({ success: true, message: "Address deleted successfully" });
  });

  setDefaultAddress = asyncHandler(async (req: Request, res: Response) => {
    const address = await this.addressService.setDefaultAddress(
      req.user!.id,
      req.params.id as string,
    );
    res.status(200).json({
      success: true,
      data: address,
      message: "Default address updated",
    });
  });
}
