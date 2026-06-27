"""Local JSON storage for Yun Tracker StickS3."""

try:
    import ujson as json
except ImportError:
    import json

from config import DATA_PATH
from state import create_daily_log, normalize_daily_log


def load_today(date_key, path=DATA_PATH):
    try:
        with open(path, "r") as handle:
            payload = json.loads(handle.read())
    except OSError:
        return create_daily_log()
    except ValueError:
        return create_daily_log()

    if payload.get("date") != date_key:
        fresh = create_daily_log()
        fresh["seen_intro"] = bool(payload.get("daily_log", {}).get("seen_intro"))
        return fresh
    return normalize_daily_log(payload.get("daily_log"))


def save_today(date_key, daily_log, path=DATA_PATH):
    payload = {
        "date": date_key,
        "daily_log": normalize_daily_log(daily_log),
    }
    with open(path, "w") as handle:
        handle.write(json.dumps(payload))
    return payload
