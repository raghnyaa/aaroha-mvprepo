#!/usr/bin/env python3
"""
Simple YOLOv8 detection script for Aaroha.

Usage examples:

python detect.py --source path/to/image.jpg
python detect.py --source path/to/folder --conf 0.4 --nosave
"""

from pathlib import Path
import argparse
import json
import sys

from ultralytics import YOLO


def load_model(weights_path: str) -> YOLO:
    weights = Path(weights_path)
    if not weights.exists():
        raise FileNotFoundError(
            f"Could not find weights at {weights.resolve()}. "
            "Update --weights to point to your best.pt path."
        )
    return YOLO(str(weights))


def run_inference(model: YOLO, source: str, save: bool, conf: float):
    """
    Run inference on a source (image / folder / video).

    Returns a list of per-image detection summaries.
    """
    # verbose=False keeps Ultralytics from spamming too much, but
    # for safety we won't rely on stdout at all in the Node side.
    results = model(source, conf=conf, save=save, verbose=False)

    summaries = []
    for r in results:
        image_path = str(r.path)
        detections = []

        for box in r.boxes:
            xyxy = box.xyxy[0].tolist()  # [x1, y1, x2, y2]
            cls_id = int(box.cls[0].item())
            score = float(box.conf[0].item())

            label = model.names[cls_id] if model.names and cls_id in model.names else str(cls_id)

            detections.append(
                {
                    "class_id": cls_id,
                    "label": label,
                    "confidence": score,
                    "bbox_xyxy": xyxy,
                }
            )

        # combined food_region bbox
        if detections:
            xs1 = [d["bbox_xyxy"][0] for d in detections]
            ys1 = [d["bbox_xyxy"][1] for d in detections]
            xs2 = [d["bbox_xyxy"][2] for d in detections]
            ys2 = [d["bbox_xyxy"][3] for d in detections]

            combined_bbox = [min(xs1), min(ys1), max(xs2), max(ys2)]
        else:
            combined_bbox = None

        summaries.append(
            {
                "image": image_path,
                "num_detections": len(detections),
                "detections": detections,
                "food_region": combined_bbox,
            }
        )

    return summaries


def main():
    parser = argparse.ArgumentParser(description="YOLOv8 detection for Aaroha.")
    parser.add_argument(
        "--weights",
        type=str,
        default="/Users/raghnyavalluru/Desktop/Aaroha/runs/detect/train5/weights/best.pt",
        help="Path to trained model weights (e.g. runs/detect/trainX/weights/best.pt)",
    )
    parser.add_argument(
        "--source",
        type=str,
        required=True,
        help="Image / directory / video path. Same as Ultralytics CLI.",
    )
    parser.add_argument(
        "--conf",
        type=float,
        default=0.5,
        help="Confidence threshold.",
    )
    parser.add_argument(
        "--nosave",
        action="store_true",
        help="Do not save annotated images, just run detection.",
    )
    parser.add_argument(
        "--out",
        type=str,
        default=None,
        help="If provided, write JSON summaries to this file path.",
    )

    args = parser.parse_args()

    model = load_model(args.weights)

    summaries = run_inference(
        model=model,
        source=args.source,
        save=not args.nosave,
        conf=args.conf,
    )

    # Always write JSON to file if --out is given
    json_str = json.dumps(summaries, indent=2)

    if args.out:
        out_path = Path(args.out)
        out_path.write_text(json_str, encoding="utf-8")

    # For CLI use, also print a short human summary to stderr
    print(f"Processed source: {args.source}", file=sys.stderr)
    print(f"Detections count (first image): {summaries[0]['num_detections'] if summaries else 0}", file=sys.stderr)


if __name__ == "__main__":
    main()
