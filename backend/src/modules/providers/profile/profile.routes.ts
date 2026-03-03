import { Router } from "express";
import { ProfileHandler } from "./profile.handler";
import { authMiddleware } from "../../../common/middleware/auth.middleware";
import { roleMiddleware } from "../../../common/middleware/role.middleware";
import { validateRequest } from "../../../common/middleware/validate.middleware";
import { createProfileSchema, updateProfileSchema } from "./profile.validation";

const profileRouter = Router();
const profileHandler = new ProfileHandler();

profileRouter.use(authMiddleware, roleMiddleware("PROVIDER"));

profileRouter.post(
  "/",
  validateRequest(createProfileSchema),
  profileHandler.createProfile,
);
profileRouter.get("/", profileHandler.getProfile);
profileRouter.put(
  "/",
  validateRequest(updateProfileSchema),
  profileHandler.updateProfile,
);

export default profileRouter;
