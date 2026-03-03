import { Router } from "express";
import { ServicesHandler } from "./services.handler";
import { authMiddleware } from "../../../common/middleware/auth.middleware";
import { roleMiddleware } from "../../../common/middleware/role.middleware";
import { validateRequest } from "../../../common/middleware/validate.middleware";
import { addServiceSchema, updateServiceSchema } from "./services.validation";

const servicesRouter = Router();
const servicesHandler = new ServicesHandler();

servicesRouter.use(authMiddleware, roleMiddleware("PROVIDER"));

servicesRouter.post(
  "/",
  validateRequest(addServiceSchema),
  servicesHandler.addService,
);
servicesRouter.get("/", servicesHandler.getAllServices);
servicesRouter.patch(
  "/:id",
  validateRequest(updateServiceSchema),
  servicesHandler.updateService,
);
servicesRouter.delete("/:id", servicesHandler.removeService);

export default servicesRouter;
