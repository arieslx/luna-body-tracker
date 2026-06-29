"""StickS3 system-friendly launcher menu.

Install this file as /flash/main.py.

BtnA starts Yun Tracker. BtnB temporarily enters the official UIFlow2 system
without changing the default boot target. After power cycling, the device still
returns to this menu.
"""

import time

import M5


def draw_menu():
    M5.begin()
    M5.Display.fillScreen(0xFFFBE5)
    M5.Display.setFont(M5.Display.FONTS.ASCII7)
    try:
        M5.Display.setTextColor(0x4F3F4A, 0xFFFBE5)
    except TypeError:
        M5.Display.setTextColor(0x4F3F4A)
    M5.Display.drawString("YUN TRACKER", 18, 56)
    M5.Display.drawString("A START YUN", 18, 96)
    M5.Display.drawString("B SYSTEM", 18, 124)


def start_yun():
    import sys

    sys.path.insert(0, "/flash/yun_app")
    import main

    main.main()


def start_system():
    import esp32
    import startup
    from m5sync import sync

    nvs = esp32.NVS("uiflow")
    nvs.set_u8("boot_option", 0)
    nvs.commit()
    startup.startup(1, 60)
    sync.run()


def main():
    draw_menu()
    print("launcher: A Start Yun, B System")
    while True:
        M5.update()
        if M5.BtnA.wasPressed():
            print("launcher: start yun")
            start_yun()
            return
        if M5.BtnB.wasPressed():
            print("launcher: system")
            M5.Display.fillScreen(0xFFFBE5)
            M5.Display.drawString("OPEN SYSTEM", 18, 96)
            M5.Display.drawString("TEMP MODE", 18, 124)
            start_system()
            return
        time.sleep_ms(80)


if __name__ == "__main__":
    main()
