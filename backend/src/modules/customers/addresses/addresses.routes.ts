import { Router } from "express";
import { AddressHandler } from "./addresses.handler";
import { authMiddleware } from "../../../common/middleware/auth.middleware";
import { roleMiddleware } from "../../../common/middleware/role.middleware";
import { validateRequest } from "../../../common/middleware/validate.middleware";
import {
  createAddressSchema,
  updateAddressSchema,
} from "./addresses.validation";

import { actionRateLimit } from "../../../common/middleware/rate-limiter.middleware";

const addressesRouter = Router();
const addressHandler = new AddressHandler();

addressesRouter.use(authMiddleware, roleMiddleware("CUSTOMER"), actionRateLimit);

addressesRouter.post(
  "/",
  validateRequest(createAddressSchema),
  addressHandler.createAddress,
);
addressesRouter.get("/", addressHandler.getAllAddresses);
addressesRouter.put(
  "/:id",
  validateRequest(updateAddressSchema),
  addressHandler.updateAddress,
);
addressesRouter.delete("/:id", addressHandler.deleteAddress);
addressesRouter.patch("/:id/default", addressHandler.setDefaultAddress);

export default addressesRouter;
