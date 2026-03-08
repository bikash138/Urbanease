import express from "express";
import { requestIdMiddleware } from "./common/middleware/requestId.middleware";
import router from "./route";
import { errorMiddleware } from "./common/middleware/error.middleware";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config";

const app = express();

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(requestIdMiddleware);

app.use("/api/v1", router);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

app.use(errorMiddleware);

export default app;
