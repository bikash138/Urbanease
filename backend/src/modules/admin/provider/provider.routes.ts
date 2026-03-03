import { Router } from "express";
import { ProviderHandler } from "./provider.handler";
import { authMiddleware } from "../../../common/middleware/auth.middleware";
import { roleMiddleware } from "../../../common/middleware/role.middleware";
import { validateRequest } from "../../../common/middleware/validate.middleware";
import { rejectProviderSchema } from "./provider.validation";

const providerRouter = Router();
const providerHandler = new ProviderHandler();

// GET /admin/provider?status=PENDING
providerRouter.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  providerHandler.getAllProviders,
);

providerRouter.get(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  providerHandler.getProviderByID,
);

providerRouter.patch(
  "/:id/approve",
  authMiddleware,
  roleMiddleware("ADMIN"),
  providerHandler.approveProvider,
);

providerRouter.patch(
  "/:id/reject",
  authMiddleware,
  roleMiddleware("ADMIN"),
  validateRequest(rejectProviderSchema),
  providerHandler.rejectProvider,
);

export default providerRouter;
