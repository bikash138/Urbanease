import { Router } from "express";
import { ProviderAreasHandler } from "./areas.handler";
import { authMiddleware } from "../../../common/middleware/auth.middleware";
import { roleMiddleware } from "../../../common/middleware/role.middleware";

const areasRouter = Router();
const areasHandler = new ProviderAreasHandler();

areasRouter.use(authMiddleware, roleMiddleware("PROVIDER"));

areasRouter.get("/", areasHandler.getActiveAreas);

export default areasRouter;
