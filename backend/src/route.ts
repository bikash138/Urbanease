import { Router } from "express";
import adminRouter from "./modules/admin/admin.routes";
import authRoute from "./modules/auth/auth.routes";

const router = Router();

router.use("/admin", adminRouter);
router.use("/auth", authRoute);

export default router;
