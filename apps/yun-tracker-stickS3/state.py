"""State machine for Yun Tracker StickS3."""

from config import ENTRANCES


def create_daily_log():
    log = {}
    for key in ENTRANCES:
        log[key] = 0
    log["island_energy"] = 0
    log["seen_intro"] = False
    return log


def normalize_daily_log(value):
    raw = value if isinstance(value, dict) else {}
    log = create_daily_log()
    for key in ENTRANCES:
        if isinstance(raw.get(key), int) and raw.get(key) >= 0:
            log[key] = raw.get(key)
    energy = raw.get("island_energy")
    if isinstance(energy, int) and energy >= 0:
        log["island_energy"] = min(100, energy)
    log["seen_intro"] = bool(raw.get("seen_intro"))
    return log


class AppState:
    def __init__(self, daily_log=None, selected_index=0):
        self.daily_log = normalize_daily_log(daily_log)
        self.selected_index = selected_index
        self.scene = "intro" if not self.daily_log.get("seen_intro") else "home"
        self.active_entrance = self.current_entrance()
        self.intro_index = 0
        self.frame_index = 0
        self.status = "READY"
        self.completed_entrance = None

    def current_entrance(self):
        return ENTRANCES[self.selected_index]

    def next_entrance(self):
        self.selected_index = (self.selected_index + 1) % len(ENTRANCES)
        self.active_entrance = self.current_entrance()
        self.status = self.active_entrance
        return self.active_entrance

    def enter_platform(self):
        self.active_entrance = self.current_entrance()
        self.scene = "platform"
        self.frame_index = 0
        self.status = self.active_entrance
        return self.active_entrance

    def cancel_to_home(self):
        self.scene = "home"
        self.completed_entrance = None
        self.status = "READY"

    def complete_action(self):
        key = self.active_entrance
        self.daily_log[key] = int(self.daily_log.get(key, 0)) + 1
        self.daily_log["island_energy"] = min(100, int(self.daily_log.get("island_energy", 0)) + 10)
        self.completed_entrance = key
        self.scene = "complete"
        self.status = "DONE {}".format(key)
        return key

    def start_action(self):
        self.scene = "action"
        self.frame_index = 0
        self.status = "ACTION {}".format(self.active_entrance)

    def next_intro(self):
        self.intro_index += 1
        return self.intro_index

    def finish_intro(self):
        self.daily_log["seen_intro"] = True
        self.scene = "home"
        self.status = "READY"

    def snapshot(self):
        return {
            "scene": self.scene,
            "active_entrance": self.active_entrance,
            "selected_index": self.selected_index,
            "daily_log": self.daily_log,
            "status": self.status,
        }
