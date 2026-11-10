import { Router } from "express";
import { signup, login, me } from "../controllers/auth.controller";
//import { authRequired } from "../middleware/authRequired";

const router = Router();

// POST /auth/signup
router.post("/signup", signup);

// POST /auth/login
router.post("/login", login);

// GET /auth/me
//router.get("/me", authRequired, me);

export default router;
