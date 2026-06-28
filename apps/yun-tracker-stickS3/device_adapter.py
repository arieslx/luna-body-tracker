"""UiFlow2 adapter for Yun Tracker StickS3."""

import gc
import time

import M5

from config import (
    CN_TEXT_BG,
    CN_TEXT_COLOR,
    NETWORK_CONNECT_TIMEOUT_SECONDS,
    NTP_HOSTS,
    PIXEL_TEXT_ADVANCE,
    PIXEL_TEXT_BOLD,
    PIXEL_TEXT_COLOR,
    TIMEZONE_OFFSET_SECONDS,
)

TEXT_BG = CN_TEXT_BG

PIXEL_FONT = {
    "0": ("01110", "10001", "10011", "10101", "11001", "10001", "01110"),
    "1": ("00100", "01100", "00100", "00100", "00100", "00100", "01110"),
    "2": ("01110", "10001", "00001", "00010", "00100", "01000", "11111"),
    "3": ("11110", "00001", "00001", "01110", "00001", "00001", "11110"),
    "4": ("00010", "00110", "01010", "10010", "11111", "00010", "00010"),
    "5": ("11111", "10000", "10000", "11110", "00001", "00001", "11110"),
    "6": ("01110", "10000", "10000", "11110", "10001", "10001", "01110"),
    "7": ("11111", "00001", "00010", "00100", "01000", "01000", "01000"),
    "8": ("01110", "10001", "10001", "01110", "10001", "10001", "01110"),
    "9": ("01110", "10001", "10001", "01111", "00001", "00001", "01110"),
    "A": ("01110", "10001", "10001", "11111", "10001", "10001", "10001"),
    "B": ("11110", "10001", "10001", "11110", "10001", "10001", "11110"),
    "C": ("01111", "10000", "10000", "10000", "10000", "10000", "01111"),
    "D": ("11110", "10001", "10001", "10001", "10001", "10001", "11110"),
    "E": ("11111", "10000", "10000", "11110", "10000", "10000", "11111"),
    "F": ("11111", "10000", "10000", "11110", "10000", "10000", "10000"),
    "G": ("01111", "10000", "10000", "10011", "10001", "10001", "01111"),
    "H": ("10001", "10001", "10001", "11111", "10001", "10001", "10001"),
    "I": ("11111", "00100", "00100", "00100", "00100", "00100", "11111"),
    "J": ("00111", "00010", "00010", "00010", "00010", "10010", "01100"),
    "K": ("10001", "10010", "10100", "11000", "10100", "10010", "10001"),
    "L": ("10000", "10000", "10000", "10000", "10000", "10000", "11111"),
    "M": ("10001", "11011", "10101", "10101", "10001", "10001", "10001"),
    "N": ("10001", "11001", "10101", "10011", "10001", "10001", "10001"),
    "O": ("01110", "10001", "10001", "10001", "10001", "10001", "01110"),
    "P": ("11110", "10001", "10001", "11110", "10000", "10000", "10000"),
    "Q": ("01110", "10001", "10001", "10001", "10101", "10010", "01101"),
    "R": ("11110", "10001", "10001", "11110", "10100", "10010", "10001"),
    "S": ("01111", "10000", "10000", "01110", "00001", "00001", "11110"),
    "T": ("11111", "00100", "00100", "00100", "00100", "00100", "00100"),
    "U": ("10001", "10001", "10001", "10001", "10001", "10001", "01110"),
    "V": ("10001", "10001", "10001", "10001", "10001", "01010", "00100"),
    "W": ("10001", "10001", "10001", "10101", "10101", "11011", "10001"),
    "X": ("10001", "10001", "01010", "00100", "01010", "10001", "10001"),
    "Y": ("10001", "10001", "01010", "00100", "00100", "00100", "00100"),
    "Z": ("11111", "00001", "00010", "00100", "01000", "10000", "11111"),
    "-": ("00000", "00000", "00000", "11111", "00000", "00000", "00000"),
    "+": ("00000", "00100", "00100", "11111", "00100", "00100", "00000"),
    "*": ("00000", "10101", "01110", "11111", "01110", "10101", "00000"),
    ":": ("00000", "00100", "00100", "00000", "00100", "00100", "00000"),
}


