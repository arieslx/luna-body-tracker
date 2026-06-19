"""Local JSON storage for the StickS3 MVP."""

try:
    import ujson as json
except ImportError:
    import json

from config import DATA_PATH, create_daily_log, normalize_daily_log


def load_today(date_key, path=DATA_PATH):
    try:
        with open(path, "r") as file:
            payload = json.loads(file.read())
    except (OSError, ValueError):
        return create_daily_log()

    if not isinstance(payload, dict):
        return create_daily_log()
    if payload.get("date") != date_key:
        return create_daily_log()
    return normalize_daily_log(payload.get("daily_log"))


def save_today(date_key, daily_log, path=DATA_PATH):
    payload = {
        "date": date_key,
        "daily_log": normalize_daily_log(daily_log),
    }
    with open(path, "w") as file:
        file.write(json.dumps(payload))
    return payload
