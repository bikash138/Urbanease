import { Router } from "express";
import adminRouter from "./modules/admin/admin.routes";

const router = Router();

router.use("/admin", adminRouter);

export default router;
