"""State machine for Yun Tracker StickS3."""

from config import ENTRANCES, option_keys


def create_daily_log():
    log = {}
    for key in ENTRANCES:
        options = option_keys(key)
        if options:
            log[key] = {}
            for option in options:
                log[key][option] = 0
        else:
            log[key] = 0
    log["island_energy"] = 0
    log["seen_intro"] = True
    return log


def normalize_daily_log(value):
    raw = value if isinstance(value, dict) else {}
    log = create_daily_log()
    for key in ENTRANCES:
        options = option_keys(key)
        raw_value = raw.get(key)
        if options:
            if isinstance(raw_value, dict):
                for option in options:
                    count = raw_value.get(option)
                    if isinstance(count, int) and count >= 0:
                        log[key][option] = count
            elif isinstance(raw_value, int) and raw_value >= 0:
                log[key]["legacy"] = raw_value
        elif isinstance(raw_value, int) and raw_value >= 0:
            log[key] = raw_value
    energy = raw.get("island_energy")
    if isinstance(energy, int) and energy >= 0:
        log["island_energy"] = min(100, energy)
    log["seen_intro"] = True
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
        self.completed_options = ()
        self.pending_options = ()
        self.option_index = 0

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
        self.option_index = 0
        self.status = self.active_entrance
        return self.active_entrance

    def cancel_to_home(self):
        self.scene = "home"
        self.completed_entrance = None
        self.completed_options = ()
        self.status = "READY"

    def current_option(self):
        options = option_keys(self.active_entrance)
        if not options:
            return None
        return options[self.option_index % len(options)]

    def next_option(self):
        options = option_keys(self.active_entrance)
        if not options:
            return None
        self.option_index = (self.option_index + 1) % len(options)
        return self.current_option()

    def selected_option_keys(self):
        return ()

    def complete_action(self, options=None):
        key = self.active_entrance
        completed_options = tuple(options or ())
        option_list = option_keys(key)
        if option_list:
            if not completed_options:
                current = self.current_option()
                completed_options = (current,) if current else ()
            if not isinstance(self.daily_log.get(key), dict):
                self.daily_log[key] = {}
            for option in completed_options:
                self.daily_log[key][option] = int(self.daily_log[key].get(option, 0)) + 1
        else:
            self.daily_log[key] = int(self.daily_log.get(key, 0)) + 1
        self.daily_log["island_energy"] = min(100, int(self.daily_log.get("island_energy", 0)) + 10)
        self.completed_entrance = key
        self.completed_options = completed_options
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
