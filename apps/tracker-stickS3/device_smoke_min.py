"""Tiny StickS3 smoke test for UiFlow2 paste/run checks."""

import time
import M5


tools = ("W", "F", "T", "S", "QR")
tool_index = 0
water = 0
status = "READY"


def text(value, x, y, color=0xFFFFFF):
    try:
        M5.Display.drawString(str(value), x, y, color)
    except TypeError:
        M5.Display.drawString(str(value), x, y)


def draw():
    M5.Display.fillScreen(0x000000)
    text("Luna Tree", 8, 8, 0x66CC99)
    text("Tool " + tools[tool_index], 8, 40, 0xFFD76D)
    text("Water " + str(water), 8, 70)
    text(status, 8, 110, 0x6EA8FE)
    text("B next", 8, 190)
    text("A water", 8, 214)


M5.begin()
draw()
print("smoke min ready")

while True:
    M5.update()
    if M5.BtnB.wasPressed():
        tool_index = (tool_index + 1) % len(tools)
        status = "TOOL " + tools[tool_index]
        draw()
    if M5.BtnA.wasPressed():
        water = water + 1
        status = "WATER " + str(water)
        draw()
    time.sleep_ms(80)
