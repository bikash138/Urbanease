import { Router } from "express";
import { CustomerProfileHandler } from "./profile.handler";
import { authMiddleware } from "../../../common/middleware/auth.middleware";
import { roleMiddleware } from "../../../common/middleware/role.middleware";

const profileRouter = Router();
const profileHandler = new CustomerProfileHandler();

profileRouter.use(authMiddleware, roleMiddleware("CUSTOMER"));

profileRouter.post("/", profileHandler.createProfile);
profileRouter.get("/", profileHandler.getProfile);

export default profileRouter;
