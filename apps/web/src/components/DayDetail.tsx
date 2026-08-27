import { useEffect, useRef, useState } from "react";
import { AngryIllustration, AnxiousIllustration, CalmIllustration, ConfusedIllustration, EmoIllustration, ExcitedIllustration, HappyIllustration, LovedIllustration, SadIllustration, SleepyIllustration, TiredIllustration } from "@luna-body-tracker/ui";
import type { MoodId, WeekDay } from "../pages/weekData";
import { mealOrder } from "../pages/weekData";
import { useI18n } from "../i18n";

const moods = [
  { id: "calm", Illustration: CalmIllustration },
  { id: "happy", Illustration: HappyIllustration },
  { id: "tired", Illustration: TiredIllustration },
  { id: "sad", Illustration: SadIllustration },
  { id: "emo", Illustration: EmoIllustration },
  { id: "angry", Illustration: AngryIllustration },
  { id: "excited", Illustration: ExcitedIllustration },
  { id: "anxious", Illustration: AnxiousIllustration },
  { id: "sleepy", Illustration: SleepyIllustration },
  { id: "loved", Illustration: LovedIllustration },
  { id: "confused", Illustration: ConfusedIllustration },
] as const;

export function DayDetail({ day, onChange, onBack }: { day: WeekDay; onChange: (day: WeekDay) => void; onBack: () => void }) {
  const { t } = useI18n();
  const [movementDraft, setMovementDraft] = useState(day.movement);
  const [weightDraft, setWeightDraft] = useState(day.weight);
  const editingMovement = useRef(false);
  const editingWeight = useRef(false);

  useEffect(() => {
    if (!editingMovement.current) setMovementDraft(day.movement);
  }, [day.movement]);

  useEffect(() => {
    if (!editingWeight.current) setWeightDraft(day.weight);
  }, [day.weight]);

  function patch(values: Partial<WeekDay>) {
    onChange({ ...day, ...values });
  }

  function commitMovement() {
    editingMovement.current = false;
    if (movementDraft !== day.movement) patch({ movement: movementDraft });
  }

  function commitWeight() {
    editingWeight.current = false;
    if (weightDraft !== day.weight) patch({ weight: weightDraft });
  }

  return (
    <section className="day-detail">
      <header className="day-detail-header">
        <button aria-label={t("detail.back")} onClick={onBack} type="button">←</button>
        <div><p>{day.weekday}</p><h1>{day.date.slice(5).replace("/", " · ")}</h1></div>
        <small>{t("detail.dailyNotes")}</small>
      </header>

      <div className="day-detail-section">
        <h2>{t("detail.mood")}</h2>
        <div className="day-detail-moods">
          {moods.map(({ id, Illustration }) => <button aria-pressed={day.mood === id} className={day.mood === id ? "is-selected" : ""} key={id} onClick={() => patch({ mood: id as MoodId })} type="button"><Illustration decorative size="100%" /><span>{t(`mood.${id}` as "mood.calm")}</span></button>)}
        </div>
      </div>

      <label className="day-detail-section day-detail-inline"><span><strong>{t("detail.sleep")}</strong><small>{t("detail.sleepHint")}</small></span><span className="day-detail-unit"><input aria-label={t("detail.sleep")} inputMode="decimal" min="0" onChange={(event) => patch({ sleep: event.target.value ? Number(event.target.value) : undefined })} step="0.5" type="number" value={day.sleep ?? ""} /> {t("detail.hours")}</span></label>

      <div className="day-detail-section">
        <h2>{t("detail.food")}</h2>
        <div className="day-detail-meals">
          {mealOrder.map((meal) => <label key={meal}><span>{t(`meal.${meal}` as "meal.breakfast")}</span><textarea aria-label={t(`meal.${meal}` as "meal.breakfast")} onChange={(event) => patch({ meals: { ...day.meals, [meal]: event.target.value } })} placeholder={t("detail.mealPlaceholder")} rows={1} value={day.meals[meal] || ""} /></label>)}
        </div>
      </div>

      <label className="day-detail-section day-detail-inline"><span><strong>{t("detail.water")}</strong><small>{t("detail.waterHint")}</small></span><span className="day-detail-unit"><input aria-label={t("detail.water")} inputMode="numeric" min="0" max="8" onChange={(event) => patch({ water: event.target.value })} type="number" value={day.water} /> {t("detail.cups")}</span></label>

      <label className="day-detail-section day-detail-field"><span>{t("detail.movement")}</span><input
        aria-label={t("detail.movement")}
        onBlur={commitMovement}
        onChange={(event) => setMovementDraft(event.target.value)}
        onFocus={() => { editingMovement.current = true; }}
        onKeyDown={(event) => {
          if (event.key !== "Enter" || event.nativeEvent.isComposing) return;
          event.preventDefault();
          event.currentTarget.blur();
        }}
        placeholder={t("detail.movementPlaceholder")}
        value={movementDraft}
      /></label>

      <div className="day-detail-section">
        <h2>{t("detail.body")}</h2>
        <div className="day-detail-body-grid">
          <label><span>{t("detail.weight")}</span><input
            aria-label={t("detail.weight")}
            inputMode="decimal"
            onBlur={commitWeight}
            onChange={(event) => setWeightDraft(event.target.value)}
            onFocus={() => { editingWeight.current = true; }}
            onKeyDown={(event) => {
              if (event.key !== "Enter" || event.nativeEvent.isComposing) return;
              event.preventDefault();
              event.currentTarget.blur();
            }}
            placeholder="—"
            value={weightDraft}
          /></label>
          <label><span>{t("detail.poop")}</span><input aria-label={t("detail.poop")} onChange={(event) => patch({ poop: event.target.value })} placeholder="—" value={day.poop} /></label>
        </div>
      </div>

      <label className="day-detail-section day-detail-field"><span>{t("detail.supplements")}</span><input aria-label={t("detail.supplements")} onChange={(event) => patch({ supplements: event.target.value })} placeholder={t("detail.supplementsPlaceholder")} value={day.supplements} /></label>

      <label className="day-detail-section day-detail-field"><span>{t("detail.notes")}</span><textarea aria-label={t("detail.notes")} onChange={(event) => patch({ notes: event.target.value })} placeholder={t("detail.notesPlaceholder")} rows={4} value={day.notes} /></label>
    </section>
  );
}
