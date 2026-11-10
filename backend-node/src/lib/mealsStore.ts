import fs from "fs";
import { randomUUID } from "crypto";
import { MealEntry } from "../types/meal";

const FILE_PATH = "./data/meals.json";

// In-memory cache of meals
let meals: MealEntry[] = [];

// Try to load meals from disk on startup
if (fs.existsSync(FILE_PATH)) {
  try {
    const raw = fs.readFileSync(FILE_PATH, "utf-8");
    meals = JSON.parse(raw);
  } catch (err) {
    console.error("[mealsStore] failed to parse meals.json, starting empty", err);
    meals = [];
  }
} else {
  // ensure data dir at least exists
  try {
    fs.mkdirSync("./data", { recursive: true });
  } catch (e) {
    // ignore mkdir race
  }
}

// helper: persist to disk
function save() {
  fs.writeFileSync(FILE_PATH, JSON.stringify(meals, null, 2));
}

/**
 * createMealForUser
 *
 * This is called when the frontend logs a meal.
 * We take the info from the request body and build a MealEntry.
 *
 * @param userId string
 * @param data   details of the meal
 */
export function createMealForUser(
  userId: string,
  data: {
    caption?: string;                   // description of meal (user typed "chana masala + rice")
    notes?: string | null;              // user's reflection / notes
    moodTags?: string[];                // ["calm","comforting",...]
    satietyLevel?: number | null;       // 1=light,2=normal,3=heavy
    locationText?: string | null;       // future (not used yet)
    visibility?: "private" | "friends_only" | "public";
    imageUrl?: string | null;           // base64 data URL for now
    timestampMeal?: string;             // ISO of when the meal was eaten
  }
): MealEntry {
  const now = new Date().toISOString();

  const entry: MealEntry = {
    id: randomUUID(),
    userId,

    caption: data.caption ?? "",
    notes: data.notes ?? null,

    moodTags: data.moodTags ?? [],
    satietyLevel: data.satietyLevel ?? null,
    locationText: data.locationText ?? null,
    visibility: data.visibility ?? "private",

    imageUrl: data.imageUrl ?? null,

    // AI / analysis placeholders (future)
    dishName: null,
    aiNotes: {
      recipe_estimate: null,
      health_facts: null,
      suggestions_for_goal: null,
    },
    macrosGuess: {
      carbs_g: null,
      protein_g: null,
      fat_g: null,
      fiber_g: null,
    },

    // timestamps
    timestampMeal: data.timestampMeal ?? now, // "when I ate"
    createdAt: now,                           // "when I logged"
  };

  meals.push(entry);
  save();
  return entry;
}

/**
 * getLatestMealForUser
 *
 * Returns that user's most recent meal (based on createdAt).
 * We'll turn this into "get all meals" later, but for MVP it's enough
 * to return the most recent so the dashboard isn't empty.
 */
export function getLatestMealForUser(userId: string): MealEntry | undefined {
  const userMeals = meals
    .filter((m) => m.userId === userId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );

  return userMeals[0];
}

/**
 * getAllMealsForUser
 *
 * If you want the full feed instead of just latest.
 * Not strictly required for MVP, but nice to have.
 */
export function getAllMealsForUser(userId: string): MealEntry[] {
  return meals
    .filter((m) => m.userId === userId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );
}
