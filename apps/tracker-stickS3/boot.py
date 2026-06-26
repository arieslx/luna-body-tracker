"""StickS3 boot entry for stable app autostart.

Hold the right button (BtnB) during boot to skip launching the app. This keeps
the device recoverable for USB/WebTerminal debugging.
"""

import time


def show_boot_error(error):
    try:
        import M5

        M5.begin()
        M5.Display.fillScreen(0)
        M5.Display.drawString("BOOT ERROR", 8, 20)
        M5.Display.drawString(type(error).__name__, 8, 48)
        M5.Display.drawString(str(error)[:18], 8, 76)
        while True:
            M5.update()
            time.sleep_ms(200)
    except Exception:
        print("boot error:", type(error).__name__, error)


def should_skip_autostart():
    try:
        import M5

        M5.begin()
        for _ in range(12):
            M5.update()
            if M5.BtnB.isPressed():
                M5.Display.fillScreen(0)
                M5.Display.drawString("BOOT SKIP", 8, 40)
                M5.Display.drawString("USB DEBUG", 8, 68)
                print("boot autostart skipped")
                while True:
                    M5.update()
                    time.sleep_ms(200)
            time.sleep_ms(80)
    except Exception:
        return False
    return False


try:
    if not should_skip_autostart():
        import main

        main.main()
except Exception as error:
    show_boot_error(error)
