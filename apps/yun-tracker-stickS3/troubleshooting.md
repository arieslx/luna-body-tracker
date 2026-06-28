# Yun Tracker StickS3 Troubleshooting

## Launcher and official UIFlow2 system

### Current boot layout

The device keeps the official UIFlow2 `/flash/boot.py` intact.

Yun Tracker installs a small launcher as `/flash/main.py` and uses UIFlow2 NVS:

```text
boot_option = 0
```

This means the official boot file runs `main.py` directly, and the user sees:

```text
A START YUN
B SYSTEM
```

### Button behavior

- `BtnA`: imports `/flash/yun_app/main.py` and starts Yun Tracker.
- `BtnB`: sets `boot_option = 1`, commits it to NVS, and soft reboots.

`boot_option = 1` returns to the official UIFlow2 startup menu, where the user
can use Cloud, USB, Setup, and WebTerminal again.

### Expected serial logs

Launcher boot:

```text
Skip sync
launcher: A Start Yun, B System
```

Start Yun:

```text
launcher: start yun
{'active': 'mood', 'scene': 'home', 'app': 'Yun Tracker'}
```

Return to official system:

```text
launcher: system
```

After reboot, the device should show the official UIFlow2 menu instead of the
Yun launcher.

### Recovery notes

If the user returns to the official system with `BtnB`, the next boot may stay
in the official UIFlow2 startup menu because `boot_option` has been changed to
`1`.

To restore the Yun launcher as the default boot target, set:

```python
import esp32
nvs = esp32.NVS("uiflow")
nvs.set_u8("boot_option", 0)
nvs.commit()
```

Then reboot.

## WiFi and NTP time sync

### Current behavior

Yun Tracker calls `sync_time_if_wifi()` before loading the daily log.

The function:

- Tries to run UIFlow2's network-only startup flow with a short timeout.
- Checks whether `network.WLAN(network.STA_IF)` is connected.
- If connected, tries NTP hosts:
  - `ntp.aliyun.com`
  - `pool.ntp.org`
- Converts UTC to UTC+8 and writes the result into RTC.
- Continues into the game even when WiFi or NTP fails.

### Expected success log

```text
time synced: 2026-06-28
```

### Common failure log

```text
skip time sync: wifi offline
```

This means the runtime WLAN is not connected when Yun starts. Seeing a WiFi or
Cloud connection in the UIFlow2 website does not always mean the game process
has an active WLAN connection.

### What to check

Use the official UIFlow2 system menu and Setup flow to save WiFi credentials,
then return to Yun and test again.

Manual WebTerminal probe:

```python
import network
w = network.WLAN(network.STA_IF)
print(w.active(), w.isconnected(), w.ifconfig())
```

If this prints `False` or `0.0.0.0`, Yun cannot sync time yet.

### Date-key impact

Daily records are stored in `/flash/yun_daily.json` under a date key. If time is
not synced, `time.localtime()` may still report `1970-01-01`, so the summary
date at the bottom of oracle is not meaningful yet.

## Hardware sound or electrical noise

StickS3 has no fan or spinning mechanical part. A soft whine, buzz, or faint
electrical sound is usually not a rendering-performance issue.

Likely sources:

- Speaker or amplifier idle noise.
- Power management or inductor coil whine.
- Screen backlight or refresh noise.
- WiFi current spikes.
- Low battery or unstable power.

No-code checks:

- Compare sound in Yun, official UIFlow2 menu, USB mode, and Cloud mode.
- Compare sound when plugged into USB vs running from battery.
- Lower or mute audio if the firmware exposes audio controls.
- Check whether the device is unusually hot.
- Stop using the device if there is strong clicking, burning smell, swelling,
  repeated rebooting, or abnormal heat.

## Full-screen flash during animation

### Symptoms

- Pressing `BtnA` to start an action causes the whole platform scene to flash.
- The character animation itself mostly uses local refresh, but a full-screen redraw appears before the animation starts.
- Another full-screen flash appears between the final animation frame and the completion text.
- Switching `mood` or `food` options inside a platform causes the whole scene to redraw.
- Top text leaves old pixels behind, especially on the first line.
- Home-scene Lan idle shows a pale square before the next frame appears.

### Root cause

The app has two different rendering paths:

- Full scene renderers: `render_platform`, `render_action`, `render_complete`, `render_home`.
- Local overlay renderers: `render_action_frame`, `render_complete_overlay`, `render_platform_option_overlay`.

The full scene renderers call `clear()` and redraw the background/platform image. On StickS3 this is visibly slower and reads as a full-screen flash.

The issue was caused by controller transitions falling through to `self.render()` after small state changes:

