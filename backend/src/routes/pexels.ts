import { Router } from "express";
import { searchVideos } from "../controllers/pexelsController";
import { validateSearchQuery } from "../middleware/validate";
import { rateLimiter } from "../middleware/rateLimiter";

const router = Router();

router.get(
  "/search",
  rateLimiter,
  validateSearchQuery,
  searchVideos
);

export default router;
