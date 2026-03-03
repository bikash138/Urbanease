import { Router } from "express";
import { PublicHandler } from "./public.handler";

const publicRouter = Router();
const publicHandler = new PublicHandler();

// ─── Categories ────
publicRouter.get("/categories", publicHandler.getAllCategories);
publicRouter.get("/categories/:id", publicHandler.getCategoryByID);

// ─── Services ────
publicRouter.get("/services", publicHandler.getAllServices);
publicRouter.get("/services/:id", publicHandler.getServiceByID);

// ─── Providers ────
publicRouter.get("/providers", publicHandler.getAllProviders);
publicRouter.get("/providers/:id", publicHandler.getProviderByID);

export default publicRouter;
