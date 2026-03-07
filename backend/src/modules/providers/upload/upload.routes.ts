import { Router } from "express";
import { generateUploadUrl } from "../../../common/utils/s3.service";
import { authMiddleware } from "../../../common/middleware/auth.middleware";
import { roleMiddleware } from "../../../common/middleware/role.middleware";

const uploadRouter = Router();

uploadRouter.use(authMiddleware, roleMiddleware("PROVIDER"));

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
    console.error("Error generating presigned URL:", error);
    res
      .status(500)
      .json({ error: "Failed to generate presigned upload URL" });
  }
});

export default uploadRouter;
