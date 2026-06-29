"""UIFlow2 Python launcher for Yun Tracker.

Use this as a tiny UIFlow2 project when the device boots into the official
UIFlow2 system. It keeps the official system intact and starts the Yun app
stored in /flash/yun_app.
"""

import gc
import sys

YUN_APP_DIR = "/flash/yun_app"
YUN_MODULES = (
    "main",
    "config",
    "config_text_en",
    "config_text_zh",
    "controller",
    "device_adapter",
    "state",
    "storage",
    "ui",
)


def run_yun():
    if YUN_APP_DIR not in sys.path:
        sys.path.insert(0, YUN_APP_DIR)
    for name in YUN_MODULES:
        sys.modules.pop(name, None)
    gc.collect()
    import main

    main.main()


run_yun()
