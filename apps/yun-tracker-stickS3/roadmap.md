# Yun Tracker StickS3 Roadmap

## Product Direction

Build a small island-style StickS3 game inspired by an original eastern fantasy
"fate island" mood. The game is light-record driven, has no death, no hunger
punishment, and no failure state.

Core narrative:

```text
Lan is not an external pet. Lan is the user's small avatar inside this world.
When the user cares for Lan, they are also caring for themself.
```

Product concept:

```text
兰是你的小小分身，你记录自己的日常，她就在安得台里慢慢生活。
```

The first playable loop should feel more game-like than the previous static
tracker:

```text
Home island
  -> select one of 8 entrances
  -> enter a mapped platform scene
  -> play a small Lan Hua action animation
  -> show a bubble action prompt
  -> confirm the bubble action
  -> write a light daily record
  -> increase island energy
  -> return to home island
```

## Current Implemented Gameplay

The current build uses a no-bubble, top-text interaction model:

```text
Home island
  -> BtnB moves across 8 entrance icons
  -> Lan idles on the home island with lan_stand_0/1
  -> BtnA enters the selected platform
  -> top text shows the selected action or option
  -> BtnB switches mood / food sub-options when available
  -> BtnA starts Lan's action animation
  -> daily_log is updated locally
  -> completion copy appears at the top
  -> normal actions auto-return home
  -> oracle action opens the summary scroll
```

Implemented interaction details:

- Home scene draws `day.png` / `night.png` over `day_bg.png` / `night_bg.png`.
- Home scene includes Lan idle animation using `lan_stand_0.png` and `lan_stand_1.png`.
- Platform entry still renders full platform scenes such as `platform_mood.png`, `platform_food.png`, and `platform_oracle.png`.
- Platform text is rendered as compact English pixel text at the top of the screen.
- Bubble images are not used in the current runtime UI.
- `mood` is single-choice: `Happy`, `Sad`, `Angry`, `Calm`, `Tired`, `Emo`.
- `food` is single-choice: `Meat`, `Egg`, `Dairy`, `Veg`, `Fruit`, `Good fat`, `Carbs`.
- `water`, `sleep`, `stress`, `poop`, `sport`, and `oracle` are direct actions.
- Normal completion text is rendered as a top overlay without a full scene redraw.
- Oracle platform still uses `platform_oracle.png`; after the oracle action completes, the summary screen switches to `oracle.png`.
- The oracle summary reads real `daily_log` counts, not hard-coded numbers.
- Recommended device startup uses the custom Yun A/B menu.
- Yun Tracker can still be started manually through a tiny UIFlow2 Python launcher project when needed.
- A/B startup launcher behavior:
  - `BtnA`: start Yun Tracker.
  - `BtnB`: temporarily enter the official UIFlow2 system without changing the next boot.
- Yun Tracker attempts network-only startup before NTP time sync.
- If WiFi is available, the device time is synced with NTP and converted to UTC+8 before loading today's record.

Implemented rendering rules:

- `home -> platform` is allowed to use a full scene render.
- Home Lan idle uses local dirty-rectangle refresh only.
- Platform option switching uses top-area overlay refresh only.
- Platform action animation uses Lan dirty-rectangle refresh only.
- Completion copy uses top-area overlay refresh only.
- Oracle summary is a major scene switch and uses a full render.

## Implemented Task Checklist

- [x] Create `apps/yun-tracker-stickS3`.
- [x] Use existing `assets-device/` resources without automatic image processing.
- [x] Render day/night home scenes.
- [x] Render 8 entrance icons in top and bottom rows.
- [x] Support two-button interaction: `BtnB` next, `BtnA` confirm.
- [x] Enter platform scenes from the home island.
- [x] Support mood and food sub-options as single-choice records.
- [x] Store daily records in `/flash/yun_daily.json`.
- [x] Count nested mood and food categories in summary totals.
- [x] Add Lan action frame animations per platform.
- [x] Add Lan home idle animation with local refresh.
- [x] Remove bubble UI from runtime and use top text instead.
- [x] Add compact pixel text renderer for English text.
- [x] Add word wrapping for long top text.
- [x] Add local dirty-rectangle refresh for action frames.
- [x] Add local top-area refresh for option and completion text.
- [x] Add oracle summary scroll image using `oracle.png`.
- [x] Document full-screen flash troubleshooting in `troubleshooting.md`.
- [x] Add a system-friendly launcher menu at `/flash/main.py`.
- [x] Add a tiny UIFlow2 Python launcher project for manual start from the official system.
- [x] Keep the official UIFlow2 `boot.py` intact.
- [x] Add `BtnB -> temporary official UIFlow2 system` recovery path.
- [x] Add startup-time NTP sync attempt for the daily date key.

