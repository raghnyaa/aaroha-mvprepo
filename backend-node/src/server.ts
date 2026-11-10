// backend-node/src/server.ts
import express from "express";
import cors from "cors";
import path from "path";
import authRouter from "./routes/auth.routes";
import mealsRouter from "./routes/meals.routes";

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
}));
app.use(express.json({ limit: "50mb" }));
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRouter);
app.use("/api/meals", mealsRouter);

app.listen(4000, () => console.log("Node API listening on http://127.0.0.1:4000"));
