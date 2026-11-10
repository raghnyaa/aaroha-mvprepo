import { Request, Response } from "express";
import { AuthedRequest } from "../middleware/authRequired";
import {
  createMealForUser,
  getLatestMealForUser,
} from "../lib/mealsStore";
import { getUserById } from "../lib/usersStore";

import fs from "fs";
import path from "path";
import { spawn } from "child_process";

// POST /meals
export function createMeal(req: AuthedRequest, res: Response) {
  console.log("[createMeal] body keys:", Object.keys(req.body));

  if (!req.userId) {
    return res.status(401).json({ error: "unauthorized" });
  }

  // make sure the user actually exists
  const user = getUserById(req.userId);
  if (!user) {
    return res.status(404).json({ error: "user not found" });
  }

  const {
    description,
    notes,
    moods,
    portion,
    photo,
    timestampMeal,
  } = req.body;

  if (!description) {
    return res.status(400).json({ error: "description is required" });
  }

  // convert portion string -> satietyLevel number
  let satietyLevel: number | null = null;
  if (portion === "light") satietyLevel = 1;
  else if (portion === "normal") satietyLevel = 2;
  else if (portion === "heavy") satietyLevel = 3;

  const meal = createMealForUser(req.userId, {
    caption: description,
    notes: notes ?? null,
    moodTags: Array.isArray(moods) ? moods : [],
    satietyLevel,
    locationText: null,
    visibility: "private",
    imageUrl: photo ?? null,
    timestampMeal: timestampMeal ?? new Date().toISOString(),
  });

  return res.status(201).json(meal);
}

// GET /meals/latest
export function getLatestMeal(req: AuthedRequest, res: Response) {
  if (!req.userId) {
    return res.status(401).json({ error: "unauthorized" });
  }

  const meal = getLatestMealForUser(req.userId);
  return res.status(200).json(meal ?? null);
}

/**
 * POST /api/meals/analyze
 * expects multipart/form-data with field "file"
 * runs ml-yolo/detect.py and returns its JSON (read from a file)
 */
export function analyzeMeal(req: Request, res: Response) {
  const uploaded = (req as any).file;
  if (!uploaded) {
    return res.status(400).json({ error: "no file uploaded" });
  }

  // multer saved something like: uploads/<randomid>
  const tmpPath = path.resolve(uploaded.path);

  // grab extension from original filename, or default to .jpg
  const ext = path.extname(uploaded.originalname || "") || ".jpg";

  // rename to have a proper image extension so Ultralytics sees it
  const imagePath = tmpPath + ext;

  try {
    fs.renameSync(tmpPath, imagePath);
  } catch (err) {
    console.error("[analyzeMeal] rename failed:", err);
    return res.status(500).json({ error: "failed to prepare image file" });
  }

  const detectScript = path.resolve(
    __dirname,
    "../../../ml-yolo/detect.py"
  );

  const pythonBin = path.resolve(
    __dirname,
    "../../../ml-yolo/aaroha-env/bin/python"
  );

  // where detect.py will write its JSON
  const outPath = imagePath + ".json";

  const py = spawn(
    pythonBin,
    [detectScript, "--source", imagePath, "--out", outPath],
    {
      env: {
        ...process.env,
      },
    }
  );

  let stderr = "";

  py.stderr.on("data", (data) => {
    stderr += data.toString();
    console.error("[detect.py stderr]", data.toString());
  });

  py.on("close", (code) => {
    // cleanup image file
    fs.unlink(imagePath, () => {});

    if (code !== 0) {
      console.error("[analyzeMeal] detect.py exited with code", code);
      return res.status(500).json({
        error: "vision detection failed",
        details: stderr,
      });
    }

    // read JSON from file
    let parsed: any;
    try {
      const jsonText = fs.readFileSync(outPath, "utf-8");
      console.log("[analyzeMeal] JSON file contents:\n", jsonText);
      parsed = JSON.parse(jsonText);
    } catch (err) {
      console.error("[analyzeMeal] failed to read/parse JSON file:", err);
      return res.status(500).json({ error: "invalid ML output" });
    } finally {
      // cleanup JSON file
      fs.unlink(outPath, () => {});
    }

    const first = parsed[0] || null;
    const hasFood = !!(first && first.num_detections > 0);
    const foodRegion = first?.food_region ?? null;
    const detections = first?.detections ?? [];

    return res.status(200).json({
      hasFood,
      foodRegion,
      detections,
      raw: first,
    });
  });
}
