import { Router } from "express";
import { AdminHandler } from "./admin.handler";

const adminRouter = Router();
const adminHandler = new AdminHandler();

adminRouter.post("/category", adminHandler.createService);
adminRouter.post("/service", adminHandler.createService);

export default adminRouter;