class StickS3Display:
    def __init__(self, screen=None):
        self.screen = screen or M5.Display
        self.current_font = None
        self.labels = []

    def image(self, path, x, y):
        self.screen.drawImage(path, x, y)

    def image_crop(self, path, x, y, w, h, offset_x=0, offset_y=0):
        try:
            self.screen.drawImage(path, x, y, w, h, offset_x, offset_y)
        except TypeError:
            self.screen.drawImage(path, x, y)

    def text(self, text, x, y):
        if is_ascii(text):
            self.pixel_text(str(text).upper(), x, y)
            return
        try:
            label = M5.Widgets.Label(
                str(text),
                x,
                y,
                1.0,
                CN_TEXT_COLOR,
                TEXT_BG,
                M5.Widgets.FONTS.AlibabaPuHuiTiCN24,
            )
            self.labels.append(label)
            M5.update()
        except Exception:
            self.set_text_font(text)
            try:
                self.screen.setTextColor(CN_TEXT_COLOR, TEXT_BG)
            except TypeError:
                try:
                    self.screen.setTextColor(CN_TEXT_COLOR)
                except TypeError:
                    pass
            self.screen.drawString(str(text), x, y)

    def pixel_text(self, text, x, y, scale=1):
        offset_x = x
        for char in text:
            if char == " ":
                offset_x += PIXEL_TEXT_ADVANCE * scale
                continue
            rows = PIXEL_FONT.get(char)
            if rows:
                for row_index, row in enumerate(rows):
                    for col_index, value in enumerate(row):
                        if value == "1":
                            self.fill_rect(
                                offset_x + col_index * scale,
                                y + row_index * scale,
                                scale,
                                scale,
                                PIXEL_TEXT_COLOR,
                            )
                            if PIXEL_TEXT_BOLD:
                                self.fill_rect(
                                    offset_x + col_index * scale + scale,
                                    y + row_index * scale,
                                    scale,
                                    scale,
                                    PIXEL_TEXT_COLOR,
                                )
            offset_x += PIXEL_TEXT_ADVANCE * scale

    def set_text_font(self, text):
        target = "ascii" if is_ascii(text) else "cn"
        if target == self.current_font:
            return
        if target == "cn":
            self.screen.setFont(self.screen.FONTS.AlibabaPuHuiTiCN24)
        else:
            self.screen.setFont(self.screen.FONTS.ASCII7)
        self.current_font = target

    def clear(self):
        # Scene renderers redraw their own full background. Hide widget labels
        # here so Chinese text does not persist across scene redraws.
        for label in self.labels:
            try:
                label.setVisible(False)
            except Exception:
                pass
        self.labels = []

    def update(self):
        M5.update()

    def fill_rect(self, x, y, w, h, color):
        if hasattr(self.screen, "fillRect"):
            self.screen.fillRect(x, y, w, h, color)

    def rect(self, x, y, w, h):
        if hasattr(self.screen, "drawRect"):
            self.screen.drawRect(x, y, w, h, 0xFFFFFF)
        else:
            self.screen.drawString("*", x, y)
            self.screen.drawString("*", x + w - 4, y)


def begin_device():
    M5.begin()
    return StickS3Display()


def sync_time_if_wifi():
    try:
        import network
        import ntptime
        from machine import RTC
    except ImportError as error:
        print("skip time sync:", error)
        return False

    try:
        wlan = network.WLAN(network.STA_IF)
        if not wlan.isconnected():
            try:
                import startup

                startup.startup(2, NETWORK_CONNECT_TIMEOUT_SECONDS)
            except Exception as error:
                print("network setup skipped:", error)
        if not wlan.active() or not wlan.isconnected():
            print("skip time sync: wifi offline")
            return False
    except Exception as error:
        print("skip time sync:", error)
        return False

    for host in NTP_HOSTS:
        try:
            ntptime.host = host
            ntptime.settime()
            local_time = time.localtime(time.time() + TIMEZONE_OFFSET_SECONDS)
            RTC().datetime(
                (
                    local_time[0],
                    local_time[1],
                    local_time[2],
                    local_time[6],
                    local_time[3],
                    local_time[4],
                    local_time[5],
                    0,
                )
            )
            print("time synced:", current_date_text())
            return True
        except Exception as error:
            print("time sync failed:", host, error)
    return False


def current_date_text():
    now = time.localtime()
    return "{:04d}-{:02d}-{:02d}".format(now[0], now[1], now[2])


def is_night_time():
    return False


def run_button_loop(controller):
    loop_count = 0
    controller.render()
    while True:
        M5.update()
        if M5.BtnB.wasPressed():
            controller.on_next()
        if M5.BtnA.wasPressed():
            controller.on_confirm()
        controller.tick()
        loop_count += 1
        if loop_count >= 20:
            loop_count = 0
            gc.collect()
        time.sleep_ms(80)


def is_ascii(value):
    try:
        str(value).encode("ascii")
        return True
    except UnicodeError:
        return False
