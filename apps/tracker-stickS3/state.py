"""State machine for Tree Hole Tamagotchi.

All changes are user-triggered. There is no decay, punishment, or automatic
attribute drop in the MVP.
"""

from config import (
    EXERCISE_SPRITES,
    EXERCISE_STATES,
    FOOD_SPRITES,
    FOOD_STATES,
    MOOD_SPRITES,
    MOOD_STATES,
    TOOL_EXPORT,
    TOOL_FOOD,
    TOOL_SPIRIT,
    TOOL_TRAIN,
    TOOL_WATER,
    TOOLS,
    create_daily_log,
)


WATER_SPRITE = "water.png"


class AppState:
    def __init__(self, daily_log=None, active_tool_index=0):
        self.daily_log = daily_log or create_daily_log()
        self.active_tool_index = active_tool_index
        self.center_sprite = MOOD_SPRITES.get(self.daily_log.get("mood"), "calm.png")
        self.status = "READY"

    def current_tool(self):
        return TOOLS[self.active_tool_index]

    def next_tool(self):
        self.active_tool_index = (self.active_tool_index + 1) % len(TOOLS)
        self.status = "TOOL {}".format(self.current_tool())
        return self.current_tool()

    def execute_active_tool(self):
        tool = self.current_tool()
        if tool == TOOL_WATER:
            return self.water()
        if tool in (TOOL_FOOD, TOOL_TRAIN, TOOL_SPIRIT):
            return "choice"
        if tool == TOOL_EXPORT:
            self.status = "EXPORT"
            return "export"
        return None

    def water(self):
        self.daily_log["water"] = int(self.daily_log.get("water", 0)) + 1
        self.center_sprite = WATER_SPRITE
        self.status = "WATER +{}".format(self.daily_log["water"])
        return self.center_sprite

    def cycle_food(self):
        value = next_value(FOOD_STATES, self.daily_log.get("food", "None"))
        self.daily_log["food"] = value
        self.center_sprite = FOOD_SPRITES.get(value, MOOD_SPRITES.get(self.daily_log.get("mood"), "calm.png"))
        self.status = "FOOD {}".format(value)
        return self.center_sprite

    def cycle_exercise(self):
        value = next_value(EXERCISE_STATES, self.daily_log.get("exercise", "None"))
        self.daily_log["exercise"] = value
        self.center_sprite = EXERCISE_SPRITES.get(value, MOOD_SPRITES.get(self.daily_log.get("mood"), "calm.png"))
        self.status = "TRAIN {}".format(value)
        return self.center_sprite

    def cycle_mood(self):
        value = next_value(MOOD_STATES, self.daily_log.get("mood", "calm"))
        self.daily_log["mood"] = value
        self.center_sprite = MOOD_SPRITES[value]
        self.status = "MOOD {}".format(value)
        return self.center_sprite

    def choice_values(self, tool=None):
        tool = tool or self.current_tool()
        if tool == TOOL_FOOD:
            return FOOD_STATES[1:] + ("None",)
        if tool == TOOL_TRAIN:
            return EXERCISE_STATES[1:] + ("None",)
        if tool == TOOL_SPIRIT:
            return MOOD_STATES
        return ()

    def preview_choice(self, tool, choice_index):
        values = self.choice_values(tool)
        if not values:
            return None
        value = values[choice_index % len(values)]
        self.center_sprite = sprite_for_choice(tool, value, self.daily_log)
        self.status = "PICK {}".format(value)
        return value

    def confirm_choice(self, tool, value):
        if tool == TOOL_FOOD:
            self.daily_log["food"] = value
            self.status = "FOOD {}".format(value)
        elif tool == TOOL_TRAIN:
            self.daily_log["exercise"] = value
            self.status = "TRAIN {}".format(value)
        elif tool == TOOL_SPIRIT:
            self.daily_log["mood"] = value
            self.status = "MOOD {}".format(value)
        else:
            return None
        self.center_sprite = sprite_for_choice(tool, value, self.daily_log)
        return self.center_sprite

    def snapshot(self):
        return {
            "active_tool_index": self.active_tool_index,
            "active_tool": self.current_tool(),
            "daily_log": self.daily_log,
            "center_sprite": self.center_sprite,
            "status": self.status,
        }


def next_value(values, current):
    try:
        index = values.index(current)
    except ValueError:
        index = 0
    return values[(index + 1) % len(values)]


def sprite_for_choice(tool, value, daily_log):
    fallback = MOOD_SPRITES.get(daily_log.get("mood"), "calm.png")
    if tool == TOOL_FOOD:
        return FOOD_SPRITES.get(value, fallback)
    if tool == TOOL_TRAIN:
        return EXERCISE_SPRITES.get(value, fallback)
    if tool == TOOL_SPIRIT:
        return MOOD_SPRITES.get(value, fallback)
    return fallback
