"""Renderers for Yun Tracker StickS3."""

from config import (
    BACKGROUND_DAY,
    BACKGROUND_DAY_SOFT,
    BACKGROUND_NIGHT,
    BACKGROUND_NIGHT_SOFT,
    BUBBLE_TEXT,
    COMPLETION_TEXT_CLEAR_HEIGHT,
    COMPLETION_COPY,
    DISPLAY_WIDTH,
    HOME_LAN_FRAMES,
    HOME_LAN_POSITION,
    HOME_SLOT_BG,
    HOME_SLOT_HIGHLIGHT,
    ICON_POSITIONS,
    ICON_SIZES,
    ICONS,
    INTRO_PAGES,
    LAN_DIRTY_SIZE,
    LAN_FRAMES,
    LAN_POSITION,
    ORACLE_LINES,
    ORACLE_STAND_IMAGE,
    ORACLE_SUMMARY_IMAGE,
    PIXEL_TEXT_ADVANCE,
    PLATFORMS,
    RANDOM_ORACLE_ENTRANCE,
    TOP_TEXT_CLEAR_HEIGHT,
    TOP_TEXT_LINE_HEIGHT,
    TOP_TEXT_MAX_WIDTH,
    TOP_TEXT_Y,
    asset_path,
    option_keys,
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
    update(display)


def render_home(display, selected, is_night=False, frame_index=0):
    clear(display)
    display.image(asset_path(soft_background(is_night)), 0, 0)
    display.image(asset_path(background(is_night)), 0, 0)
    draw_home_lan(display, frame_index)
    for key, filename in ICONS.items():
        render_home_icon(display, key, key == selected, is_night)
    update(display)


def render_home_selection(display, previous, selected, frame_index=0, is_night=False):
    if previous:
        render_home_icon(display, previous, False, is_night)
    render_home_icon(display, selected, True, is_night)


def render_home_icon(display, key, selected, is_night=False):
    x, y = ICON_POSITIONS[key]
    width, height = ICON_SIZES.get(key, (20, 20))
    if key == RANDOM_ORACLE_ENTRANCE:
        if hasattr(display, "image_crop"):
            scene_path = asset_path(background(is_night))
            display.image_crop(scene_path, x - 3, y - 3, width + 6, height + 6, x - 3, y - 3)
        else:
            display.image(asset_path(background(is_night)), 0, 0)
        display.image(asset_path(ICONS[key]), x, y)
        return
    fill_rect(display, x - 3, y - 3, width + 6, height + 6, HOME_SLOT_HIGHLIGHT if selected else HOME_SLOT_BG)
    display.image(asset_path(ICONS[key]), x, y)


def render_home_lan_frame(display, frame_index=0, is_night=False, selected=None):
    restore_home_lan_area(display, is_night)
    draw_home_lan(display, frame_index)
    update(display)


def render_platform(display, entrance, frame_index=0, is_night=False, option=None, selected_options=()):
    clear(display)
    display.image(asset_path(soft_background(is_night)), 0, 0)
    display.image(asset_path(PLATFORMS[entrance]), 0, 0)
    draw_lan(display, entrance, frame_index)
    draw_top_copy(display, platform_copy(entrance, option), TOP_TEXT_Y)
    update(display)


def render_platform_option_overlay(display, entrance, option=None, is_night=False):
    restore_top_area(display, entrance, is_night)
    draw_top_copy(display, platform_copy(entrance, option), TOP_TEXT_Y)
    update(display)


def render_action(display, entrance, frame_index=0, is_night=False):
    clear(display)
    display.image(asset_path(soft_background(is_night)), 0, 0)
    display.image(asset_path(PLATFORMS[entrance]), 0, 0)
    draw_lan(display, entrance, frame_index)
    update(display)


def render_action_frame(display, entrance, frame_index=0, is_night=False):
    restore_lan_area(display, entrance, is_night)
    draw_lan(display, entrance, frame_index)
    update(display)


def render_complete(display, entrance, is_night=False, completed_options=()):
    clear(display)
    display.image(asset_path(soft_background(is_night)), 0, 0)
    display.image(asset_path(PLATFORMS[entrance]), 0, 0)
    draw_lan(display, entrance, 0)
    draw_completion_copy(display, entrance)
    update(display)


def render_complete_overlay(display, entrance, is_night=False):
    restore_top_area(display, entrance, is_night, COMPLETION_TEXT_CLEAR_HEIGHT)
    draw_lan(display, entrance, 0)
    draw_completion_copy(display, entrance)
    update(display)


def draw_completion_copy(display, entrance):
    draw_top_copy(display, COMPLETION_COPY[entrance], TOP_TEXT_Y)


def render_oracle_summary(display, daily_log, is_night=False, date_key=""):
    clear(display)
    display.image(asset_path(soft_background(is_night)), 0, 0)
    display.image(asset_path(ORACLE_SUMMARY_IMAGE), 0, 0)
    draw_center(display, "TODAY", 24)
    draw_center(display, "YOU CARED", 48)
    draw_center(display, "FOR LAN", 66)
    y = 96
    for key, label in (
        ("food", "FOOD"),
        ("water", "WATER"),
        ("poop", "POOP"),
        ("sleep", "SLEEP"),
        ("sport", "SPORT"),
        ("mood", "MOOD"),
        ("stress", "RELAX"),
    ):
        count = count_record(daily_log.get(key, 0))
        if count:
            draw_center(display, "{} {}".format(label, count), y)
            y += 16
    if y == 96:
        draw_center(display, ORACLE_LINES[0], y)
    if date_key:
        draw_center(display, date_key, 232)
    draw_center(display, "A BACK", 214)
    update(display)


def render_random_oracle(display, line, is_night=False):
    clear(display)
    display.image(asset_path(soft_background(is_night)), 0, 0)
    y = 16
    for copy_line in wrap_lines((line,), DISPLAY_WIDTH - 10):
        draw_center(display, copy_line, y)
        y += TOP_TEXT_LINE_HEIGHT
    display.image(asset_path(ORACLE_STAND_IMAGE), 0, 105)
    draw_center(display, "A BACK", 224)
    update(display)


def draw_lan(display, entrance, frame_index):
    frames = LAN_FRAMES[entrance]
    filename = frames[frame_index % len(frames)]
    x, y = LAN_POSITION[entrance]
    display.image(asset_path(filename), x, y)


def draw_home_lan(display, frame_index):
    filename = HOME_LAN_FRAMES[frame_index % len(HOME_LAN_FRAMES)]
    x, y = HOME_LAN_POSITION
    display.image(asset_path(filename), x, y)


def restore_home_lan_area(display, is_night=False):
    x, y = HOME_LAN_POSITION
    scene_path = asset_path(background(is_night))
    if hasattr(display, "image_crop"):
        display.image_crop(scene_path, x, y, LAN_DIRTY_SIZE, LAN_DIRTY_SIZE, x, y)
    else:
        display.image(scene_path, 0, 0)


def restore_lan_area(display, entrance, is_night=False):
    x, y = LAN_POSITION[entrance]
    platform_path = asset_path(PLATFORMS[entrance])
    if hasattr(display, "image_crop"):
        display.image_crop(platform_path, x, y, LAN_DIRTY_SIZE, LAN_DIRTY_SIZE, x, y)
    else:
        display.image(platform_path, 0, 0)


def restore_top_area(display, entrance, is_night=False, height=TOP_TEXT_CLEAR_HEIGHT):
    bg_path = asset_path(soft_background(is_night))
    platform_path = asset_path(PLATFORMS[entrance])
    if hasattr(display, "image_crop"):
        display.image_crop(bg_path, 0, 0, DISPLAY_WIDTH, height, 0, 0)
        display.image_crop(platform_path, 0, 0, DISPLAY_WIDTH, height, 0, 0)
    else:
        display.image(bg_path, 0, 0)
        display.image(platform_path, 0, 0)


def draw_top_copy(display, lines, y):
    for line in wrap_lines(lines):
        if line:
            draw_center(display, line, y)
        y += TOP_TEXT_LINE_HEIGHT


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


def update(display):
    if hasattr(display, "update"):
        display.update()


def text_width(text):
    width = 0
    for char in str(text):
        width += PIXEL_TEXT_ADVANCE if ord(char) < 128 else 24
    return width


def wrap_lines(lines, max_width=TOP_TEXT_MAX_WIDTH):
    wrapped = []
    for line in lines:
        text = str(line)
        if not text:
            continue
        if text_width(text) <= max_width:
            wrapped.append(text)
            continue
        words = text.split(" ")
        if len(words) == 1:
            wrapped.extend(split_long_word(text, max_width))
            continue
        current = ""
        for word in words:
            candidate = word if not current else "{} {}".format(current, word)
            if text_width(candidate) <= max_width:
                current = candidate
            else:
                if current:
                    wrapped.append(current)
                if text_width(word) <= max_width:
                    current = word
                else:
                    parts = split_long_word(word, max_width)
                    wrapped.extend(parts[:-1])
                    current = parts[-1] if parts else ""
        if current:
            wrapped.append(current)
    return tuple(wrapped)


def split_long_word(word, max_width):
    parts = []
    current = ""
    for char in word:
        candidate = "{}{}".format(current, char)
        if current and text_width(candidate) > max_width:
            parts.append(current)
            current = char
        else:
            current = candidate
    if current:
        parts.append(current)
    return parts


def platform_copy(entrance, option=None):
    value = BUBBLE_TEXT[entrance]
    if not isinstance(value, dict):
        return value
    option = option or option_keys(entrance)[0]
    return value[option]


def option_summary(options):
    if not options:
        return ""
    return "+".join(str(option).upper()[0:3] for option in options)


def count_record(value):
    if isinstance(value, int):
        return value
    if isinstance(value, dict):
        total = 0
        for count in value.values():
            if isinstance(count, int):
                total += count
        return total
    return 0
