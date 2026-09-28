"""Regenerates the WordPress plugin sample data from backend/seed_data.py (single source of truth).
Usage: python3 /app/scripts/export_wp_sample_data.py
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "backend"))

from seed_data import CITIES, GYMS, SPORTS  # noqa: E402

target = ROOT / "wordpress" / "smart-body-core" / "includes" / "sample-data.json"
target.write_text(json.dumps({"cities": CITIES, "sports": SPORTS, "gyms": GYMS}, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"Wrote {target}")
