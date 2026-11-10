export interface UserProfile {
  userId: string; // matches the auth user's id

  handle: string;          // @handle for community
  displayName: string;     // pretty name
  avatarUrl: string | null;

  bio: string;

  dietaryGoal: string;     // "mindful eating", "muscle gain", etc.
  allergies: string[];     // ["peanut", "dairy"]

  theme: {
    darkMode: boolean;
    accentColor: string;   // hex or token like "#C86852"
  };

  privacy: {
    visibility: "public" | "friends_only" | "private"; // who can see meals in feed
    showLocation: boolean;
    showMood: boolean;
  };

  createdAt: string;
  updatedAt: string;
}
