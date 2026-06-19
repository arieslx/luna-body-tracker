"""StickS3 visual button probe.

Use this on device to confirm the physical button to UiFlow2 event mapping.
Only press the lower middle button and the right button; do not use power/mode.
"""

import time

import M5


last = "NONE"
count_a = 0
count_b = 0


def draw():
    M5.Display.fillScreen(0)
    M5.Display.drawString("Button Probe", 8, 12)
    M5.Display.drawString("Last " + last, 8, 44)
    M5.Display.drawString("A " + str(count_a), 8, 76)
    M5.Display.drawString("B " + str(count_b), 8, 104)
    M5.Display.drawString("Middle?", 8, 180)
    M5.Display.drawString("Right?", 8, 206)


M5.begin()
draw()

while True:
    M5.update()
    if M5.BtnA.wasPressed():
        last = "BtnA"
        count_a = count_a + 1
        draw()
    if M5.BtnB.wasPressed():
        last = "BtnB"
        count_b = count_b + 1
        draw()
    time.sleep_ms(80)
