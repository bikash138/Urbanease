import { Router } from "express";
import { SlotHandler } from "./slot.handler";
import { authMiddleware } from "../../../../common/middleware/auth.middleware";
import { roleMiddleware } from "../../../../common/middleware/role.middleware";
import { validateRequest } from "../../../../common/middleware/validate.middleware";
import { createSlotSchema, updateSlotSchema } from "./slot.validation";

// This router is mounted under /admin/service/:serviceId/slots
// so :serviceId is accessible from parent router
const slotRouter = Router({ mergeParams: true });
const slotHandler = new SlotHandler();

slotRouter.use(authMiddleware, roleMiddleware("ADMIN"));

slotRouter.post("/", validateRequest(createSlotSchema), slotHandler.addSlot);
slotRouter.get("/", slotHandler.getAllSlots);
slotRouter.patch(
  "/:slotId",
  validateRequest(updateSlotSchema),
  slotHandler.updateSlot,
);
slotRouter.delete("/:slotId", slotHandler.deleteSlot);

export default slotRouter;
