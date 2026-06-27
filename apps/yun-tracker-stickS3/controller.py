"""Controller for Yun Tracker StickS3 two-button flow."""

try:
    import time
except ImportError:
    time = None

from config import ACTION_FRAME_MS, ACTION_MS, COMPLETE_MS, INTRO_PAGES
from ui import (
    render_action,
    render_action_frame,
    render_complete,
    render_home,
    render_home_selection,
    render_intro,
    render_oracle_summary,
    render_platform,
)


class AppController:
    def __init__(self, state, display, time_provider=None, night_provider=None, save_callback=None):
        self.state = state
        self.display = display
        self.time_provider = time_provider or ticks_ms
        self.night_provider = night_provider or (lambda: False)
        self.save_callback = save_callback
        self.last_frame_ms = 0
        self.action_started_ms = None
        self.complete_started_ms = None

    def render(self):
        scene = self.state.scene
        if scene == "intro":
            render_intro(self.display, self.state.intro_index, self.night_provider())
        elif scene == "home":
            render_home(self.display, self.state.current_entrance(), self.night_provider())
        elif scene == "platform":
            render_platform(
                self.display,
                self.state.active_entrance,
                self.state.frame_index,
                self.night_provider(),
            )
        elif scene == "action":
            render_action(
                self.display,
                self.state.active_entrance,
                self.state.frame_index,
                self.night_provider(),
            )
        elif scene == "oracle":
            render_oracle_summary(self.display, self.state.daily_log, self.night_provider())
        elif scene == "complete":
            render_complete(self.display, self.state.completed_entrance, self.night_provider())

    def on_next(self):
        if self.state.scene == "intro":
            self.state.finish_intro()
            self.save()
        elif self.state.scene == "home":
            previous = self.state.current_entrance()
            self.state.next_entrance()
            render_home_selection(self.display, previous, self.state.current_entrance())
            return self.state.snapshot()
        elif self.state.scene == "platform":
            self.state.cancel_to_home()
        elif self.state.scene in ("complete", "oracle"):
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
            self.state.enter_platform()
            self.last_frame_ms = self.time_provider()
        elif scene == "platform":
            self.state.start_action()
            self.action_started_ms = self.time_provider()
            self.last_frame_ms = self.action_started_ms
        elif scene in ("complete", "oracle"):
            self.state.cancel_to_home()
            self.complete_started_ms = None
        self.render()
        return self.state.snapshot()

    def tick(self):
        now = self.time_provider()
        if self.state.scene == "action":
            if elapsed(now, self.last_frame_ms) >= ACTION_FRAME_MS:
                self.last_frame_ms = now
                self.state.frame_index += 1
                render_action_frame(
                    self.display,
                    self.state.active_entrance,
                    self.state.frame_index,
                )
            if self.action_started_ms is not None and elapsed(now, self.action_started_ms) >= ACTION_MS:
                self.action_started_ms = None
                key = self.state.complete_action()
                self.save()
                if key == "oracle":
                    self.state.scene = "oracle"
                else:
                    self.complete_started_ms = self.time_provider()
                self.render()
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


def elapsed(now, then):
    if time and hasattr(time, "ticks_diff"):
        return time.ticks_diff(now, then)
    return now - then
