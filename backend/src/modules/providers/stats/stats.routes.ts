import { Router } from "express";
import { authMiddleware } from "../../../common/middleware/auth.middleware";
import { roleMiddleware } from "../../../common/middleware/role.middleware";
import { StatsHandler } from "./stats.handler";

const statsRouter = Router();
const statsHandler = new StatsHandler();

statsRouter.use(authMiddleware, roleMiddleware("PROVIDER"));
statsRouter.get("/", statsHandler.getStats);

export default statsRouter;
