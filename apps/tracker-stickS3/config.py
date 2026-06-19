"""Configuration for the StickS3 Tree Hole Tamagotchi MVP.

This module intentionally avoids hardware imports so it can be loaded in
MicroPython and desktop Python during early development.
"""

DISPLAY_WIDTH = 135
DISPLAY_HEIGHT = 240

SOURCE_ID = "m5stack-sticks3-tree"
ASSET_DIR = "/flash/res"
DATA_PATH = "/flash/luna_tree_daily.json"

BACKGROUND_DAY = "day.png"
BACKGROUND_NIGHT = "night.png"
DEFAULT_DAY_SPRITE = "calm.png"
DEFAULT_NIGHT_SPRITE = "sleep.png"

TOOL_WATER = "W"
TOOL_FOOD = "F"
TOOL_TRAIN = "T"
TOOL_SPIRIT = "S"
TOOL_EXPORT = "QR"

TOOLS = (
    TOOL_WATER,
    TOOL_FOOD,
    TOOL_TRAIN,
    TOOL_SPIRIT,
    TOOL_EXPORT,
)

TOOL_NAMES = {
    TOOL_WATER: "water",
    TOOL_FOOD: "food",
    TOOL_TRAIN: "train",
    TOOL_SPIRIT: "spirit",
    TOOL_EXPORT: "export",
}

FOOD_STATES = ("None", "protein", "vegetable", "staple")
FOOD_SPRITES = {
    "protein": "chicken.png",
    "vegetable": "vegetable.png",
    "staple": "rice.png",
}

EXERCISE_STATES = ("None", "aerobic", "anaerobic", "swim", "bike")
EXERCISE_SPRITES = {
    "aerobic": "aerobic.png",
    "anaerobic": "anaerobic.png",
    "swim": "swim.png",
    "bike": "bike.png",
}

MOOD_STATES = ("calm", "laugh", "cry", "angry", "tired", "emo")
MOOD_SPRITES = {
    "calm": "calm.png",
    "laugh": "laugh.png",
    "cry": "cry.png",
    "angry": "angry.png",
    "tired": "tired.png",
    "emo": "emo.png",
}


def asset_path(filename):
    return "{}/{}".format(ASSET_DIR.rstrip("/"), filename)


def create_daily_log():
    return {
        "water": 0,
        "food": "None",
        "exercise": "None",
        "mood": "calm",
    }


def normalize_daily_log(value):
    raw = value if isinstance(value, dict) else {}
    log = create_daily_log()
    if isinstance(raw.get("water"), int) and raw.get("water") >= 0:
        log["water"] = raw.get("water")
    if raw.get("food") in FOOD_STATES:
        log["food"] = raw.get("food")
    if raw.get("exercise") in EXERCISE_STATES:
        log["exercise"] = raw.get("exercise")
    if raw.get("mood") in MOOD_STATES:
        log["mood"] = raw.get("mood")
    return log
