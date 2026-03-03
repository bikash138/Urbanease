import { Router } from "express";
import adminRouter from "./modules/admin/admin.routes";
import authRoute from "./modules/auth/auth.routes";
import providerRouter from "./modules/providers/provider.routes";

const router = Router();

router.use("/admin", adminRouter);
router.use("/auth", authRoute);
router.use("/provider", providerRouter);

export default router;
