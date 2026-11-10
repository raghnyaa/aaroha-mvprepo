import dotenv from "dotenv";
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
export const PORT = process.env.PORT || 4000;