- `platform -> action` called `self.render()`, which invoked `render_action()`.
- `action -> complete` called `self.render()`, which invoked `render_complete()`.
- `platform option -> next option` called `self.render()`, which invoked `render_platform()`.
- Top-text overlay first tried to restore only `platform_*.png`. Some platform images have transparent pixels near the top, so old text was not fully covered.
- Home Lan idle first tried to restore `day_bg.png` and then `day.png`. Because `day_bg.png` is pale, it showed as a square before Lan was redrawn.

### Fix pattern

For small changes inside the same visual scene, avoid `self.render()` and use a local overlay renderer instead.

Current local refresh rules:

- Starting an action from a platform:
  - Do not redraw the full action scene.
  - Keep the existing platform screen.
  - Let the next tick call `render_action_frame()`.

- Updating an animation frame:
  - Restore only Lan's dirty rectangle from the platform image.
  - Draw only the next Lan frame.

- Showing completion copy:
  - Restore the top text area from the soft background first.
  - Restore the top text area from the platform image second.
  - Draw the completion text.

- Switching a `mood` or `food` option:
  - Restore the top text area from the soft background first.
  - Restore the top text area from the platform image second.
  - Draw the new option text.

- Updating Lan on the home island:
  - Restore only Lan's dirty rectangle from `day.png` / `night.png`.
  - Do not restore from `day_bg.png` first if the home scene image is opaque at Lan's position.
  - Draw only the next `lan_stand_0/1` frame.

### Code reference

- `controller.py`
  - `on_confirm()`: returns immediately after `start_current_action()` to avoid full `render_action()`.
  - `tick()`: uses `render_action_frame()` for animation frames.
  - `tick()`: uses `render_complete_overlay()` for normal completion text.
  - `on_next()`: uses `render_platform_option_overlay()` when switching platform options.
  - `tick()`: uses `render_home_lan_frame()` for home idle frames.

- `ui.py`
  - `render_action_frame()`: local character refresh.
  - `restore_lan_area()`: restores the 48x48 character dirty rectangle.
  - `render_home_lan_frame()`: local home-idle character refresh.
  - `restore_home_lan_area()`: restores Lan's home dirty rectangle from the main home scene image.
  - `render_complete_overlay()`: local top text refresh for completion copy.
  - `render_platform_option_overlay()`: local top text refresh for option changes.
  - `restore_top_area()`: restores the top text dirty rectangle from soft background and platform.

### Verification

Use `DisplayRecorder` locally to confirm a transition does not call full render operations.

Expected action start operations:

```text
[]
```

Expected animation frame operations:

```text
image_crop(platform, lan_x, lan_y, 48, 48, lan_x, lan_y)
image(lan_frame, lan_x, lan_y)
```

Expected home idle frame operations:

```text
image_crop(day_or_night, home_lan_x, home_lan_y, 48, 48, home_lan_x, home_lan_y)
image(lan_stand_frame, home_lan_x, home_lan_y)
```

Expected completion overlay operations:

```text
image_crop(day_bg_or_night_bg, 0, 0, 135, COMPLETION_TEXT_CLEAR_HEIGHT, 0, 0)
image_crop(platform, 0, 0, 135, COMPLETION_TEXT_CLEAR_HEIGHT, 0, 0)
text(completion line 1)
text(completion line 2)
```

Expected option switch operations:

```text
image_crop(day_bg_or_night_bg, 0, 0, 135, TOP_TEXT_CLEAR_HEIGHT, 0, 0)
image_crop(platform, 0, 0, 135, TOP_TEXT_CLEAR_HEIGHT, 0, 0)
text(next option)
```

### Dirty rectangle source rules

Use a restore source that matches the pixels behind the thing being replaced:

- Platform Lan animation:
  - Use only `platform_*.png`.
  - Do not restore `day_bg.png` first. It can create a visible pale square before Lan is redrawn.

- Home Lan idle:
  - Use only `day.png` / `night.png` if Lan's area in that image is opaque.
  - Do not restore `day_bg.png` first unless the home scene image is transparent at Lan's position and the pale square is acceptable.

- Top text overlays:
  - Restore `day_bg.png` / `night_bg.png` first.
  - Restore `platform_*.png` second.
  - This covers old text even when the platform image has transparent top pixels.

- Oracle summary:
  - This is a major scene switch and can use a full render.
  - Summary uses `oracle.png`, while entering the oracle platform still uses `platform_oracle.png`.

### Notes

- A full-screen redraw is still expected when switching between major scenes, such as `home -> platform`, `complete -> home`, or `oracle summary`.
- If Lan's old frame leaves artifacts, adjust `LAN_POSITION` and `LAN_DIRTY_SIZE`, or use a larger dirty rectangle.
- If top text leaves artifacts, adjust `TOP_TEXT_CLEAR_HEIGHT`.
- If completion text wraps to more rows than expected, adjust `COMPLETION_TEXT_CLEAR_HEIGHT`.
- If summary counts look wrong, check the date key displayed at the bottom of the oracle summary. Device time comes from `time.localtime()`.
