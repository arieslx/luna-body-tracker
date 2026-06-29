"""Configuration for Yun Tracker StickS3.

Keep this module hardware-free so it can be imported by desktop Python and
UiFlow2 MicroPython.
"""

from config_text_en import BUBBLE_TEXT, COMPLETION_COPY, ORACLE_LINES, RANDOM_ORACLE_LINES
from config_text_zh import BUBBLE_CN_TEXT, COMPLETION_CN_COPY, INTRO_PAGES

DISPLAY_WIDTH = 135
DISPLAY_HEIGHT = 240
USE_CANVAS_BUFFER = True

ASSET_DIR = "/flash/yun-res"
DATA_PATH = "/flash/yun_daily.json"

TIMEZONE_OFFSET_SECONDS = 8 * 60 * 60
NTP_HOSTS = ("ntp.aliyun.com", "pool.ntp.org")
NETWORK_CONNECT_TIMEOUT_SECONDS = 10

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
    "oracle_lan",
)

NON_RECORD_ENTRANCES = ("oracle_lan",)
RANDOM_ORACLE_ENTRANCE = "oracle_lan"

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
    "oracle_lan": "lan_oracle_2.png",
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

ORACLE_SUMMARY_IMAGE = "oracle.png"
ORACLE_STAND_IMAGE = "oracle_stand_lan.png"

LAN_FRAMES = {
    "mood": ("lan_mood_0.png", "lan_mood_1.png", "lan_mood_2.png"),
    "stress": ("lan_walk_0.png", "lan_walk_1.png"),
    "poop": ("lan_poop_0.png", "lan_poop_1.png", "lan_poop_2.png"),
    "food": ("lan_food_0.png", "lan_food_1.png"),
    "water": ("lan_water_0.png", "lan_water_1.png"),
    "sleep": ("lan_sleep_0.png", "lan_sleep_1.png"),
    "sport": ("lan_sport_0.png", "lan_sport_1.png", "lan_sport_2.png"),
    "oracle": ("lan_oracle_0.png", "lan_oracle_1.png", "lan_oracle_2.png"),
}

HOME_LAN_FRAMES = ("lan_stand_0.png", "lan_stand_1.png")

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

ICON_POSITIONS = {
    "mood": (8, 8),
    "stress": (40, 8),
    "poop": (72, 8),
    "food": (104, 8),
    "water": (8, 212),
    "sleep": (40, 212),
    "sport": (72, 212),
    "oracle": (104, 212),
    "oracle_lan": (60, 164),
}

ICON_SIZES = {
    "oracle_lan": (48, 48),
}

LAN_POSITION = {
    "mood": (37, 83),
    "stress": (38, 90),
    "poop": (45, 128),
    "food": (46, 126),
    "water": (45, 126),
    "sleep": (62, 90),
    "sport": (52, 124),
    "oracle": (42, 126),
}

HOME_LAN_POSITION = (50, 90)
LAN_DIRTY_SIZE = 48

BUBBLE_POSITION = {
    "bubble_left.png": (2, 42),
    "bubble_right.png": (50, 42),
}

COMPLETE_MS = 1800
FRAME_MS = 1400
ACTION_MS = 2400
ACTION_FRAME_MS = 850

HOME_SLOT_BG = 0xF6D7BE
HOME_SLOT_HIGHLIGHT = 0xFFF1C7
OPTION_SELECTED_MARK = "* "
PIXEL_TEXT_COLOR = 0x4F3F4A
PIXEL_TEXT_BOLD = True
PIXEL_TEXT_ADVANCE = 8
BUBBLE_LABEL_BG = 0xFFFBE5
CN_TEXT_COLOR = 0x4F3F4A
CN_TEXT_BG = 0xFFFBE5
TOP_TEXT_Y = 4
TOP_TEXT_LINE_HEIGHT = 24
TOP_TEXT_CLEAR_HEIGHT = 82
COMPLETION_TEXT_CLEAR_HEIGHT = 106
TOP_TEXT_MAX_WIDTH = 128


def asset_path(filename):
    return "{}/{}".format(ASSET_DIR.rstrip("/"), filename)


def option_keys(entrance):
    value = BUBBLE_TEXT.get(entrance)
    if isinstance(value, dict):
        return tuple(value.keys())
    return ()
