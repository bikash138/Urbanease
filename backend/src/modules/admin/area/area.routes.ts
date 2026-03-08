import { Router } from "express";
import { AreaHandler } from "./area.handler";
import { authMiddleware } from "../../../common/middleware/auth.middleware";
import { roleMiddleware } from "../../../common/middleware/role.middleware";
import { validateRequest } from "../../../common/middleware/validate.middleware";
import { createAreaSchema, updateAreaSchema } from "./area.validation";

const areaRouter = Router();
const areaHandler = new AreaHandler();

areaRouter.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  validateRequest(createAreaSchema),
  areaHandler.create,
);

areaRouter.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  areaHandler.findAll,
);

areaRouter.get(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  areaHandler.findById,
);

areaRouter.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  validateRequest(updateAreaSchema),
  areaHandler.update,
);

areaRouter.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  areaHandler.delete,
);

export default areaRouter;
