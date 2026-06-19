"""Two-button interaction controller for the StickS3 MVP."""

from export import compact_export_json
from ui import render_choice, render_home, render_qr_export


class AppController:
    def __init__(self, state, display, time_provider=None, night_provider=None, date_provider=None, save_callback=None):
        self.state = state
        self.display = display
        self.time_provider = time_provider or default_time_provider
        self.night_provider = night_provider or default_night_provider
        self.date_provider = date_provider or default_date_provider
        self.save_callback = save_callback
        self.screen = "home"
        self.choice_tool = None
        self.choice_index = 0
        self.export_json = ""

    def render(self):
        render_home(
            self.display,
            active_tool_index=self.state.active_tool_index,
            center_sprite=self.state.center_sprite,
            status=self.state.status,
            time_text=self.time_provider(),
            is_night=self.night_provider(),
        )

    def on_key1_short(self):
        if self.screen == "export":
            self.screen = "home"
            self.state.status = "READY"
            self.render()
            return self.state.snapshot()
        if self.screen == "choice":
            self.choice_index = (self.choice_index + 1) % len(self.state.choice_values(self.choice_tool))
            value = self.state.preview_choice(self.choice_tool, self.choice_index)
            self.render_choice(value)
            return self.state.snapshot()
        self.state.next_tool()
        self.render()
        return self.state.snapshot()

    def on_key2_short(self):
        if self.screen == "export":
            self.screen = "home"
            self.state.status = "READY"
            self.render()
            return self.state.snapshot()
        if self.screen == "choice":
            value = self.state.choice_values(self.choice_tool)[self.choice_index]
            self.state.confirm_choice(self.choice_tool, value)
            self.screen = "home"
            if self.save_callback:
                self.save_callback(self.state.daily_log)
            self.render()
            return self.state.snapshot()
        result = self.state.execute_active_tool()
        if result == "choice":
            self.screen = "choice"
            self.choice_tool = self.state.current_tool()
            self.choice_index = 0
            value = self.state.preview_choice(self.choice_tool, self.choice_index)
            self.render_choice(value)
            return self.state.snapshot()
        if result == "export":
            self.export_json = compact_export_json(self.date_provider(), self.state.daily_log)
            self.screen = "export"
            self.render_qr()
            return self.state.snapshot()
        if self.save_callback:
            self.save_callback(self.state.daily_log)
        self.render()
        return self.state.snapshot()

    def render_choice(self, value):
        render_choice(
            self.display,
            tool=self.choice_tool,
            value=value,
            center_sprite=self.state.center_sprite,
            time_text=self.time_provider(),
            is_night=self.night_provider(),
        )

    def render_qr(self):
        render_qr_export(
            self.display,
            self.export_json,
            time_text=self.time_provider(),
            is_night=self.night_provider(),
        )


def default_time_provider():
    return "--:--"


def default_night_provider():
    return False


def default_date_provider():
    return "1970-01-01"
