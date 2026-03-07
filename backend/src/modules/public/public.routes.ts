import { Router } from "express";
import { PublicHandler } from "./public.handler";

const publicRouter = Router();
const publicHandler = new PublicHandler();

// Categories
publicRouter.get("/categories", publicHandler.getAllCategories);
publicRouter.get("/categories/:slug", publicHandler.getCategoryBySlug);

// Services
publicRouter.get("/services", publicHandler.getAllServices);
publicRouter.get("/services/:slug", publicHandler.getServiceBySlug);

// Providers
publicRouter.get("/providers", publicHandler.getAllProviders);
publicRouter.get("/providers/:slug", publicHandler.getProviderBySlug);

publicRouter.get("/providers/:slug/slots", publicHandler.getAvailableSlots);

// Reviews
publicRouter.get("/reviews", publicHandler.getPublicReviews);

export default publicRouter;
