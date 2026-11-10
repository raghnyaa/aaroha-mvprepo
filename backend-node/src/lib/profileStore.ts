import { UserProfile } from "../types/profile";
import fs from "fs";

const FILE_PATH = "./data/profiles.json";

let profiles: UserProfile[] = [];

// 1. Load from disk on startup
if (fs.existsSync(FILE_PATH)) {
  try {
    const raw = fs.readFileSync(FILE_PATH, "utf-8");
    profiles = JSON.parse(raw);
  } catch (err) {
    console.error("[profileStore] failed to parse profiles.json, starting empty", err);
    profiles = [];
  }
}

// 2. Save helper
function save() {
  fs.writeFileSync(FILE_PATH, JSON.stringify(profiles, null, 2));
}

// Get profile for this user
export function getProfileByUserId(userId: string): UserProfile | undefined {
  return profiles.find((p) => p.userId === userId);
}

// Create a default profile for a new user
export function createDefaultProfileForUser(
  userId: string,
  handle: string
): UserProfile {
  const now = new Date().toISOString();

  const profile: UserProfile = {
    userId,

    handle,
    displayName: handle,
    avatarUrl: null,

    bio: "Hey, I'm new here 🌱",

    dietaryGoal: "mindful eating",
    allergies: [],

    theme: {
      darkMode: false,
      accentColor: "#C86852"
    },

    privacy: {
      visibility: "private",
      showLocation: false,
      showMood: true
    },

    createdAt: now,
    updatedAt: now
  };

  profiles.push(profile);
  save();
  return profile;
}

// Update profile fields
export function updateProfile(
  userId: string,
  updates: Partial<Omit<UserProfile, "userId" | "createdAt">>
): UserProfile | undefined {
  const profile = getProfileByUserId(userId);
  if (!profile) return undefined;

  if (updates.handle !== undefined) profile.handle = updates.handle;
  if (updates.displayName !== undefined) profile.displayName = updates.displayName;
  if (updates.avatarUrl !== undefined) profile.avatarUrl = updates.avatarUrl;
  if (updates.bio !== undefined) profile.bio = updates.bio;
  if (updates.dietaryGoal !== undefined) profile.dietaryGoal = updates.dietaryGoal;
  if (updates.allergies !== undefined) profile.allergies = updates.allergies;

  if (updates.theme !== undefined) {
    profile.theme = {
      ...profile.theme,
      ...updates.theme
    };
  }

  if (updates.privacy !== undefined) {
    profile.privacy = {
      ...profile.privacy,
      ...updates.privacy
    };
  }

  profile.updatedAt = new Date().toISOString();
  save();
  return profile;
}
