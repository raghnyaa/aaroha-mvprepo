export interface MealEntry {
  id: string;
  userId: string;

  // --- User Input ---
  caption: string;               // e.g., "Chana masala + rice"
  notes: string | null;          // e.g., "Felt full but grounded"
  moodTags: string[];            // e.g., ["calm", "comforting"]
  satietyLevel: number | null;   // 1 = light, 2 = normal, 3 = heavy
  locationText: string | null;   // optional, for future
  visibility: "private" | "friends_only" | "public";

  // --- Media ---
  imageUrl: string | null;       // base64 data URL for now (later: S3 link)

  // --- AI / Analysis Fields (future expansion) ---
  dishName: string | null;
  aiNotes: {
    recipe_estimate: string | null;
    health_facts: string | null;
    suggestions_for_goal: string | null;
  };
  macrosGuess: {
    carbs_g: number | null;
    protein_g: number | null;
    fat_g: number | null;
    fiber_g: number | null;
  };

  // --- Timestamps ---
  timestampMeal: string;         // ISO when user ate (or logged)
  createdAt: string;             // ISO when entry created
}
