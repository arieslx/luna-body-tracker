import { useRef } from "react";
import {
  AngryIllustration,
  CalmIllustration,
  EmoIllustration,
  HappyIllustration,
  SadIllustration,
  TiredIllustration,
} from "@luna-body-tracker/ui";

const emotions = [
  { name: "Calm", Illustration: CalmIllustration },
  { name: "Happy", Illustration: HappyIllustration },
  { name: "Tired", Illustration: TiredIllustration },
  { name: "Sad", Illustration: SadIllustration },
  { name: "Emo", Illustration: EmoIllustration },
  { name: "Angry", Illustration: AngryIllustration },
] as const;

export function EmotionCluster({ value, onChange }: { value?: string; onChange: (value: string) => void }) {
  const selected = Math.max(0, emotions.findIndex((emotion) => emotion.name.toLowerCase() === value?.toLowerCase()));
  const touchStart = useRef<number | null>(null);

  function chooseMood(index: number) {
    onChange(emotions[index].name.toLowerCase());
  }

  function chooseNext(direction: number) {
    chooseMood((selected + direction + emotions.length) % emotions.length);
  }

  return (
    <div className="emotion-picker">
      <div
        className="emotion-cluster"
        onTouchStart={(event) => { touchStart.current = event.touches[0]?.clientX ?? null; }}
        onTouchEnd={(event) => {
          if (touchStart.current === null) return;
          const distance = (event.changedTouches[0]?.clientX ?? touchStart.current) - touchStart.current;
          if (Math.abs(distance) > 34) chooseNext(distance < 0 ? 1 : -1);
          touchStart.current = null;
        }}
        aria-label={`Current feeling: ${emotions[selected].name}. Swipe horizontally to change.`}
      >
        <div className="emotion-name" aria-live="polite">{emotions[selected].name}</div>
        {emotions.map((emotion, index) => {
          const MoodIllustration = emotion.Illustration;
          return (
            <button
              aria-label={`Choose ${emotion.name}`}
              aria-pressed={selected === index}
              className={`emotion emotion-${index}${selected === index ? " is-selected" : ""}`}
              key={emotion.name}
              onClick={() => chooseMood(index)}
              type="button"
            >
              <MoodIllustration decorative size="100%" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
