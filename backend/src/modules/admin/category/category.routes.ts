import { Router } from "express";
import { CategoryHandler } from "./category.handler";
import { authMiddleware } from "../../../common/middleware/auth.middleware";
import { roleMiddleware } from "../../../common/middleware/role.middleware";
import { validateRequest } from "../../../common/middleware/validate.middleware";
import {
  createServiceCategorySchema,
  updateServiceCategorySchema,
} from "./category.validation";

const categoryRouter = Router();
const categoryHandler = new CategoryHandler();

categoryRouter.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  validateRequest(createServiceCategorySchema),
  categoryHandler.createServiceCategory,
);

categoryRouter.get(
  "/",
  // authMiddleware,
  // roleMiddleware("ADMIN"),
  categoryHandler.getAllServiceCategories,
);

categoryRouter.get(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  categoryHandler.getServiceCategoryByID,
);

categoryRouter.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  validateRequest(updateServiceCategorySchema),
  categoryHandler.updateServiceCategoryByID,
);

categoryRouter.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  categoryHandler.deleteServiceCategoryByID,
);

export default categoryRouter;
