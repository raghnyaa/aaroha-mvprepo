// backend-node/src/routes/meals.routes.ts
import { Router } from "express";
import multer from "multer";
import { authRequired } from "../middleware/authRequired";
import { createMeal, getLatestMeal, analyzeMeal } from "../controllers/meals.controller";

const upload = multer({ dest: "uploads/" });
const router = Router();

router.post("/", authRequired, createMeal);          // protected
router.get("/latest", authRequired, getLatestMeal);  // protected
router.post("/analyze", upload.single("file"), analyzeMeal); // public (image-only)

export default router;
