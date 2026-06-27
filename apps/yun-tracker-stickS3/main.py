"""Entry point for Yun Tracker StickS3."""

from controller import AppController
from state import AppState
from storage import load_today, save_today
from ui import DisplayRecorder


APP_NAME = "Yun Tracker"


def save_daily_log(date_key, daily_log):
    try:
        return save_today(date_key, daily_log)
    except OSError as error:
        print("skip save:", error)
        return None


def desktop_main():
    today = "2026-06-27"
    state = AppState(load_today(today))
    display = DisplayRecorder()
    controller = AppController(
        state,
        display,
        time_provider=fake_ticks,
        night_provider=lambda: False,
        save_callback=lambda daily_log: save_daily_log(today, daily_log),
    )
    controller.render()
    controller.on_next()
    controller.on_confirm()
    controller.on_confirm()
    print({"app": APP_NAME, "state": state.snapshot(), "ops": display.operations[:12]})


def device_main():
    from device_adapter import begin_device, current_date_text, is_night_time, run_button_loop

    today = current_date_text()
    state = AppState(load_today(today))
    display = begin_device()
    controller = AppController(
        state,
        display,
        night_provider=is_night_time,
        save_callback=lambda daily_log: save_daily_log(current_date_text(), daily_log),
    )
    print({"app": APP_NAME, "scene": state.scene, "active": state.active_entrance})
    run_button_loop(controller)


def main():
    try:
        import M5  # noqa: F401
    except ImportError:
        desktop_main()
    else:
        device_main()


_fake_now = 0


def fake_ticks():
    global _fake_now
    _fake_now += 100
    return _fake_now


if __name__ == "__main__":
    main()
