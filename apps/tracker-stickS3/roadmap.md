# StickS3 Roadmap

## Tree Hole Tamagotchi MVP

- [x] Task 1: Project scaffold
  - Add `main.py` as the MicroPython entry point.
  - Add `config.py` for display size, asset paths, tool labels, and state constants.
  - Keep MVP free of audio, STT, Wi-Fi sync, custom fonts, and animation dependencies.

- [x] Task 2: UI rendering scaffold
  - Render opaque `day.png` / `night.png` backgrounds from `assets-device/`.
  - Render one replaceable center sprite.
  - Render top RTC/status bar.
  - Render bottom ASCII toolbar: `W`, `F`, `T`, `S`, `QR`.
  - Highlight the selected tool.
  - Use `calm.png` as the day default and `sleep.png` as the night default.

- [x] Task 3: State machine
  - Define `daily_log = {"water": 0, "food": "None", "exercise": "None", "mood": "calm"}`.
  - Define `active_tool_index = 0`.
  - Cycle tools in order: `W -> F -> T -> S -> QR -> W`.
  - Implement water action: increment `water`, show `water.png`.
  - Implement food cycle: `None -> protein -> vegetable -> staple -> None`.
  - Map food sprites: `protein -> chicken.png`, `vegetable -> vegetable.png`, `staple -> rice.png`.
  - Implement exercise cycle: `None -> aerobic -> anaerobic -> swim -> bike -> None`.
  - Implement mood cycle: `calm -> laugh -> cry -> angry -> tired -> emo -> calm`.
  - Keep all state changes user-triggered with no decay or punishment.

- [x] Task 4: BtnA / BtnB interaction
  - Confirm UiFlow2 exposes `M5.BtnA`, `M5.BtnB`, and `M5.BtnC`.
  - Map `BtnA` lower middle button short press to executing the selected tool.
  - Map `BtnB` right button short press to tool switching.
  - Do not use the power/mode button.
  - Refresh UI immediately after tool switching or action execution.
  - Do not implement long press, double click, IMU navigation, tree-hole mode, audio, or STT in MVP.

- [x] Task 5: Local storage
  - Store current-day data as JSON.
  - Load today's record on boot.
  - Create a new record when the date changes.
  - Save after every action.
  - Keep stored JSON human-readable.

- [ ] Task 6: QR export spike
  - [x] Generate compact JSON with `source`, `date`, `water`, `food`, `exercise`, and `mood`.
  - [x] Confirm UiFlow2 `M5.Display` on StickS3 does not expose a built-in `qrcode` method.
  - [x] Add a text fallback export screen when the `QR` tool executes.
  - [ ] Add or choose a lightweight QR renderer for StickS3.
  - [ ] Verify a phone can scan and read the JSON on the physical StickS3.
  - [x] Return from export screen to the main screen with `BtnA` or `BtnB`.

- [ ] Task 7: Device test and cleanup
  - [x] Add a physical device test checklist.
  - [x] Document remaining MVP limitations.
  - [x] Remove generated desktop Python cache files from the working tree.
  - [x] Confirm StickS3 USB mode can run code through UiFlow2 WebTerminal.
  - [x] Confirm available modules: `M5`, `hardware`, `json`, and `ujson`.
  - [x] Confirm display API: `M5.Display.drawImage`, `drawString`, `fillScreen`, `clear`, `width`, and `height`.
  - [x] Confirm `drawString` should be called as `drawString(text, x, y)` without a color argument on the tested firmware.
  - [x] Confirm button mapping: lower middle button is `BtnA`, right button is `BtnB`, power/mode button is unused.
  - [x] Verify compact two-level menu smoke test on the physical StickS3.
  - [x] Regenerate center sprites as RGBA transparent PNGs and upload all device assets to `/flash/res`.
  - [x] Upload formal Python app files to `/flash` and start `main.main()` on the physical StickS3.
  - [ ] Test boot default day/night image on the physical StickS3.
  - [ ] Test `BtnB` tool cycling on the physical StickS3.
  - [ ] Test W/F/T/S actions on the physical StickS3.
  - [ ] Test export text screen on the physical StickS3.
  - [ ] Test QR export scanning after adding a QR renderer.
  - [ ] Test reboot persistence on the physical StickS3.
