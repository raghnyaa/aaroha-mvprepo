import { Router } from "express";
import { getMyProfile, updateMyProfile } from "../controllers/user.controller";
import { authRequired } from "../middleware/authRequired";

const router = Router();

// GET /users/me  (needs auth)
router.get("/me", authRequired, getMyProfile);

// PATCH /users/me (needs auth)
router.patch("/me", authRequired, updateMyProfile);

export default router;
