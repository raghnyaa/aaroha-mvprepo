export interface User {
  id: string;
  email: string;
  passwordHash: string | null; // null if OAuth user
  handle: string;              // @name in community
  createdAt: string;
}
