import express from "express";
import { requestIdMiddleware } from "./common/middleware/requestId.middleware";
import router from "./route";
import { errorMiddleware } from "./common/middleware/error.middleware";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
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
