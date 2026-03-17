import { Router } from "express";
import categoryRouter from "./category/category.routes";
import serviceRouter from "./service/service.routes";
import providerRouter from "./provider/provider.routes";
import reviewRouter from "./review/review.routes";
import areaRouter from "./area/area.routes";
import {
  generateUploadUrl,
  deleteImageFromS3,
} from "../../common/utils/s3.service";
import { authMiddleware } from "../../common/middleware/auth.middleware";
import { roleMiddleware } from "../../common/middleware/role.middleware";
import { logger } from "../../lib/logger";

const adminRouter = Router();

adminRouter.use("/category", categoryRouter);
adminRouter.use("/service", serviceRouter);
adminRouter.use("/provider", providerRouter);
adminRouter.use("/review", reviewRouter);
adminRouter.use("/area", areaRouter);

/**
 * ========================================================
 * DIRECT S3 (PRESIGNED URL) ROUTES
 * ========================================================
 */

adminRouter.post(
  "/upload/presigned-url",
  authMiddleware,
  roleMiddleware("ADMIN"),
  async (req, res) => {
    try {
      const { filename, contentType, folder = "images" } = req.body;

      if (!filename || !contentType) {
        return res
          .status(400)
          .json({ error: "Filename and contentType are required" });
      }

      const uploadData = await generateUploadUrl(folder, filename, contentType);

      res.status(200).json({
        message: "Presigned URL generated successfully",
        data: uploadData,
      });
    } catch (error) {
      logger.error({ err: error }, "Error generating presigned URL");
      res
        .status(500)
        .json({ error: "Failed to generate presigned upload URL" });
    }
  },
);

adminRouter.delete(
  "/upload",
  authMiddleware,
  roleMiddleware("ADMIN"),
  async (req, res) => {
    try {
      const { key } = req.body;

      if (!key) {
        return res.status(400).json({ error: "File 'key' is required" });
      }

      await deleteImageFromS3(key);

      res.status(200).json({ message: "Image deleted successfully" });
    } catch (error) {
      logger.error({ err: error }, "Error deleting image from S3");
      res.status(500).json({ error: "Failed to delete image" });
    }
  },
);

export default adminRouter;
