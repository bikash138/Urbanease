import { Router } from "express";
import { AdminHandler } from "./admin.handler";
import { authMiddleware } from "../../common/middleware/auth.middleware";
import { roleMiddleware } from "../../common/middleware/role.middleware";
import { validateRequest } from "../../common/middleware/validate.middleware";
import {
  createServiceCategorySchema,
  createServiceSchema,
} from "./admin.validation";

const adminRouter = Router();
const adminHandler = new AdminHandler();

adminRouter.post(
  "/category",
  authMiddleware,
  roleMiddleware("ADMIN"),
  validateRequest(createServiceCategorySchema),
  adminHandler.createServiceCategory,
);
adminRouter.post(
  "/service",
  authMiddleware,
  roleMiddleware("ADMIN"),
  validateRequest(createServiceSchema),
  adminHandler.createService,
);

export default adminRouter;
