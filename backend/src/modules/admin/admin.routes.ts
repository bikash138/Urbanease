import { Router } from "express";
import categoryRouter from "./category/category.routes";
import serviceRouter from "./service/service.routes";
import providerRouter from "./provider/provider.routes";
import reviewRouter from "./review/review.routes";

const adminRouter = Router();

adminRouter.use("/category", categoryRouter);
adminRouter.use("/service", serviceRouter);
adminRouter.use("/provider", providerRouter);
adminRouter.use("/review", reviewRouter);

export default adminRouter;
