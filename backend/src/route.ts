import { Router } from "express";
import adminRouter from "./modules/admin/admin.routes";
import authRoute from "./modules/auth/auth.routes";
import providerRouter from "./modules/providers/provider.routes";
import publicRouter from "./modules/public/public.routes";
import customerRouter from "./modules/customers/customer.routes";

import { generalRateLimit } from "./common/middleware/rate-limiter.middleware";

const router = Router();

router.use("/admin", adminRouter);
router.use("/auth", generalRateLimit, authRoute);
router.use("/provider", generalRateLimit, providerRouter);
router.use("/public", generalRateLimit, publicRouter);
router.use("/customer", generalRateLimit, customerRouter);

export default router;
