import { Router } from "express";
import categoryRouter from "./category/category.routes";
import serviceRouter from "./service/service.routes";

const adminRouter = Router();

adminRouter.use("/category", categoryRouter);

adminRouter.use("/service", serviceRouter);

export default adminRouter;
