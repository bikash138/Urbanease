import { Router } from "express";
import { ServiceHandler } from "./service.handler";
import { authMiddleware } from "../../../common/middleware/auth.middleware";
import { roleMiddleware } from "../../../common/middleware/role.middleware";
import { validateRequest } from "../../../common/middleware/validate.middleware";
import { createServiceSchema, updateServiceSchema } from "./service.validation";

const serviceRouter = Router();
const serviceHandler = new ServiceHandler();

serviceRouter.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  validateRequest(createServiceSchema),
  serviceHandler.createService,
);

serviceRouter.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  serviceHandler.getAllServices,
);

serviceRouter.get(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  serviceHandler.getServiceByID,
);

serviceRouter.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  validateRequest(updateServiceSchema),
  serviceHandler.updateServiceByID,
);

serviceRouter.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  serviceHandler.deleteServiceByID,
);

export default serviceRouter;
