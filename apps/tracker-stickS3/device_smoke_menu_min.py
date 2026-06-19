"""Compact two-button menu test for StickS3 USB Run Once."""

import time
import M5


M5.begin()
D = M5.Display
tools = ("W", "F", "T", "S", "QR")
foods = ("protein", "vegetable", "staple", "None")
trains = ("aerobic", "anaerobic", "swim", "bike", "None")
moods = ("calm", "laugh", "cry", "angry", "tired", "emo")
i = 0
j = 0
mode = 0
w = 0
f = "None"
t = "None"
m = "calm"
s = "READY"


def txt(v, x, y):
    D.drawString(str(v), x, y)


def choices():
    if tools[i] == "F":
        return foods
    if tools[i] == "T":
        return trains
    return moods


def draw():
    D.fillScreen(0)
    if mode == 1:
        c = choices()
        txt("Pick " + tools[i], 8, 20)
        txt(c[j], 8, 64)
        txt("B next", 8, 190)
        txt("A ok", 8, 214)
    elif mode == 2:
        txt("EXPORT", 8, 20)
        txt("w " + str(w), 8, 54)
        txt("f " + f, 8, 76)
        txt("t " + t, 8, 98)
        txt("m " + m, 8, 120)
        txt("A/B back", 8, 214)
    else:
        txt("Luna Tree", 8, 8)
        txt("Tool " + tools[i], 8, 34)
        txt("W " + str(w), 8, 60)
        txt("F " + f, 8, 82)
        txt("T " + t, 8, 104)
        txt("S " + m, 8, 126)
        txt(s, 8, 160)
        txt("B tool", 8, 198)
        txt("A enter", 8, 216)


draw()

while True:
    M5.update()
    if M5.BtnB.wasPressed():
        if mode == 0:
            i = (i + 1) % len(tools)
            s = "TOOL " + tools[i]
        elif mode == 1:
            j = (j + 1) % len(choices())
        else:
            mode = 0
        draw()
    if M5.BtnA.wasPressed():
        if mode == 0:
            if tools[i] == "W":
                w = w + 1
                s = "WATER " + str(w)
            elif tools[i] == "QR":
                mode = 2
            else:
                mode = 1
                j = 0
        elif mode == 1:
            picked = choices()[j]
            if tools[i] == "F":
                f = picked
                s = "FOOD " + f
            elif tools[i] == "T":
                t = picked
                s = "TRAIN " + t
            else:
                m = picked
                s = "MOOD " + m
            mode = 0
        else:
            mode = 0
        draw()
    time.sleep_ms(80)
