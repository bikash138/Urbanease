import { Router } from "express";
import adminRouter from "./modules/admin/admin.routes";
import authRoute from "./modules/auth/auth.routes";
import providerRouter from "./modules/providers/provider.routes";
import publicRouter from "./modules/public/public.routes";

const router = Router();

router.use("/admin", adminRouter);
router.use("/auth", authRoute);
router.use("/provider", providerRouter);
router.use("/public", publicRouter);

export default router;
