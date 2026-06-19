"""UiFlow2 device adapter for M5Stack StickS3.

This module is intentionally thin: app state and layout stay in the portable
modules, while this file translates drawing and button polling to UiFlow2 APIs.
"""

import time

import M5


COLOR_BLACK = 0x000000
COLOR_WHITE = 0xFFFFFF


class StickS3Display:
    def __init__(self, screen=None):
        self.screen = screen or M5.Display

    def image(self, path, x, y):
        self.screen.drawImage(path, x, y)

    def fill_rect(self, x, y, w, h, color):
        if hasattr(self.screen, "fillRect"):
            self.screen.fillRect(x, y, w, h, color)
        elif hasattr(self.screen, "drawRect"):
            self.screen.drawRect(x, y, w, h, color)

    def text(self, text, x, y, color=None, background=None):
        if background is not None and hasattr(self.screen, "fillRect"):
            self.screen.fillRect(x - 1, y - 1, len(str(text)) * 8 + 2, 12, background)
        # StickS3 UiFlow2 v2.4.7 accepts drawString(text, x, y) reliably.
        # Passing a color argument can restart back to Cloud Mode on-device.
        self.screen.drawString(str(text), x, y)


def begin_device():
    M5.begin()
    return StickS3Display()


def current_time_text():
    now = time.localtime()
    return "{:02d}:{:02d}".format(now[3], now[4])


def current_date_text():
    now = time.localtime()
    return "{:04d}-{:02d}-{:02d}".format(now[0], now[1], now[2])


def is_night_time():
    hour = time.localtime()[3]
    return hour < 8


def run_button_loop(controller, save_interval_ms=80):
    """Poll safe StickS3 buttons.

    Confirmed mapping:
    - BtnA: lower middle button, execute active tool.
    - BtnB: right button, cycle active tool.
    - Power/mode button is intentionally unused.
    """

    controller.render()
    while True:
        M5.update()
        if M5.BtnB.wasPressed():
            controller.on_key1_short()
        if M5.BtnA.wasPressed():
            controller.on_key2_short()
        time.sleep_ms(save_interval_ms)