## Hardware Constraints

- Target device: M5Stack StickS3 with UiFlow2 / MicroPython.
- Display: `135x240`.
- Safe controls:
  - `BtnB`: switch selection / next option.
  - `BtnA`: confirm / enter / return.
  - Power or mode button is not used by the app.
- Known display limitation from prior testing:
  - Use `M5.Display.drawString(text, x, y)` only.
  - Do not pass a color argument to `drawString` on the tested firmware.
- Image assets must be prepared by the user in `assets-device/`.
  - Do not resize, crop, recolor, or regenerate images unless explicitly asked.

## MVP Visual Layout

- Main background:
  - `day.png`
  - `night.png`
- Screen layout:
  - Top row: 4 entrance icons.
  - Center: main island / fate tree scene.
  - Bottom row: 4 entrance icons.
- Tree mirror:
  - The mirror on the tree trunk is the visual doorway for the oracle / answer
    book.
  - Because StickS3 is not touch-based, the mirror is still selected through
    the same `BtnB` selection loop.

## 8 Entrances

| Key | Entrance | Record Field | First Platform Concept | Lan Hua Action |
| --- | --- | --- | --- | --- |
| `mood` | Mood | `mood` | shared mood platform | rest in sunlight |
| `stress` | Stress | `stress` | shared mood platform | rest and release |
| `poop` | Poop | `poop` | orchid soil platform | fertilize flowers |
| `food` | Food | `food` | shared food platform | make flower cake |
| `water` | Water | `water` | shared food platform | brew morning dew |
| `sleep` | Sleep | `sleep` | cloud bed platform | sleep on cloud bed |
| `sport` | Sport | `sport` | fate leaf platform | trim fate leaves |
| `oracle` | Mirror / Oracle | `oracle` | answer book scene | open answer book |

## Scene Mapping

The game has 8 entrances but 6 platform background scenes:

| Entrance | Platform Asset | Lan Hua Frames | Bubble Side |
| --- | --- | --- | --- |
| `mood` | `platform_mood.png` | `lan_mood_0..2.png` | left |
| `stress` | `platform_mood.png` | `lan_mood_0..2.png` | left |
| `poop` | `platform_poop.png` | `lan_poop_0..2.png` | right |
| `food` | `platform_food.png` | `lan_food_0..1.png` | right |
| `water` | `platform_food.png` | `lan_water_0..1.png` | right |
| `sleep` | `platform_sleep.png` | `lan_sleep_0..1.png` | left |
| `sport` | `platform_sport.png` | `lan_sport_0..2.png` | right |
| `oracle` | `platform_oracle.png` | `lan_oracle_0..2.png` | right |

Shared idle / movement frames:

- `lan_stand_0..1.png`
- `lan_walk_0..1.png`

Poop frames use the current asset filenames exactly:

- `lan_poop_0.png`
- `lan_poop_1.png`
- `lan_poop_2.png`

Current bubble assets:

- `bubble_left.png`
- `bubble_right.png`

Bubble assets are visual prompts. They do not need text for MVP; the action
meaning comes from the selected entrance and platform.

## Bubble Copy

Bubble text should be short enough for the `135x240` screen. Prefer 2-6 Chinese
characters per line, with at most two lines. Tone should feel gentle, playful,
and non-judgmental.

MVP bubble copy pairs a poetic world action with a plain real-life meaning.
First-use or early-use screens should show both lines so the user does not need
to guess the mapping.

Because the built-in Chinese font is currently 24px and visually too large for
the bubble, MVP implementation uses compact English copy first, while keeping
the Chinese copy as the narrative source text.

| Entrance | MVP English Text | English Small Text | Chinese Text | Chinese Small Text |
| --- | --- | --- | --- | --- |
| `mood` | `Sun` | `Mood` | `晒太阳` | `记录心情` |
| `stress` | `Breathe` | `Stress` | `松口气` | `记录压力` |
| `poop` | `Fertilize` | `Poop` | `施点肥` | `记录便便` |
| `food` | `Cake` | `Food` | `吃花饼` | `记录吃饭` |
| `water` | `Dew` | `Water` | `喝朝露` | `记录喝水` |
| `sleep` | `Cloud Bed` | `Sleep` | `睡云床` | `记录睡眠` |
| `sport` | `Fate Leaf` | `Move` | `修命簿` | `记录运动` |
| `oracle` | `Oracle` | `Today` | `问天极` | `查看今日` |

