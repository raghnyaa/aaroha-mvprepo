from fastapi import FastAPI, File, UploadFile, Query
from fastapi.responses import JSONResponse
from PIL import Image
import io
import base64
import time
import os
import json
from typing import List, Dict, Any, Tuple, Optional

from dotenv import load_dotenv
from openai import OpenAI

# ---------------- ENV ----------------
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
assert OPENAI_API_KEY is not None, "OPENAI_API_KEY not loaded"
client = OpenAI(api_key=OPENAI_API_KEY)

# ---------------- CONFIG ----------------
YOLO_WEIGHTS_PATH = "../ml-yolo/model-checkpoints/food-detector.pt"
YOLO_MODEL_VERSION = "food-detector.pt"
DEFAULT_CONF_THRESHOLD = 0.6

# Vision model (set in .env if you want)
# Recommended: gpt-4.1-mini (good + cheaper), or gpt-4o-mini
OPENAI_VISION_MODEL = os.getenv("OPENAI_VISION_MODEL", "gpt-4.1-mini")

yolo_model = None

# In-memory cache for dev (class-set -> last successful LLM meal_summary)
MEAL_SUMMARY_CACHE: Dict[str, Dict[str, Any]] = {}

# ---------------- YOLO ----------------
def load_yolo_model():
    global yolo_model
    if yolo_model is None:
        from ultralytics import YOLO
        yolo_model = YOLO(YOLO_WEIGHTS_PATH)
    return yolo_model


def run_yolo_on_image(image_pil, conf_threshold=DEFAULT_CONF_THRESHOLD):
    model = load_yolo_model()
    results = model.predict(source=image_pil, verbose=False)

    detections: List[Dict[str, Any]] = []
    r = results[0]
    boxes = r.boxes
    if boxes is None:
        return detections

    xyxy = boxes.xyxy.tolist()
    confs = boxes.conf.tolist()
    cls_ids = boxes.cls.tolist()
    names_map = r.names

    for i in range(len(cls_ids)):
        class_id = int(cls_ids[i])
        confidence = float(confs[i])
        class_name = names_map.get(class_id, f"class_{class_id}")

        detections.append({
            "class_id": class_id,
            "class_name": class_name,
            "confidence": confidence,
            "bbox": xyxy[i],
            "needs_llm": confidence < conf_threshold
        })

    return detections


def make_crops(image_pil, detections):
    crops = []
    for det in detections:
        x1, y1, x2, y2 = det["bbox"]
        crop_img = image_pil.crop((x1, y1, x2, y2))

        buf = io.BytesIO()
        crop_img.save(buf, format="JPEG")
        crop_b64 = base64.b64encode(buf.getvalue()).decode("utf-8")

        crops.append({
            "class_name": det["class_name"],
            "confidence": det["confidence"],
            "bbox": det["bbox"],
            "needs_llm": det["needs_llm"],
            "crop_b64_jpeg": crop_b64
        })
    return crops

# ---------------- PROMPTS ----------------
def build_yolo_hint_text(detections: List[Dict[str, Any]]) -> str:
    if not detections:
        return "YOLO found: (none)"
    lines = []
    for d in detections:
        lines.append(f"- {d['class_name']} (conf {d['confidence']:.2f})")
    return "YOLO found:\n" + "\n".join(lines)


def build_vision_prompt(detections: List[Dict[str, Any]]) -> str:
    yolo_hint = build_yolo_hint_text(detections)
    return f"""
You are Aaroha, a supportive food identification + reflection assistant.

TASK:
Identify what foods are visible in the IMAGE. YOLO is only a weak hint; trust the IMAGE more than YOLO.

{yolo_hint}

OUTPUT FORMAT (STRICT):
Return ONLY valid JSON. No markdown. No bullet points. No extra text.

JSON SCHEMA:
{{
  "foods_seen": [string],
  "meal_feel": "unknown" | "light" | "heavy" | "comforting" | "refreshing",
  "energy_level": "low" | "medium" | "high",
  "protein_comment": string,
  "fiber_comment": string,
  "balance_tip": string,
  "check_in_question": string,
  "summary_human": string
}}

RULES:
- "foods_seen" should be specific (e.g., "basmati rice", "masoor dal", "cilantro", "green chutney").
- If unsure, include your best guess and reflect uncertainty in "summary_human".
- Keep it kind and non-judgmental.
""".strip()


