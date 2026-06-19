"""Compact JSON export for the StickS3 QR screen."""

try:
    import ujson as json
except ImportError:
    import json

from config import SOURCE_ID, normalize_daily_log


def create_export_payload(date_key, daily_log):
    log = normalize_daily_log(daily_log)
    return {
        "source": SOURCE_ID,
        "date": date_key,
        "water": log["water"],
        "food": log["food"],
        "exercise": log["exercise"],
        "mood": log["mood"],
    }


def compact_export_json(date_key, daily_log):
    payload = create_export_payload(date_key, daily_log)
    try:
        return json.dumps(payload, separators=(",", ":"))
    except TypeError:
        # MicroPython ujson does not support the separators argument.
        return json.dumps(payload).replace(", ", ",").replace(": ", ":")
