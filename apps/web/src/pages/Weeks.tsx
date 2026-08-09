import { useState } from "react";
import { DayDetail } from "../components/DayDetail";
import { WeeklyPreference } from "../components/WeeklyPreference";
import { WeekSummary } from "../components/WeekSummary";
import { dailyRecordToWeekDay, type WeeklyPreference as WeeklyPreferenceValue } from "./weekData";
import { useLunaRecords } from "../data/record-context";
import { currentWeekDateKeys } from "../data/dates";
import { useI18n } from "../i18n";

export function Weeks() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showPreference, setShowPreference] = useState(false);
  const { getRecord, weeklyFocus, setWeeklyFocus, updateModule } = useLunaRecords();
  const { t } = useI18n();
  const days = currentWeekDateKeys().map((date) => dailyRecordToWeekDay(getRecord(date), t));
  const preference: WeeklyPreferenceValue = { visibleMetrics: weeklyFocus };

  if (selectedDay !== null) {
    return <DayDetail day={days[selectedDay]} onBack={() => setSelectedDay(null)} onChange={(day) => {
      updateModule(day.recordDate, "mood", day.mood ? { value: day.mood } : undefined);
      updateModule(day.recordDate, "sleep", day.sleep ? { value: day.sleep, unit: "hour" } : undefined);
      const { breakfast, lunch, dinner, snack } = day.meals;
      updateModule(day.recordDate, "meals", [breakfast, lunch, dinner, snack].some(Boolean) ? { breakfast, lunch, dinner, snack } : undefined);
      updateModule(day.recordDate, "water", day.water ? { value: Number(day.water), unit: "bowl", targetValue: 8 } : undefined);
      const movement = day.movement.trim().match(/^(.*?)(?:\s+(\d+|60\+)\s*min)?$/);
      const movementName = movement?.[1]?.trim();
      const strengthNames = new Set(["力量", "核心", "深蹲", "拉伸", "瑜伽"]);
      updateModule(day.recordDate, "exercise", movementName ? { entries: [{
        category: strengthNames.has(movementName) ? "strength" : "cardio",
        name: movementName,
        minutes: movement?.[2] === "60+" ? 61 : Number(movement?.[2] || 30)
      }] } : undefined);
      updateModule(day.recordDate, "poop", day.poop ? { count: Number.parseInt(day.poop) || 0, label: day.poop } : undefined);
      const kg = Number.parseFloat(day.weight);
      updateModule(day.recordDate, "weight", Number.isFinite(kg) && kg > 0 ? { kg } : undefined);
      updateModule(day.recordDate, "supplements", day.supplements.trim() ? { text: day.supplements } : undefined);
      updateModule(day.recordDate, "note", day.notes.trim() ? { text: day.notes } : undefined);
    }} />;
  }

  return (
    <section className="weeks-page">
      <button className="weekly-focus-trigger" aria-label={t("week.focusSettings")} onClick={() => setShowPreference(true)} type="button"><span>{t("week.focus")}</span>•••</button>
      <WeekSummary days={days} onOpenDay={setSelectedDay} visibleMetrics={preference.visibleMetrics} />
      {showPreference ? <><button className="weekly-preference-scrim" aria-label={t("week.closeFocus")} onClick={() => setShowPreference(false)} type="button" /><WeeklyPreference onChange={(value) => setWeeklyFocus(value.visibleMetrics)} onClose={() => setShowPreference(false)} value={preference} /></> : null}
    </section>
  );
}
