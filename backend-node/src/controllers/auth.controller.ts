import { Request, Response } from "express";
import { createUser, getUserByEmail, getUserById } from "../lib/usersStore";
import { hashPassword, checkPassword } from "../lib/hash";
import { signAccessToken } from "../lib/jwt";
import { AuthedRequest } from "../middleware/authRequired";

export async function signup(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }

  const existing = getUserByEmail(email);
  if (existing) {
    return res.status(409).json({ error: "user already exists" });
  }

  const passwordHash = await hashPassword(password);
  const user = createUser(email, passwordHash);
  const token = signAccessToken(user.id);

  return res.status(201).json({
    accessToken: token,
    user: {
      id: user.id,
      email: user.email,
      handle: user.handle,
      createdAt: user.createdAt,
    },
  });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }

  const user = getUserByEmail(email);
  if (!user || !user.passwordHash) {
    return res.status(401).json({ error: "invalid credentials" });
  }

  const ok = await checkPassword(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ error: "invalid credentials" });
  }

  const token = signAccessToken(user.id);

  return res.status(200).json({
    accessToken: token,
    user: {
      id: user.id,
      email: user.email,
      handle: user.handle,
      createdAt: user.createdAt,
    },
  });
}

export async function me(req: AuthedRequest, res: Response) {
  if (!req.userId) {
    return res.status(401).json({ error: "unauthorized" });
  }

  const user = getUserById(req.userId);
  if (!user) {
    return res.status(404).json({ error: "user not found" });
  }

  return res.status(200).json({
    id: user.id,
    email: user.email,
    handle: user.handle,
    createdAt: user.createdAt,
  });
}