# ---------------- RULES FALLBACK ----------------
def build_rules_summary(detections: List[Dict[str, Any]]) -> Dict[str, Any]:
    foods = [d["class_name"] for d in detections] if detections else []
    return {
        "foods_seen": foods,
        "meal_feel": "unknown",
        "energy_level": "medium",
        "protein_comment": "Protein depends on what’s in the meal; YOLO may be uncertain here.",
        "fiber_comment": "Fiber depends on veggies/whole grains present.",
        "balance_tip": "If you want balance later, add something fresh or protein-forward.",
        "check_in_question": "How did your energy feel 30–60 minutes after this?",
        "summary_human": "I can’t fully confirm foods from YOLO alone — want me to try vision identification?"
    }

# ---------------- OPENAI VISION CALL (FUNCTION-CALLING, OLD-SDK SAFE) ----------------
MEAL_SUMMARY_TOOL = {
    "type": "function",
    "function": {
        "name": "meal_summary",
        "description": "Extract foods and a gentle reflection summary from a meal photo.",
        "parameters": {
            "type": "object",
            "additionalProperties": False,
            "properties": {
                "foods_seen": {"type": "array", "items": {"type": "string"}},
                "meal_feel": {"type": "string"},
                "energy_level": {"type": "string", "enum": ["light", "medium", "heavy"]},
                "protein_comment": {"type": "string"},
                "fiber_comment": {"type": "string"},
                "balance_tip": {"type": "string"},
                "check_in_question": {"type": "string"},
                "summary_human": {"type": "string"},
            },
            "required": [
                "foods_seen",
                "meal_feel",
                "energy_level",
                "protein_comment",
                "fiber_comment",
                "balance_tip",
                "check_in_question",
                "summary_human",
            ],
        },
    },
}
def extract_foods_from_text(text: str) -> List[str]:
    foods = []
    for line in text.splitlines():
        line = line.strip()
        if line.startswith("-"):
            foods.append(line.lstrip("-").strip())
    return foods


def call_openai_vision_meal_summary(image_bytes: bytes, detections: List[Dict[str, Any]]):
    prompt = build_vision_prompt(detections)
    b64 = base64.b64encode(image_bytes).decode("utf-8")

    try:
        resp = client.responses.create(
            model="gpt-4.1-mini",
            input=[
                {
                    "role": "user",
                    "content": [
                        {"type": "input_text", "text": prompt},
                        {
                            "type": "input_image",
                            "image_url": f"data:image/jpeg;base64,{b64}",
                        },
                    ],
                }
            ],
            temperature=0.3,
            store=True,  # <-- this is what makes it show up in Logs -> Responses
        )

        # Responses API returns output in a different shape than chat.completions.
        # The easiest way: take the first output_text we can find.
        raw_text = ""
        for item in resp.output:
            if item.type == "message":
                for c in item.content:
                    if c.type == "output_text":
                        raw_text += c.text

        raw_text = (raw_text or "").strip()

        try:
            parsed = json.loads(raw_text)
            return parsed, None, raw_text
        except json.JSONDecodeError:
             # Salvage foods from raw LLM text
            foods = extract_foods_from_text(raw_text)

            fallback = build_rules_summary(detections)

            if foods:
                fallback["foods_seen"] = foods
                fallback["summary_human"] = (
                "Identified foods directly from the image, even though formatting was off."
                    )
            else:
                fallback["summary_human"] = raw_text[:2000]

            return fallback, "json_parse_error", raw_text

    except Exception as e:
        return build_rules_summary(detections), f"{type(e).__name__}: {str(e)}", None


# ---------------- CACHE + ROUTING ----------------
def classset_cache_key(detections: List[Dict[str, Any]]) -> str:
    class_ids = sorted({int(d["class_id"]) for d in detections})
    return f"yolo:{YOLO_MODEL_VERSION}:classes={','.join(map(str, class_ids))}"


