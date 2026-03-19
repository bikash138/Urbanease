import { Router } from "express";
import { generateUploadUrl } from "../../../common/utils/s3.service";
import { authMiddleware } from "../../../common/middleware/auth.middleware";
import { roleMiddleware } from "../../../common/middleware/role.middleware";
import { logger } from "../../../lib/logger";
import { uploadRateLimit } from "../../../common/middleware/rate-limiter.middleware";

const uploadRouter = Router();

uploadRouter.use(authMiddleware, roleMiddleware("PROVIDER"), uploadRateLimit);

uploadRouter.post("/presigned-url", async (req, res) => {
  try {
    const { filename, contentType, folder = "bookings" } = req.body;

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
    res.status(500).json({ error: "Failed to generate presigned upload URL" });
  }
});

export default uploadRouter;
