# Tree Hole Tamagotchi for StickS3

Working folder for the M5Stack StickS3 companion app.

The first target is a low-pressure electronic pet and daily care logger named
Tree Hole Tamagotchi. The pet is a cute personified tree. It never dies, never
decays, and never punishes missed check-ins.

Development tasks are tracked in [roadmap.md](roadmap.md).

Target hardware:

- M5Stack StickS3
- 135x240 ST7789P3 LCD
- ESP32-S3-PICO-1-N8R8
- BMI270 IMU
- KEY1 / KEY2 buttons
- MEMS microphone and speaker
- UiFlow2 / MicroPython first, with Arduino or ESP-IDF kept as fallbacks

Confirmed UiFlow2 device mapping:

- Use USB mode with UiFlow2 WebTerminal for MVP testing.
- `M5.Display` supports `drawImage` and `drawString`.
- `M5.Display.qrcode` is not available on the tested firmware.
- `BtnA` is the lower middle button and executes the active tool.
- `BtnB` is the right button and switches tools.
- The power/mode button is not used by the app.

Asset folders:

- `assets-device/`: StickS3-ready PNG assets kept directly in the repository.
  - Backgrounds are `135x240` RGB PNGs.
  - Center sprites are `110x160` RGBA PNGs with transparent backgrounds.
  - These files are the canonical app assets for the MVP.

MVP direction:

- Render opaque day/night backgrounds from `assets-device/` on the StickS3 screen.
- Draw one replaceable center sprite over the active background.
- Use ASCII text labels in the bottom toolbar for water, food,
  trim/exercise, tree spirit, and export: `W`, `F`, `T`, `S`, `QR`.
- Use `active_tool_index` values `0..4` for water, food, trim/exercise,
  tree spirit, and export.
- Switch the main image to the corresponding PNG for the selected action.
- Use the food cycle protein / vegetable / staple, mapped to chicken,
  vegetable, and rice assets.
- Store the current day's care log locally.
- Export a compact JSON payload. MVP device testing uses a text fallback until
  a lightweight QR renderer is added.
- Do not require audio, STT, Wi-Fi sync, custom fonts, transparent backgrounds,
  streak bonuses, or animation in the MVP.
