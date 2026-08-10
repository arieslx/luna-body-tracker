import { useRef, type CSSProperties } from "react";
import {
  AngryIllustration,
  AnxiousIllustration,
  CalmIllustration,
  ConfusedIllustration,
  EmoIllustration,
  ExcitedIllustration,
  HappyIllustration,
  LovedIllustration,
  SadIllustration,
  SleepyIllustration,
  TiredIllustration,
} from "@luna-body-tracker/ui";
import { useI18n, type MessageKey } from "../i18n";

const moods = [
  { id: "calm", labelKey: "mood.calm", messageKey: "today.mood.calmMessage", Illustration: CalmIllustration },
  { id: "happy", labelKey: "mood.happy", messageKey: "today.mood.happyMessage", Illustration: HappyIllustration },
  { id: "tired", labelKey: "mood.tired", messageKey: "today.mood.tiredMessage", Illustration: TiredIllustration },
  { id: "sad", labelKey: "mood.sad", messageKey: "today.mood.sadMessage", Illustration: SadIllustration },
  { id: "emo", labelKey: "mood.emo", messageKey: "today.mood.emoMessage", Illustration: EmoIllustration },
  { id: "angry", labelKey: "mood.angry", messageKey: "today.mood.angryMessage", Illustration: AngryIllustration },
  { id: "excited", labelKey: "mood.excited", messageKey: "today.mood.excitedMessage", Illustration: ExcitedIllustration },
  { id: "anxious", labelKey: "mood.anxious", messageKey: "today.mood.anxiousMessage", Illustration: AnxiousIllustration },
  { id: "sleepy", labelKey: "mood.sleepy", messageKey: "today.mood.sleepyMessage", Illustration: SleepyIllustration },
  { id: "loved", labelKey: "mood.loved", messageKey: "today.mood.lovedMessage", Illustration: LovedIllustration },
  { id: "confused", labelKey: "mood.confused", messageKey: "today.mood.confusedMessage", Illustration: ConfusedIllustration },
] as const;

type BubbleLayout = {
  x: number;
  y: number;
  size: number;
  zIndex: number;
  opacity: number;
};

type BubblePreset = readonly [x: number, y: number, size: number];

// One fixed, collision-free preset per selected mood. The selected bubble
// keeps its own anchor and only nearby bubbles move enough to make room.
const MOOD_PRESETS: readonly (readonly BubblePreset[])[] = [
  [[0,64,112],[108,60,52],[156,87,56],[118,148,54],[30,179,60],[82,237,56],[157,223,54],[27,301,58],[112,312,56],[157,383,54],[60,410,60]],
  [[17,97,56],[69,34,112],[177,96,56],[118,148,54],[30,170,60],[82,237,56],[157,223,54],[27,301,58],[112,312,56],[157,383,54],[60,410,60]],
  [[28,92,56],[80,56,52],[128,59,112],[110,160,54],[30,170,60],[82,237,56],[157,223,54],[27,301,58],[112,312,56],[157,383,54],[60,410,60]],
  [[28,92,56],[99,64,52],[164,74,56],[89,119,112],[30,170,60],[82,237,56],[158,224,54],[27,301,58],[112,312,56],[157,383,54],[60,410,60]],
  [[28,85,56],[99,64,52],[156,87,56],[118,148,54],[4,144,112],[85,241,56],[157,223,54],[27,301,58],[112,312,56],[157,383,54],[60,410,60]],
  [[28,92,56],[99,64,52],[156,87,56],[118,148,54],[26,164,60],[54,209,112],[167,221,54],[25,304,58],[114,318,56],[157,383,54],[60,410,60]],
  [[28,92,56],[99,64,52],[156,87,56],[117,147,54],[30,170,60],[71,239,56],[128,194,112],[27,301,58],[112,312,56],[157,383,54],[60,410,60]],
  [[28,92,56],[99,64,52],[156,87,56],[118,148,54],[30,170,60],[84,235,56],[157,223,54],[0,274,112],[114,312,56],[157,383,54],[60,410,60]],
  [[28,92,56],[99,64,52],[156,87,56],[118,148,54],[30,170,60],[80,231,56],[157,223,54],[24,301,58],[84,284,112],[159,386,54],[60,410,60]],
  [[28,92,56],[99,64,52],[156,87,56],[118,148,54],[30,170,60],[82,237,56],[157,223,54],[27,301,58],[110,308,56],[128,354,112],[60,410,60]],
  [[28,92,56],[99,64,52],[156,87,56],[118,148,54],[30,170,60],[82,237,56],[157,223,54],[27,301,58],[112,312,56],[157,383,54],[34,384,112]],
] as const;

const MUTED_OPACITY = [0.48, 0.44, 0.5, 0.46, 0.52, 0.48, 0.44, 0.5, 0.46, 0.52, 0.48] as const;
const MOOD_LAYOUTS: readonly (readonly BubbleLayout[])[] = MOOD_PRESETS.map((preset, selectedIndex) =>
  preset.map(([x, y, size], moodIndex) => ({
    x,
    y,
    size,
    zIndex: moodIndex === selectedIndex ? 6 : 2,
    opacity: moodIndex === selectedIndex ? 1 : MUTED_OPACITY[moodIndex],
  })),
);

export function MoodCluster({ value, onChange }: { value?: string; onChange: (value: string) => void }) {
  const { t } = useI18n();
  const selected = Math.max(0, moods.findIndex((mood) => mood.id === value?.toLowerCase()));
  const touchStart = useRef<number | null>(null);

  function chooseMood(index: number) {
    if (index !== selected) onChange(moods[index].id);
  }

  function chooseNext(direction: number) {
    onChange(moods[(selected + direction + moods.length) % moods.length].id);
  }

  return (
    <div className="mood-picker">
      <div
        className="mood-cluster"
        onTouchStart={(event) => { touchStart.current = event.touches[0]?.clientX ?? null; }}
        onTouchEnd={(event) => {
          if (touchStart.current === null) return;
          const distance = (event.changedTouches[0]?.clientX ?? touchStart.current) - touchStart.current;
          if (Math.abs(distance) > 34) chooseNext(distance < 0 ? 1 : -1);
          touchStart.current = null;
        }}
        aria-label={t(moods[selected].labelKey as MessageKey)}
      >
        <div className="mood-name" aria-live="polite">{t(moods[selected].labelKey as MessageKey)}</div>
        {moods.map((mood, index) => {
          const MoodIllustration = mood.Illustration;
          const layout = MOOD_LAYOUTS[selected][index];
          const style: CSSProperties = {
            left: layout.x,
            top: layout.y,
            width: layout.size,
            height: layout.size,
            zIndex: layout.zIndex,
            opacity: layout.opacity,
          };

          return (
            <button
              aria-label={t(mood.labelKey as MessageKey)}
              aria-pressed={selected === index}
              className={`mood-bubble${selected === index ? " is-selected" : ""}`}
              key={mood.id}
              onClick={() => chooseMood(index)}
              style={style}
              type="button"
            >
              <MoodIllustration decorative size="100%" />
            </button>
          );
        })}
        <p className="mood-message" aria-live="polite">{t(moods[selected].messageKey as MessageKey)}</p>
      </div>
    </div>
  );
}
