"""Two-button menu smoke test for StickS3.

Interaction:

- Home: BtnB switches tools, BtnA enters/executes.
- Water: BtnA records water immediately.
- Food/Train/Spirit: BtnB cycles choices, BtnA confirms.
- Export: BtnA or BtnB returns home.
"""

import time

import M5


TOOLS = ("W", "F", "T", "S", "QR")
FOODS = ("protein", "vegetable", "staple", "None")
TRAINS = ("aerobic", "anaerobic", "swim", "bike", "None")
MOODS = ("calm", "laugh", "cry", "angry", "tired", "emo")

tool_index = 0
mode = "home"
choice_index = 0
water = 0
food = "None"
train = "None"
mood = "calm"
status = "READY"


def text(value, x, y, color=0xFFFFFF):
    try:
        M5.Display.drawString(str(value), x, y, color)
    except TypeError:
        M5.Display.drawString(str(value), x, y)


def current_choices():
    if mode == "food":
        return FOODS
    if mode == "train":
        return TRAINS
    if mode == "spirit":
        return MOODS
    return ()


def draw_home():
    M5.Display.fillScreen(0)
    text("Luna Tree", 8, 8, 0x66CC99)
    text("Tool " + TOOLS[tool_index], 8, 34, 0xFFD76D)
    text("Water " + str(water), 8, 60)
    text("Food " + food, 8, 82)
    text("Train " + train, 8, 104)
    text("Mood " + mood, 8, 126)
    text(status[:18], 8, 160, 0x6EA8FE)
    text("B select", 8, 198)
    text("A enter", 8, 216)


def draw_choice(title):
    choices = current_choices()
    M5.Display.fillScreen(0)
    text(title, 8, 12, 0x66CC99)
    text(choices[choice_index], 8, 52, 0xFFD76D)
    text("B next choice", 8, 190)
    text("A confirm", 8, 214)


def draw_export():
    M5.Display.fillScreen(0)
    text("EXPORT", 8, 12, 0x66CC99)
    text("w " + str(water), 8, 44)
    text("f " + food, 8, 66)
    text("t " + train, 8, 88)
    text("m " + mood, 8, 110)
    text("A/B back", 8, 214)


def render():
    if mode == "food":
        draw_choice("FOOD")
    elif mode == "train":
        draw_choice("TRAIN")
    elif mode == "spirit":
        draw_choice("SPIRIT")
    elif mode == "export":
        draw_export()
    else:
        draw_home()


def enter_or_confirm():
    global mode, choice_index, water, food, train, mood, status
    if mode == "home":
        tool = TOOLS[tool_index]
        if tool == "W":
            water = water + 1
            status = "WATER " + str(water)
        elif tool == "F":
            mode = "food"
            choice_index = 0
        elif tool == "T":
            mode = "train"
            choice_index = 0
        elif tool == "S":
            mode = "spirit"
            choice_index = 0
        else:
            mode = "export"
    elif mode == "food":
        food = FOODS[choice_index]
        status = "FOOD " + food
        mode = "home"
    elif mode == "train":
        train = TRAINS[choice_index]
        status = "TRAIN " + train
        mode = "home"
    elif mode == "spirit":
        mood = MOODS[choice_index]
        status = "MOOD " + mood
        mode = "home"
    elif mode == "export":
        mode = "home"


def next_or_back():
    global tool_index, choice_index, mode, status
    if mode == "home":
        tool_index = (tool_index + 1) % len(TOOLS)
        status = "TOOL " + TOOLS[tool_index]
    elif mode == "export":
        mode = "home"
    else:
        choices = current_choices()
        choice_index = (choice_index + 1) % len(choices)


M5.begin()
render()

while True:
    M5.update()
    if M5.BtnB.wasPressed():
        next_or_back()
        render()
    if M5.BtnA.wasPressed():
        enter_or_confirm()
        render()
    time.sleep_ms(80)
