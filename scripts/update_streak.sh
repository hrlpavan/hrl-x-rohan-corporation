#!/usr/bin/env bash
set -e

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_DIR"

echo "=================================================================="
echo "⚡ Updating GitHub Engineering Contribution Streak"
echo "=================================================================="

# Update .streak metadata with current timestamp
python3 -c '
import json
import os
from datetime import datetime

streak_file = ".streak"
now_date = datetime.now().strftime("%Y-%m-%d")
now_time = datetime.now().strftime("%H:%M:%S IST")

data = {
    "developer": "hrlpavan",
    "email": "hrlinternationalprivatelimited@gmail.com",
    "repository": "hrlpavan/hrl-x-rohan-corporation",
    "current_streak_days": 3,
    "last_contribution_date": now_date,
    "last_contribution_time": now_time,
    "status": "active"
}
if os.path.exists(streak_file):
    try:
        with open(streak_file, "r") as f:
            old = json.load(f)
            data["current_streak_days"] = old.get("current_streak_days", 3)
    except Exception:
        pass

with open(streak_file, "w") as f:
    json.dump(data, f, indent=2)
print(f"Recorded streak update for {now_date} at {now_time}")
'

# Trigger auto-push with custom streak commit message
bash scripts/auto_push.sh "chore(streak): advance daily engineering contribution streak [$(date '+%Y-%m-%d %H:%M')]"
