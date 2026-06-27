"""Renderers for Yun Tracker StickS3."""

from config import (
    BACKGROUND_DAY,
    BACKGROUND_DAY_SOFT,
    BACKGROUND_NIGHT,
    BACKGROUND_NIGHT_SOFT,
    BUBBLE_POSITION,
    BUBBLE_TEXT,
    BUBBLES,
    COMPLETION_COPY,
    DISPLAY_WIDTH,
    HOME_SLOT_BG,
    HOME_SLOT_HIGHLIGHT,
    ICON_POSITIONS,
    ICONS,
    INTRO_PAGES,
    LAN_DIRTY_SIZE,
    LAN_FRAMES,
    LAN_POSITION,
    ORACLE_LINES,
    PLATFORMS,
    asset_path,
)


class DisplayRecorder:
    def __init__(self):
        self.operations = []

    def image(self, path, x, y):
        self.operations.append(("image", path, x, y))

    def image_crop(self, path, x, y, w, h, offset_x=0, offset_y=0):
        self.operations.append(("image_crop", path, x, y, w, h, offset_x, offset_y))

    def text(self, text, x, y):
        self.operations.append(("text", text, x, y))

    def rect(self, x, y, w, h):
        self.operations.append(("rect", x, y, w, h))

    def fill_rect(self, x, y, w, h, color):
        self.operations.append(("fill_rect", x, y, w, h, color))

    def clear(self):
        self.operations.append(("clear",))


def background(is_night):
    return BACKGROUND_NIGHT if is_night else BACKGROUND_DAY


def soft_background(is_night):
    return BACKGROUND_NIGHT_SOFT if is_night else BACKGROUND_DAY_SOFT


def render_intro(display, intro_index=0, is_night=False):
    clear(display)
    display.image(asset_path(soft_background(is_night)), 0, 0)
    lines = INTRO_PAGES[min(intro_index, len(INTRO_PAGES) - 1)]
    y = 64
    for line in lines:
        draw_center(display, line, y)
        y += 22
    draw_center(display, "A 继续", 196)
    draw_center(display, "B 跳过", 216)


def render_home(display, selected, is_night=False):
    clear(display)
    display.image(asset_path(soft_background(is_night)), 0, 0)
    display.image(asset_path(background(is_night)), 0, 0)
    for key, filename in ICONS.items():
        render_home_icon(display, key, key == selected)


def render_home_selection(display, previous, selected):
    if previous:
        render_home_icon(display, previous, False)
    render_home_icon(display, selected, True)


def render_home_icon(display, key, selected):
    x, y = ICON_POSITIONS[key]
    fill_rect(display, x - 3, y - 3, 28, 28, HOME_SLOT_HIGHLIGHT if selected else HOME_SLOT_BG)
    display.image(asset_path(ICONS[key]), x, y)


def render_platform(display, entrance, frame_index=0, is_night=False):
    clear(display)
    display.image(asset_path(soft_background(is_night)), 0, 0)
    display.image(asset_path(PLATFORMS[entrance]), 0, 0)
    draw_lan(display, entrance, frame_index)
    draw_bubble(display, entrance)


def render_action(display, entrance, frame_index=0, is_night=False):
    clear(display)
    display.image(asset_path(soft_background(is_night)), 0, 0)
    display.image(asset_path(PLATFORMS[entrance]), 0, 0)
    draw_lan(display, entrance, frame_index)


def render_action_frame(display, entrance, frame_index=0):
    restore_lan_area(display, entrance)
    draw_lan(display, entrance, frame_index)


def render_complete(display, entrance, is_night=False):
    clear(display)
    display.image(asset_path(soft_background(is_night)), 0, 0)
    display.image(asset_path(PLATFORMS[entrance]), 0, 0)
    draw_lan(display, entrance, 0)
    lines = COMPLETION_COPY[entrance]
    y = 176
    for line in lines:
        draw_center(display, line, y)
        y += 16
    draw_center(display, "A BACK", 216)


def render_oracle_summary(display, daily_log, is_night=False):
    clear(display)
    display.image(asset_path(soft_background(is_night)), 0, 0)
    display.image(asset_path(PLATFORMS["oracle"]), 0, 0)
    draw_center(display, "TODAY", 24)
    draw_center(display, "YOU CARED", 48)
    draw_center(display, "FOR LAN", 66)
    y = 96
    for key, label in (
        ("food", "CAKE"),
        ("water", "DEW"),
        ("poop", "SOIL"),
        ("sleep", "SLEEP"),
        ("sport", "LEAF"),
        ("mood", "SUN"),
        ("stress", "AIR"),
    ):
        count = int(daily_log.get(key, 0))
        if count:
            draw_center(display, "{} {}".format(label, count), y)
            y += 16
    if y == 96:
        draw_center(display, ORACLE_LINES[0], y)
    draw_center(display, "A BACK", 214)


def draw_lan(display, entrance, frame_index):
    frames = LAN_FRAMES[entrance]
    filename = frames[frame_index % len(frames)]
    x, y = LAN_POSITION[entrance]
    display.image(asset_path(filename), x, y)


def restore_lan_area(display, entrance):
    x, y = LAN_POSITION[entrance]
    platform_path = asset_path(PLATFORMS[entrance])
    if hasattr(display, "image_crop"):
        display.image_crop(platform_path, x, y, LAN_DIRTY_SIZE, LAN_DIRTY_SIZE, x, y)
    else:
        display.image(platform_path, 0, 0)


def draw_bubble(display, entrance):
    bubble = BUBBLES[entrance]
    x, y = BUBBLE_POSITION[bubble]
    display.image(asset_path(bubble), x, y)
    main, small = BUBBLE_TEXT[entrance]
    display.text(main, x + 18, y + 35)
    if small:
        display.text(small, x + 16, y + 52)


def draw_center(display, text, y):
    text = str(text)
    x = max(0, (DISPLAY_WIDTH - text_width(text)) // 2)
    display.text(text, x, y)


def clear(display):
    if hasattr(display, "clear"):
        display.clear()


def fill_rect(display, x, y, w, h, color):
    if hasattr(display, "fill_rect"):
        display.fill_rect(x, y, w, h, color)
    elif hasattr(display, "rect"):
        display.rect(x, y, w, h)


def text_width(text):
    width = 0
    for char in str(text):
        width += 6 if ord(char) < 128 else 24
    return width