Optional alternative copy:

| Entrance | Alternative |
| --- | --- |
| `mood` | `晒一会` |
| `stress` | `缓一缓` |
| `poop` | `养兰土` |
| `food` | `做花饼` |
| `water` | `煮朝露` |
| `sleep` | `歇一歇` |
| `sport` | `剪枝叶` |
| `oracle` | `翻答案` |

## Narrative Onboarding

On first launch, show a very short fairy-tale style opening instead of a
manual-like explanation:

```text
你来啦。
这里是安得台，屏幕里的“兰”，便是今日的你。
吃饭、喝水、松口气、睡一觉，这些小事不必太郑重，顺手记下便好。
兰会替你在这里慢慢过完这一日。
```

Purpose:

- Explain that Lan is the user's avatar, not a separate pet.
- Explain that world actions correspond to body and mind records.
- Keep the tone soft and story-like.

Implementation note:

- MVP can store a boolean such as `seen_intro`.
- If text space is tight, split the intro into two screens.
- `BtnA` continues, `BtnB` skips.

## Completion Copy

After the user confirms a bubble action, the success message should connect
Lan's world action with the user's real self-care.

MVP implementation uses English completion copy first for font fit. Chinese
copy remains the source narrative for later PNG text or custom font work.

| Entrance | MVP English Completion | Chinese Completion |
| --- | --- | --- |
| `mood` | `Lan got sun. / Your mood returns.` | `兰晒了一会儿太阳，心情暂且归位。` |
| `stress` | `A breath loosened. / No need to fight today.` | `这一口气松得不错，今日先不和自己较劲。` |
| `poop` | `The field is loose. / Your body feels lighter.` | `兰田已松，身子也算通了几分。` |
| `food` | `Cake is eaten. / You did not neglect yourself.` | `花饼入腹，今日不算亏待自己。` |
| `water` | `Dew is drunk. / The dry fate is softer.` | `朝露已饮，干巴巴的命算是润了些。` |
| `sleep` | `Lan rests in clouds. / Big things can wait.` | `兰去云上躺会儿，天大的事醒了再说。` |
| `sport` | `One fate leaf trimmed. / Your body moved.` | `命簿修过一页，身子骨也没白闲着。` |
| `oracle` | `The oracle says: / today is okay.` | `天极说了半天，其实就是：今日尚可。` |

If screen space is tight, split long completion copy into two lines or two
short screens. The meaning should remain:

```text
兰做了某件事。
你也照顾了自己。
```

## Data Model

Daily record MVP:

```python
daily_log = {
    "mood": 0,
    "stress": 0,
    "poop": 0,
    "food": 0,
    "water": 0,
    "sleep": 0,
    "sport": 0,
    "oracle": 0,
    "island_energy": 0,
}
```

Rules:

- Every completed record increments its field by `1`.
- Every completed record increases `island_energy` by `10`.
- `island_energy` caps at `100`.
- Energy may slowly fade later, but there is no punishment language and no
  character death.
- Store current-day data locally as JSON.

## Bubble Interaction Model

The bubble is the second step of an action. Entering a platform does not
immediately record; the record is written only after the user confirms the
bubble action.

Recommended MVP interaction:

```text
Home
  BtnB: move selection across 8 entrances
  BtnA: enter selected platform

Platform Preview
  Draw platform background
  Draw Lan Hua idle/action frames
  Draw bubble prompt and bubble text
  BtnA: confirm bubble and record
  BtnB: cancel and return home

Platform Complete
  Increment daily record
  Increase island_energy
  Show completion copy briefly
  Auto-return home after 1.5-2 seconds
  BtnA: return home immediately
```

Why this model:

- It prevents accidental records from a single mistaken entry click.
- It gives the bubble a clear purpose: "do this small action now".
- It keeps the two-button interaction consistent.
- It leaves room for richer bubble choices later.

Possible later extension:

```text
Platform Choice
  BtnB: switch between two bubble choices
  BtnA: confirm selected bubble
```

Examples:

- `mood`: "rest" / "write mood"
- `stress`: "breathe" / "release"
- `food`: "cook" / "ate well"
- `oracle`: "open book" / "return"

MVP should use one bubble action per platform first.

Open bubble decisions:

- Whether `BtnB` on a platform always cancels to home, or can switch between
  multiple bubble choices later.
- Whether completing a bubble action returns home automatically, or stays on
  the platform until `BtnA`.
- Whether the bubble should be displayed immediately on platform entry, or
  appear after the first animation loop.
- Whether `oracle` uses the same bubble confirmation model or opens the answer
  book immediately after entering the platform.

