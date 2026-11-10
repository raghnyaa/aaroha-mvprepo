import { User } from "../types/user";
import { randomUUID } from "crypto";
import fs from "fs";

const FILE_PATH = "./data/users.json";

// In-memory list of users loaded from disk
let users: User[] = [];

// 1. Load from disk on startup
if (fs.existsSync(FILE_PATH)) {
  try {
    const raw = fs.readFileSync(FILE_PATH, "utf-8");
    users = JSON.parse(raw);
  } catch (err) {
    console.error("[userStore] failed to parse users.json, starting empty", err);
    users = [];
  }
}

// 2. Save helper
function save() {
  fs.writeFileSync(FILE_PATH, JSON.stringify(users, null, 2));
}

// Create a new user
export function createUser(email: string, passwordHash: string): User {
  const handle = "user" + users.length; // simple default handle
  const newUser: User = {
    id: randomUUID(),
    email,
    passwordHash,
    handle,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  save();
  return newUser;
}

// Lookup by email
export function getUserByEmail(email: string): User | undefined {
  return users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
}

// Lookup by id
export function getUserById(id: string): User | undefined {
  return users.find((u) => u.id === id);
}
