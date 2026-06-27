"""Configuration for Yun Tracker StickS3.

Keep this module hardware-free so it can be imported by desktop Python and
UiFlow2 MicroPython.
"""

DISPLAY_WIDTH = 135
DISPLAY_HEIGHT = 240

ASSET_DIR = "/flash/yun-res"
DATA_PATH = "/flash/yun_daily.json"

BACKGROUND_DAY = "day.png"
BACKGROUND_NIGHT = "night.png"
BACKGROUND_DAY_SOFT = "day_bg.png"
BACKGROUND_NIGHT_SOFT = "night_bg.png"

ENTRANCES = (
    "mood",
    "stress",
    "poop",
    "food",
    "water",
    "sleep",
    "sport",
    "oracle",
)

TOP_ENTRANCES = ("mood", "stress", "poop", "food")
BOTTOM_ENTRANCES = ("water", "sleep", "sport", "oracle")

ICONS = {
    "mood": "icon_mood.png",
    "stress": "icon_stress.png",
    "poop": "icon_poop.png",
    "food": "icon_food.png",
    "water": "icon_water.png",
    "sleep": "icon_sleep.png",
    "sport": "icon_sport.png",
    "oracle": "icon_oracle.png",
}

PLATFORMS = {
    "mood": "platform_mood.png",
    "stress": "platform_mood.png",
    "poop": "platform_poop.png",
    "food": "platform_food.png",
    "water": "platform_food.png",
    "sleep": "platform_sleep.png",
    "sport": "platform_sport.png",
    "oracle": "platform_oracle.png",
}

LAN_FRAMES = {
    "mood": ("lan_mood_0.png", "lan_mood_1.png", "lan_mood_2.png"),
    "stress": ("lan_mood_0.png", "lan_mood_1.png", "lan_mood_2.png"),
    "poop": ("lan_poop_0.png", "lan_poop_1.png", "lan_poop_2.png"),
    "food": ("lan_food_0.png", "lan_food_1.png"),
    "water": ("lan_water_0.png", "lan_water_1.png"),
    "sleep": ("lan_sleep_0.png", "lan_sleep_1.png"),
    "sport": ("lan_sport_0.png", "lan_sport_1.png", "lan_sport_2.png"),
    "oracle": ("lan_oracle_0.png", "lan_oracle_1.png", "lan_oracle_2.png"),
}

BUBBLES = {
    "mood": "bubble_left.png",
    "stress": "bubble_left.png",
    "poop": "bubble_right.png",
    "food": "bubble_right.png",
    "water": "bubble_right.png",
    "sleep": "bubble_left.png",
    "sport": "bubble_right.png",
    "oracle": "bubble_right.png",
}

BUBBLE_TEXT = {
    "mood": ("SUN", ""),
    "stress": ("BREATHE", ""),
    "poop": ("SOIL", ""),
    "food": ("CAKE", ""),
    "water": ("DEW", ""),
    "sleep": ("SLEEP", ""),
    "sport": ("LEAF", ""),
    "oracle": ("ASK", ""),
}

COMPLETION_COPY = {
    "mood": ("Lan got sun", "Mood returns"),
    "stress": ("A breath loosened", "No fight today"),
    "poop": ("Field is loose", "Body feels light"),
    "food": ("Cake is eaten", "You cared for self"),
    "water": ("Dew is drunk", "Fate feels softer"),
    "sleep": ("Lan rests above", "Big things can wait"),
    "sport": ("Fate leaf trimmed", "Your body moved"),
    "oracle": ("Oracle says", "Today is okay"),
}

INTRO_PAGES = (
    ("你来啦", "这里是", "安得台"),
    ("屏幕里的兰", "便是", "今日的你"),
    ("吃饭喝水", "松口气", "睡一觉"),
    ("这些小事", "顺手记下", "便好"),
    ("兰会替你", "慢慢过完", "这一日"),
)

ORACLE_LINES = (
    "TODAY OK",
    "NO FIGHT",
    "GO SLOW",
    "SELF CARE",
    "SMALL COUNTS",
)

ICON_POSITIONS = {
    "mood": (8, 8),
    "stress": (40, 8),
    "poop": (72, 8),
    "food": (104, 8),
    "water": (8, 212),
    "sleep": (40, 212),
    "sport": (72, 212),
    "oracle": (104, 212),
}

LAN_POSITION = {
    "mood": (23, 74),
    "stress": (23, 74),
    "poop": (45, 128),
    "food": (46, 126),
    "water": (45, 126),
    "sleep": (42, 130),
    "sport": (52, 124),
    "oracle": (48, 126),
}

LAN_DIRTY_SIZE = 48

BUBBLE_POSITION = {
    "bubble_left.png": (2, 42),
    "bubble_right.png": (50, 42),
}

COMPLETE_MS = 1800
FRAME_MS = 650
ACTION_MS = 1500
ACTION_FRAME_MS = 500

HOME_SLOT_BG = 0xF6D7BE
HOME_SLOT_HIGHLIGHT = 0xFFF1C7


def asset_path(filename):
    return "{}/{}".format(ASSET_DIR.rstrip("/"), filename)
