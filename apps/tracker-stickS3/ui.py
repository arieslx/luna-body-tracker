"""UI rendering scaffold for the StickS3 MVP.

The functions here draw through a tiny display adapter interface:

- image(path, x, y)
- fill_rect(x, y, w, h, color)
- text(text, x, y, color=None, background=None)
- optional qr(data, x, y, size)

This keeps the MVP layout testable before binding to UiFlow2's concrete LCD API.
"""

from config import (
    BACKGROUND_DAY,
    BACKGROUND_NIGHT,
    DEFAULT_DAY_SPRITE,
    DEFAULT_NIGHT_SPRITE,
    DISPLAY_HEIGHT,
    DISPLAY_WIDTH,
    TOOLS,
    TOOL_FOOD,
    TOOL_SPIRIT,
    TOOL_TRAIN,
    asset_path,
)


COLOR_INK = 0x1D1F21
COLOR_PAPER = 0xFFFFFF
COLOR_DAY_TEXT = 0x1D1F21
COLOR_NIGHT_TEXT = 0xEDE9FF
COLOR_DAY_HIGHLIGHT = 0xF6D365
COLOR_NIGHT_HIGHLIGHT = 0x7EA0FF

TOP_BAR_HEIGHT = 18
TOOLBAR_Y = 200
TOOLBAR_HEIGHT = 24
STATUS_Y = 226
STATUS_HEIGHT = 14
CENTER_SPRITE_WIDTH = 110
CENTER_SPRITE_HEIGHT = 160
CENTER_SPRITE_X = (DISPLAY_WIDTH - CENTER_SPRITE_WIDTH) // 2
CENTER_SPRITE_Y = 30


class DisplayRecorder:
    """Desktop-only display adapter used for scaffold checks."""

    def __init__(self):
        self.operations = []

    def image(self, path, x, y):
        self.operations.append(("image", path, x, y))

    def fill_rect(self, x, y, w, h, color):
        self.operations.append(("fill_rect", x, y, w, h, color))

    def text(self, text, x, y, color=None, background=None):
        self.operations.append(("text", text, x, y, color, background))

    def qr(self, data, x, y, size):
        self.operations.append(("qr", data, x, y, size))


def default_sprite(is_night):
    if is_night:
        return DEFAULT_NIGHT_SPRITE
    return DEFAULT_DAY_SPRITE


def background_sprite(is_night):
    if is_night:
        return BACKGROUND_NIGHT
    return BACKGROUND_DAY


def render_home(display, active_tool_index=0, center_sprite=None, status="", time_text="--:--", is_night=False):
    """Render the full MVP home screen."""

    if center_sprite is None:
        center_sprite = default_sprite(is_night)

    display.image(asset_path(background_sprite(is_night)), 0, 0)
    display.image(asset_path(center_sprite), CENTER_SPRITE_X, CENTER_SPRITE_Y)
    render_top_bar(display, time_text, is_night)
    render_toolbar(display, active_tool_index, is_night)
    render_status(display, status, is_night)


def render_top_bar(display, time_text, is_night):
    label = "NITE" if is_night else "DAY"
    color = COLOR_NIGHT_TEXT if is_night else COLOR_DAY_TEXT
    display.text(time_text, 4, 4, color=color)
    display.text(label, 100, 4, color=color)


def render_toolbar(display, active_tool_index, is_night):
    color = COLOR_NIGHT_TEXT if is_night else COLOR_DAY_TEXT
    highlight = COLOR_NIGHT_HIGHLIGHT if is_night else COLOR_DAY_HIGHLIGHT
    slot_width = DISPLAY_WIDTH // len(TOOLS)

    for index, label in enumerate(TOOLS):
        x = index * slot_width
        selected = index == active_tool_index
        if selected:
            display.fill_rect(x + 1, TOOLBAR_Y, slot_width - 2, TOOLBAR_HEIGHT, highlight)
        text_x = x + 6
        if label == "QR":
            text_x = x + 3
        display.text(label, text_x, TOOLBAR_Y + 7, color=color, background=highlight if selected else None)


def render_status(display, status, is_night):
    color = COLOR_NIGHT_TEXT if is_night else COLOR_DAY_TEXT
    if status:
        display.text(status[:18], 4, STATUS_Y, color=color)


def render_choice(display, tool, value, center_sprite=None, time_text="--:--", is_night=False):
    display.image(asset_path(background_sprite(is_night)), 0, 0)
    if center_sprite:
        display.image(asset_path(center_sprite), CENTER_SPRITE_X, CENTER_SPRITE_Y)
    render_top_bar(display, time_text, is_night)
    color = COLOR_NIGHT_TEXT if is_night else COLOR_DAY_TEXT
    title = choice_title(tool)
    display.text(title, 4, 28, color=color)
    display.text(str(value)[:18], 4, 52, color=color)
    display.text("B NEXT", 4, 198, color=color)
    display.text("A OK", 4, 216, color=color)


def render_qr_export(display, payload_json, time_text="--:--", is_night=False):
    """Render a temporary export screen."""

    display.image(asset_path(background_sprite(is_night)), 0, 0)
    render_top_bar(display, time_text, is_night)
    color = COLOR_NIGHT_TEXT if is_night else COLOR_DAY_TEXT
    display.text("EXPORT", 4, 24, color=color)
    if hasattr(display, "qr"):
        display.qr(payload_json, 18, 52, 100)
    else:
        display.text(payload_json[:18], 4, 58, color=color)
        display.text(payload_json[18:36], 4, 76, color=color)
        display.text(payload_json[36:54], 4, 94, color=color)
        display.text(payload_json[54:72], 4, 112, color=color)
        display.text(payload_json[72:90], 4, 130, color=color)
        display.text(payload_json[90:108], 4, 148, color=color)
    display.text("A/B BACK", 4, STATUS_Y, color=color)


def choice_title(tool):
    if tool == TOOL_FOOD:
        return "FOOD"
    if tool == TOOL_TRAIN:
        return "TRAIN"
    if tool == TOOL_SPIRIT:
        return "SPIRIT"
    return "PICK"