## Oracle Daily Summary

The oracle scene is the best place to reinforce the core concept:

```text
今日小结
天极翻了翻今日命簿：

花饼 3 回
朝露 3小杯
兰田 1 次
云床 1 回
命簿修过 1 页

结论：
今日尚可，歇歇吧。
```

MVP summary can list today's non-zero records using world copy:

```text
吃花饼 3
喝朝露 1
施点肥 1
睡云床 1
修命簿 1
```

Closing tone example:

```text
天极说了半天，
其实就是：
今日尚可。
```

The oracle should make the user feel that recording daily life is an act of
self-care, not a productivity score.

## Phase 1: Background And Layout Probe

- [x] Create `apps/yun-tracker-stickS3`.
- [x] Add `assets-device/day.png` and `assets-device/night.png`.
- [x] Upload `day.png` and `night.png` to the physical StickS3 as isolated
  probe assets.
- [x] Verify day/night can be displayed on the physical StickS3.
- [ ] Define final top and bottom icon coordinates.
- [ ] Define the selection order across 8 entrances.
- [ ] Decide whether the oracle mirror also has a bottom icon or only uses the
  tree mirror visual.
- [ ] Define final bubble coordinates per platform.

Exit criteria:

- Home background looks acceptable on the physical `135x240` screen.
- `BtnB` can switch between day/night in a probe without changing the existing
  tracker autostart.

## Phase 2: Asset Contract

- [x] Add `assets-device/README.md`.
- [x] Document exact required filenames.
- [x] Document required dimensions for each asset group.
- [x] Document alpha expectations.
- [x] Document that image processing is manual/user-approved only.

Required MVP assets:

```text
assets-device/
  bubble_left.png
  bubble_right.png
  day.png
  day_bg.png
  night.png
  night_bg.png

  icon_mood.png
  icon_stress.png
  icon_poop.png
  icon_food.png
  icon_water.png
  icon_sleep.png
  icon_sport.png
  icon_oracle.png

  platform_mood.png
  platform_poop.png
  platform_food.png
  platform_sleep.png
  platform_sport.png
  platform_oracle.png

  lan_walk_0.png
  lan_walk_1.png

  lan_stand_0.png
  lan_stand_1.png

  lan_mood_0.png
  lan_mood_1.png
  lan_mood_2.png

  lan_poop_0.png
  lan_poop_1.png
  lan_poop_2.png

  lan_food_0.png
  lan_food_1.png

  lan_water_0.png
  lan_water_1.png

  lan_sleep_0.png
  lan_sleep_1.png

  lan_sport_0.png
  lan_sport_1.png
  lan_sport_2.png

  lan_oracle_0.png
  lan_oracle_1.png
  lan_oracle_2.png
```

Optional later assets:

```text
mirror_glow.png
oracle_flip_0.png
oracle_flip_1.png
oracle_flip_2.png
```

## Phase 3: Home Scene

- [x] Add portable config for display size, asset paths, and entrance order.
- [x] Add first-launch intro state and intro screen.
- [x] Add home renderer:
  - Draw day/night background.
  - Draw top 4 icons.
  - Draw bottom 4 icons.
  - Draw selected icon highlight.
  - Draw optional mirror highlight when oracle is selected.
- [x] Add `BtnB` selection loop.
- [x] Add `BtnA` entry into the selected platform.
- [x] Keep icon hit order independent from visual position.
- [ ] Verify home scene on the physical StickS3.

Exit criteria:

- User can cycle all 8 entrances from the home island.
- Selection is visually clear on the physical screen.

## Phase 4: Platform Scene System

- [x] Add entrance-to-platform mapping for 8 entrances and 6 platform assets.
- [x] Draw platform background for the selected entrance.
- [x] Draw Lan Hua action sprite frames for the selected entrance.
- [x] Draw left or right bubble prompt.
- [x] Draw bubble main text and small real-life explanation.
- [x] `BtnA` confirms the bubble action and writes the record.
- [x] `BtnB` cancels and returns to home from platform preview.
- [x] Support `BtnA` return to home.
- [x] Support auto-return after a short action duration.
- [x] Show completion copy after a confirmed record.
- [ ] Verify all platform scenes on the physical StickS3.

Exit criteria:

- Every entrance opens the correct mapped platform scene.
- Record is written only after bubble confirmation.
- User can always return to the home island.

## Phase 5: Frame Animation System

- [x] Implement PNG frame sequence animation.
- [x] Use `time.ticks_ms()` or equivalent timer logic.
- [x] Support 2-5 frames per action.
- [x] Keep frame timing configurable per action.
- [x] Avoid GIF until PNG frame animation is stable.
- [ ] Verify animation timing on the physical StickS3.

