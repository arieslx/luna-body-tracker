"""Controller for Yun Tracker StickS3 two-button flow."""

try:
    import time
except ImportError:
    time = None

try:
    import random
except ImportError:
    random = None

from config import ACTION_FRAME_MS, ACTION_MS, COMPLETE_MS, FRAME_MS, INTRO_PAGES, RANDOM_ORACLE_ENTRANCE, RANDOM_ORACLE_LINES
from ui import (
    render_action,
    render_action_frame,
    render_complete,
    render_complete_overlay,
    render_home,
    render_home_lan_frame,
    render_home_selection,
    render_intro,
    render_random_oracle,
    render_oracle_summary,
    render_platform,
    render_platform_option_overlay,
)


class AppController:
    def __init__(self, state, display, time_provider=None, night_provider=None, save_callback=None, date_provider=None):
        self.state = state
        self.display = display
        self.time_provider = time_provider or ticks_ms
        self.night_provider = night_provider or (lambda: False)
        self.save_callback = save_callback
        self.date_provider = date_provider or (lambda: "")
        self.last_frame_ms = 0
        self.last_home_frame_ms = 0
        self.home_frame_index = 0
        self.action_started_ms = None
        self.complete_started_ms = None

    def render(self):
        scene = self.state.scene
        if scene == "intro":
            render_intro(self.display, self.state.intro_index, self.night_provider())
        elif scene == "home":
            render_home(
                self.display,
                self.state.current_entrance(),
                self.night_provider(),
                self.home_frame_index,
            )
        elif scene == "random_oracle":
            render_random_oracle(
                self.display,
                self.state.random_oracle_line,
                self.night_provider(),
            )
        elif scene == "platform":
            render_platform(
                self.display,
                self.state.active_entrance,
                self.state.frame_index,
                self.night_provider(),
                self.state.current_option(),
                self.state.selected_option_keys(),
            )
        elif scene == "action":
            render_action(
                self.display,
                self.state.active_entrance,
                self.state.frame_index,
                self.night_provider(),
            )
        elif scene == "oracle":
            render_oracle_summary(
                self.display,
                self.state.daily_log,
                self.night_provider(),
                self.date_provider(),
            )
        elif scene == "complete":
            render_complete(
                self.display,
                self.state.completed_entrance,
                self.night_provider(),
                self.state.completed_options,
            )

    def on_next(self):
        if self.state.scene == "intro":
            self.state.finish_intro()
            self.save()
        elif self.state.scene == "home":
            previous = self.state.current_entrance()
            self.state.next_entrance()
            render_home_selection(
                self.display,
                previous,
                self.state.current_entrance(),
                self.home_frame_index,
                self.night_provider(),
            )
            return self.state.snapshot()
        elif self.state.scene == "platform":
            if self.state.current_option():
                self.state.next_option()
                render_platform_option_overlay(
                    self.display,
                    self.state.active_entrance,
                    self.state.current_option(),
                    self.night_provider(),
                )
                return self.state.snapshot()
            else:
                self.state.cancel_to_home()
        elif self.state.scene in ("complete", "oracle", "random_oracle"):
            self.state.cancel_to_home()
        self.render()
        return self.state.snapshot()

    def on_confirm(self):
        scene = self.state.scene
        if scene == "intro":
            if self.state.next_intro() >= len(INTRO_PAGES):
                self.state.finish_intro()
                self.save()
        elif scene == "home":
            if self.state.current_entrance() == RANDOM_ORACLE_ENTRANCE:
                self.state.open_random_oracle(pick_random_oracle_line())
            else:
                self.state.enter_platform()
                self.last_frame_ms = self.time_provider()
        elif scene == "platform":
            self.start_current_action()
            return self.state.snapshot()
        elif scene in ("complete", "oracle", "random_oracle"):
            self.state.cancel_to_home()
            self.complete_started_ms = None
        self.render()
        return self.state.snapshot()

    def start_current_action(self, selected_options=()):
        current = self.state.current_option()
        self.state.pending_options = tuple(selected_options or ((current,) if current else ()))
        self.state.start_action()
        self.action_started_ms = self.time_provider()
        self.last_frame_ms = self.action_started_ms

    def tick(self):
        now = self.time_provider()
        if self.state.scene == "home":
            if elapsed(now, self.last_home_frame_ms) >= FRAME_MS:
                self.last_home_frame_ms = now
                self.home_frame_index += 1
                render_home_lan_frame(
                    self.display,
                    self.home_frame_index,
                    self.night_provider(),
                    self.state.current_entrance(),
                )
        if self.state.scene == "action":
            if elapsed(now, self.last_frame_ms) >= ACTION_FRAME_MS:
                self.last_frame_ms = now
                self.state.frame_index += 1
                render_action_frame(
                    self.display,
                    self.state.active_entrance,
                    self.state.frame_index,
                    self.night_provider(),
                )
            if self.action_started_ms is not None and elapsed(now, self.action_started_ms) >= ACTION_MS:
                self.action_started_ms = None
                key = self.state.complete_action(getattr(self.state, "pending_options", ()))
                self.state.pending_options = ()
                self.save()
                if key == "oracle":
                    self.state.scene = "oracle"
                    self.render()
                else:
                    self.complete_started_ms = self.time_provider()
                    render_complete_overlay(self.display, key, self.night_provider())
        if self.state.scene == "complete" and self.complete_started_ms is not None:
            if elapsed(now, self.complete_started_ms) >= COMPLETE_MS:
                self.complete_started_ms = None
                self.state.cancel_to_home()
                self.render()

    def save(self):
        if self.save_callback:
            self.save_callback(self.state.daily_log)


def ticks_ms():
    if time and hasattr(time, "ticks_ms"):
        return time.ticks_ms()
    if time:
        return int(time.time() * 1000)
    return 0


def pick_random_oracle_line():
    if not RANDOM_ORACLE_LINES:
        return ""
    if random and hasattr(random, "choice"):
        return random.choice(RANDOM_ORACLE_LINES)
    index = ticks_ms() % len(RANDOM_ORACLE_LINES)
    return RANDOM_ORACLE_LINES[index]


def elapsed(now, then):
    if time and hasattr(time, "ticks_diff"):
        return time.ticks_diff(now, then)
    return now - then
