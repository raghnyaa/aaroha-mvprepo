// backend-node/src/middleware/authRequired.ts
import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../lib/jwt";

export interface AuthedRequest extends Request {
  userId?: string;
}

export function authRequired(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const hdr = req.headers.authorization || "";
    if (!hdr.startsWith("Bearer ")) {
      return res.status(401).json({ error: "unauthorized" });
    }
    const token = hdr.slice("Bearer ".length).trim();

    // (Optional dev bypass) if you want a backdoor:
    // if (process.env.DEV_TOKEN && token === process.env.DEV_TOKEN) {
    //   req.userId = "dev-user";
    //   return next();
    // }

    const payload = verifyAccessToken(token); // <- SAME secret and algorithm
    req.userId = payload.userId;
    next();
  } catch {
    return res.status(401).json({ error: "unauthorized" });
  }
}
