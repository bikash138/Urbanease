import { Router } from "express";
import categoryRouter from "./category/category.routes";
import serviceRouter from "./service/service.routes";
import providerRouter from "./provider/provider.routes";

const adminRouter = Router();

adminRouter.use("/category", categoryRouter);
adminRouter.use("/service", serviceRouter);
adminRouter.use("/provider", providerRouter);

export default adminRouter;
