"""StickS3 image rendering probe.

Upload `day.png` and `calm.png` from assets-device to `/flash/res/` before
running this file on the device.
"""

import time

import M5


M5.begin()
M5.Display.fillScreen(0)

try:
    M5.Display.drawImage("/flash/res/day.png", 0, 0)
    M5.Display.drawImage("/flash/res/calm.png", 12, 30)
    M5.Display.drawString("IMG OK", 8, 216)
    print("image probe ok")
except Exception as error:
    M5.Display.fillScreen(0)
    M5.Display.drawString("IMG ERROR", 8, 20)
    M5.Display.drawString(type(error).__name__, 8, 48)
    M5.Display.drawString(str(error)[:18], 8, 76)
    print("image probe error:", type(error).__name__, error)

while True:
    M5.update()
    time.sleep_ms(200)
