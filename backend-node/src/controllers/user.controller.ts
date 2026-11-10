import { Response } from "express";
import { AuthedRequest } from "../middleware/authRequired";
import {
  createDefaultProfileForUser,
  getProfileByUserId,
  updateProfile,
} from "../lib/profileStore";
import { getUserById } from "../lib/usersStore";

// GET /users/me
export function getMyProfile(req: AuthedRequest, res: Response) {
  if (!req.userId) {
    return res.status(401).json({ error: "unauthorized" });
  }

  // 1. get the auth user
  const user = getUserById(req.userId);
  if (!user) {
    return res.status(404).json({ error: "user not found" });
  }

  // 2. get or create their profile
  let profile = getProfileByUserId(req.userId);
  if (!profile) {
    profile = createDefaultProfileForUser(user.id, user.handle);
  }

  // 3. respond with BOTH
  return res.status(200).json({
    user: {
      id: user.id,
      email: user.email,
      handle: user.handle,
      createdAt: user.createdAt,
    },
    profile,
  });
}

// PATCH /users/me
export function updateMyProfile(req: AuthedRequest, res: Response) {
  if (!req.userId) {
    return res.status(401).json({ error: "unauthorized" });
  }

  const allowedUpdates = {
    handle: req.body.handle,
    displayName: req.body.displayName,
    avatarUrl: req.body.avatarUrl,
    bio: req.body.bio,
    dietaryGoal: req.body.dietaryGoal,
    allergies: req.body.allergies,
    theme: req.body.theme,
    privacy: req.body.privacy,
  };

  Object.keys(allowedUpdates).forEach((key) => {
    const k = key as keyof typeof allowedUpdates;
    if (allowedUpdates[k] === undefined) {
      delete allowedUpdates[k];
    }
  });

  const updated = updateProfile(req.userId, allowedUpdates);
  if (!updated) {
    return res.status(404).json({ error: "profile not found" });
  }

  return res.status(200).json(updated);
}
