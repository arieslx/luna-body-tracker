"""MicroPython entry point for Tree Hole Tamagotchi."""

from config import (
    DISPLAY_HEIGHT,
    DISPLAY_WIDTH,
    SOURCE_ID,
    asset_path,
)
from controller import AppController
from state import AppState
from storage import load_today, save_today
from ui import DisplayRecorder


APP_NAME = "Tree Hole Tamagotchi"


def boot_summary(app_state):
    return {
        "app": APP_NAME,
        "source": SOURCE_ID,
        "display": "{}x{}".format(DISPLAY_WIDTH, DISPLAY_HEIGHT),
        "asset_dir": asset_path(""),
        "active_tool": app_state.current_tool(),
        "daily_log": app_state.daily_log,
    }


def save_daily_log(date_key, daily_log):
    try:
        return save_today(date_key, daily_log)
    except OSError as error:
        print("skip save:", error)
        return None


def desktop_main():
    today = "2026-06-19"
    app_state = AppState(load_today(today))
    display = DisplayRecorder()
    controller = AppController(
        app_state,
        display,
        time_provider=lambda: "09:42",
        night_provider=lambda: False,
        date_provider=lambda: today,
        save_callback=lambda daily_log: save_daily_log(today, daily_log),
    )
    print(boot_summary(app_state))
    controller.render()
    controller.on_key1_short()
    controller.on_key2_short()
    print(app_state.snapshot())
    print(display.operations)


def device_main():
    from device_adapter import (
        begin_device,
        current_date_text,
        current_time_text,
        is_night_time,
        run_button_loop,
    )

    today = current_date_text()
    app_state = AppState(load_today(today))
    display = begin_device()
    controller = AppController(
        app_state,
        display,
        time_provider=current_time_text,
        night_provider=is_night_time,
        date_provider=current_date_text,
        save_callback=lambda daily_log: save_daily_log(current_date_text(), daily_log),
    )
    print(boot_summary(app_state))
    run_button_loop(controller)


def main():
    try:
        import M5  # noqa: F401
    except ImportError:
        desktop_main()
    else:
        device_main()


if __name__ == "__main__":
    main()