Exit criteria:

- At least one action scene plays a visible two-frame animation on StickS3.
- Animation does not crash or fall back to Cloud Mode.

## Phase 6: Light Record System

- [x] Add `state.py` with `daily_log`.
- [x] Increment the selected record field when the action completes.
- [x] Add `island_energy +10`, capped at `100`.
- [x] Add local JSON storage at `/flash/yun_daily.json`.
- [x] Load today's record on boot.
- [x] Create a fresh record when the date changes.
- [ ] Verify persistence on the physical StickS3.

Exit criteria:

- Records persist after returning home.
- Records persist after reboot.
- No punishment, death, hunger, or shame mechanics exist.

## Phase 7: Oracle / Answer Book

- [x] Add oracle scene.
- [x] Draw `platform_oracle.png`.
- [x] Use the bubble as the "open answer book" confirmation.
- [x] Add a small built-in answer list.
- [x] Show today's non-zero records as a gentle daily summary.
- [x] Include "你照顾了兰，也照顾了自己" in the summary flow.
- [x] Display short text using safe `drawString(text, x, y)`.
- [x] Return to home with `BtnA`.
- [ ] Verify oracle summary on the physical StickS3.

Exit criteria:

- Mirror/oracle entrance opens an answer book scene.
- User receives a short answer without network access.

## Phase 8: Device Packaging

- [x] Upload MVP Python files to `/flash/yun_app`.
- [x] Upload MVP assets to `/flash/yun-res`.
- [x] Keep the official UIFlow2 `boot.py` unchanged.
- [x] Add `launchers/uiflow_yun_launcher.py` for manual start from the official UIFlow2 system.
- [x] Keep lightweight A/B launcher at `/flash/main.py`.
- [x] Use `boot_option=0` as the default product boot mode.
- [x] Add `BtnA START YUN` to the A/B launcher.
- [x] Add `BtnB SYSTEM` to the A/B launcher; it temporarily enters the official UIFlow2 system without persisting `boot_option=1`.
- [x] Add network-only startup and NTP time sync before loading the daily log.
- [ ] Verify NTP sync after WiFi credentials are saved through the official setup flow.

Exit criteria:

- Game can run from the physical A/B launcher without WebTerminal.
- User can temporarily enter the official UIFlow2 Cloud / USB / Setup system from the launcher.
- Power cycling returns to the custom Yun A/B launcher.
- Daily records use a real date key when WiFi and NTP are available.

## Phase 9: Physical QA

- [x] Test day background.
- [ ] Test night background.
- [x] Test all 8 icon selections.
- [x] Test all 8 platform entries.
- [x] Test at least one animation per platform.
- [x] Test daily log persistence.
- [ ] Test oracle answer display.
- [x] Test launcher entry from boot.
- [x] Test `BtnB` official system recovery path.
- [x] Test WiFi credential persistence and NTP sync.
- [x] Test on battery power without USB.
- [ ] Investigate occasional black screen when pressing `BtnA` to enter Yun or a platform.
- [ ] Verify whether serial logs show `canvas enabled` or `canvas disabled` during the black-screen case.
- [ ] Add temporary memory diagnostics around device begin, canvas creation, platform entry, PNG drawing, and action completion.
- [ ] Compare behavior with WiFi/NTP startup enabled vs skipped to check memory fragmentation risk.
- [ ] Profile larger platform images first, especially `platform_poop.png`, `platform_food.png`, `platform_oracle.png`, and `platform_sport.png`.
- [ ] Consider replacing full-screen canvas pushes during local animation with smaller dirty canvases for top text and Lan frames.

Exit criteria:

- The first playable Yun island game runs on the physical StickS3.
- The user can choose between daily play and official system maintenance without reflashing.

## Phase 10: Performance Hardening

- [ ] Keep full scene rendering only for major transitions such as home, platform entry, oracle summary, and return home.
- [ ] Use a small top-text buffer or dirty rectangle for option text and completion text.
- [ ] Use a small Lan buffer or dirty rectangle for character animation frames.
- [ ] Avoid pushing a full-screen canvas for every local animation frame.
- [ ] Keep local refresh visually stable when switching `mood`, `food`, and random oracle text.
- [ ] Document the final rendering strategy after physical verification.

Exit criteria:

- Platform text updates do not visibly flicker.
- Lan animation feels closer to a slow Tamagotchi idle/action loop.
- Pressing `BtnA` does not occasionally enter a persistent black screen.
