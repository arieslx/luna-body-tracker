# StickS3 Device Test

Use this checklist on the physical StickS3 after copying the Python files and
`assets-device/` PNG files to the device.

## Files To Copy

Copy Python files to the app root on the device:

- `main.py`
- `config.py`
- `controller.py`
- `device_adapter.py`
- `state.py`
- `ui.py`
- `storage.py`
- `export.py`

Copy device assets to the configured resource folder:

- local source: `assets-device/*.png`
- device target: `/flash/res/*.png`

## Smoke Test

- [ ] Boot shows `day.png` background and `calm.png` center sprite during day mode.
- [ ] Boot shows `night.png` background and `sleep.png` center sprite during night mode.
- [ ] Bottom toolbar shows `W F T S QR`.
- [ ] Active toolbar item is visibly highlighted.
- [ ] `BtnB` right button short press cycles `W -> F -> T -> S -> QR -> W`.
- [ ] `BtnA` lower middle button on `W` increments water and shows `water.png`.
- [ ] `BtnA` on `F` cycles food through protein, vegetable, staple, and None.
- [ ] Food sprites show `chicken.png`, `vegetable.png`, and `rice.png`.
- [ ] `BtnA` on `T` cycles aerobic, anaerobic, swim, bike, and None.
- [ ] `BtnA` on `S` cycles calm, laugh, cry, angry, tired, and emo.
- [ ] `BtnA` on `QR` shows the export screen.
- [ ] Export screen shows compact JSON text fallback.
- [ ] A phone can scan the QR code and read compact JSON after a QR renderer is added.
- [ ] `BtnB` returns from export screen to the main screen.
- [ ] `BtnA` returns from export screen to the main screen.
- [ ] Reboot preserves the current day's JSON record.
- [ ] Changing the date creates a new default daily record.

## Confirmed Device API

- Firmware: MicroPython v1.27.0-dirty / UiFlow2 on M5STACK StickS3.
- Available imports: `M5`, `hardware`, `json`, `ujson`.
- Display: `M5.Display`.
- Display methods confirmed: `fillScreen`, `clear`, `drawString`, `drawImage`,
  `width`, and `height`.
- Use `M5.Display.drawString(text, x, y)` only. On the tested UiFlow2 v2.4.7
  firmware, passing a color argument to `drawString` can make the app leave USB
  execution and return to Cloud Mode.
- `M5.Display.qrcode` is not available on the tested firmware.
- `BtnA`: lower middle button, used to execute the active tool.
- `BtnB`: right button, used to switch tools.
- Power/mode button: do not use for app interaction.

## Expected QR Shape

```json
{"source":"m5stack-sticks3-tree","date":"YYYY-MM-DD","water":1,"food":"protein","exercise":"swim","mood":"calm"}
```

## Known MVP Limits

- No audio.
- No STT.
- No Wi-Fi sync.
- No long press or double click.
- No IMU navigation.
- No animation.
- QR scan needs a lightweight QR renderer because the tested StickS3 UiFlow2
  display API does not expose `qrcode`.