def should_call_llm(llm_mode: str, llm_needed: bool, cache_hit: bool) -> Tuple[bool, str]:
    """
    llm_mode:
      - mock: always call OpenAI (testing)
      - always: always call OpenAI
      - auto: call OpenAI if yolo uncertain OR cache miss
      - never: never call OpenAI
    """
    if llm_mode in ("mock", "always"):
        return True, "forced"
    if llm_mode == "never":
        return False, "disabled"
    # auto
    if cache_hit:
        return False, "cache_hit_skipped"
    if llm_needed:
        return True, "yolo_uncertain"
    return True, "cache_miss_learn_once"

# ---------------- FASTAPI ----------------
app = FastAPI()


@app.post("/analyze_meal")
async def analyze_meal(
    file: UploadFile = File(...),
    llm_mode: str = Query("auto", pattern="^(mock|always|auto|never)$"),
    include_crops: bool = Query(True),
    debug: bool = Query(True),
    conf_threshold: float = Query(DEFAULT_CONF_THRESHOLD, ge=0.0, le=1.0),
):
    image_bytes = await file.read()
    pil_img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    detections = run_yolo_on_image(pil_img, conf_threshold=conf_threshold)

    timestamp = int(time.time())

    # If YOLO found nothing, vision is usually best
    if not detections:
        if llm_mode == "never":
            return JSONResponse({
                "timestamp": timestamp,
                "llm_mode": llm_mode,
                "llm_called": True,
                "llm_reason": "no_detections",
                "meal_summary_source": "rules",
                "llm_error": None,
                "detections": [],
                "crops": [],
                "meal_summary": {
                    "foods_seen": [],
                    "meal_feel": "unknown",
                    "energy_level": "medium",
                    "protein_comment": "Not sure—tell me what you had.",
                    "fiber_comment": "Not sure—tell me what you had.",
                    "balance_tip": "If you want balance later, add something fresh or protein-forward.",
                    "check_in_question": "What did you eat here?",
                    "summary_human": "I couldn't detect foods with YOLO.",
                },
                "debug_prompt_sent_to_llm": None
            })

        meal_summary, llm_error, raw = call_openai_vision_meal_summary(image_bytes, [])
        return JSONResponse({
            "timestamp": timestamp,
            "llm_mode": llm_mode,
            "llm_called": llm_error is None,
            "llm_reason": "no_detections_vision",
            "meal_summary_source": "llm" if llm_error is None else "rules_fallback",
            "llm_error": llm_error,
            "detections": [],
            "crops": [],
            "meal_summary": meal_summary,
            "debug_prompt_sent_to_llm": build_vision_prompt([]) if debug else None,
            "debug_raw_llm_text": raw if debug else None,
        })

    llm_needed = any(d["needs_llm"] for d in detections)
    cache_key = classset_cache_key(detections)
    cache_hit = cache_key in MEAL_SUMMARY_CACHE

    call_llm, llm_reason = should_call_llm(llm_mode, llm_needed, cache_hit)

    llm_called = False
    llm_error: Optional[str] = None
    raw_llm_text: Optional[str] = None

    if llm_mode == "auto" and cache_hit and not call_llm:
        meal_summary = MEAL_SUMMARY_CACHE[cache_key]
        source = "cache"

    elif call_llm:
        meal_summary_llm, llm_error, raw_llm_text = call_openai_vision_meal_summary(image_bytes, detections)

        if llm_error is None:
            # IMPORTANT: use the LLM output (this fixes "sweet" staying in foods_seen)
            meal_summary = meal_summary_llm
            MEAL_SUMMARY_CACHE[cache_key] = meal_summary
            source = "llm"
            llm_called = True
        else:
            meal_summary = build_rules_summary(detections)
            source = "rules_fallback"

    else:
        meal_summary = build_rules_summary(detections)
        source = "rules"

    crops = make_crops(pil_img, detections) if include_crops else []
    debug_prompt = build_vision_prompt(detections) if debug else None

    return JSONResponse({
        "timestamp": timestamp,
        "llm_mode": llm_mode,
        "llm_called": llm_called,
        "llm_reason": llm_reason,
        "meal_summary_source": source,
        "llm_error": llm_error,
        "cache_key": cache_key,
        "cache_hit": cache_hit,
        "llm_needed": llm_needed,
        "detections": detections,
        "crops": crops,
        "meal_summary": meal_summary,
        "debug_prompt_sent_to_llm": debug_prompt,
        "debug_raw_llm_text": raw_llm_text if debug else None,
        "vision_model": OPENAI_VISION_MODEL,
    })
