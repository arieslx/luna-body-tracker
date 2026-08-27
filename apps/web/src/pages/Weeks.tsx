import { useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Ellipsis } from "lucide-react";
import { DayDetail } from "../components/DayDetail";
import { WeeklyPreference } from "../components/WeeklyPreference";
import { WeekSummary } from "../components/WeekSummary";
import { dailyRecordToWeekDay, parseMovementText, type WeeklyPreference as WeeklyPreferenceValue } from "./weekData";
import { useLunaRecords } from "../data/record-context";
import { currentWeekDateKeys, dateKeyToLocalDate, shiftDateKey, toLocalDateKey } from "../data/dates";
import { useI18n } from "../i18n";
import { moduleValue } from "../data/record-mapper";
import { sleepValueFromDuration, type SleepValue } from "../data/sleep-time";

export function Weeks() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showPreference, setShowPreference] = useState(false);
  const [calendarDate, setCalendarDate] = useState(toLocalDateKey);
  const { getRecord, weeklyFocus, setWeeklyFocus, updateModule } = useLunaRecords();
  const { t } = useI18n();
  const dateKeys = currentWeekDateKeys(dateKeyToLocalDate(calendarDate));
  const currentDateKeys = currentWeekDateKeys();
  const isCurrentWeek = dateKeys[0] === currentDateKeys[0];
  const days = dateKeys.map((date) => dailyRecordToWeekDay(getRecord(date), t));
  const weekRange = `${dateKeys[0].replaceAll("-", ".")} — ${dateKeys[6].slice(5).replace("-", ".")}`;
  const preference: WeeklyPreferenceValue = { visibleMetrics: weeklyFocus };

  if (selectedDay !== null) {
    return <DayDetail day={days[selectedDay]} onBack={() => setSelectedDay(null)} onChange={(day) => {
      const existingSleep = moduleValue<SleepValue>(getRecord(day.recordDate), "sleep");
      updateModule(day.recordDate, "mood", day.mood ? { value: day.mood } : undefined);
      updateModule(day.recordDate, "sleep", day.sleep ? sleepValueFromDuration(day.sleep, existingSleep) : undefined);
      const { breakfast, lunch, dinner, snack } = day.meals;
      updateModule(day.recordDate, "meals", [breakfast, lunch, dinner, snack].some(Boolean) ? { breakfast, lunch, dinner, snack } : undefined);
      updateModule(day.recordDate, "water", day.water ? { value: Number(day.water), unit: "bowl", targetValue: 8 } : undefined);
      const movementEntries = parseMovementText(day.movement);
      updateModule(day.recordDate, "exercise", movementEntries.length ? { entries: movementEntries } : undefined);
      updateModule(day.recordDate, "poop", day.poop ? { count: Number.parseInt(day.poop) || 0, label: day.poop } : undefined);
      const kg = Number.parseFloat(day.weight);
      updateModule(day.recordDate, "weight", Number.isFinite(kg) && kg > 0 ? { kg } : undefined);
      updateModule(day.recordDate, "supplements", day.supplements.trim() ? { text: day.supplements } : undefined);
      updateModule(day.recordDate, "note", day.notes.trim() ? { text: day.notes } : undefined);
    }} />;
  }

  return (
    <section className="weeks-page">
      <header className="week-calendar-toolbar">
        <div className="week-calendar-navigation">
          <button aria-label={t("week.previousWeek")} onClick={() => setCalendarDate((date) => shiftDateKey(date, -7))} type="button"><ChevronLeft aria-hidden="true" size={17} /></button>
          <label className="week-date-control">
            <CalendarDays aria-hidden="true" size={14} />
            <span>{weekRange}</span>
            <input aria-label={t("week.chooseDate")} onChange={(event) => setCalendarDate(event.target.value || toLocalDateKey())} type="date" value={calendarDate} />
          </label>
          <button aria-label={t("week.nextWeek")} onClick={() => setCalendarDate((date) => shiftDateKey(date, 7))} type="button"><ChevronRight aria-hidden="true" size={17} /></button>
        </div>
        <div className="week-toolbar-actions">
          {!isCurrentWeek ? <button className="return-current-week" onClick={() => setCalendarDate(toLocalDateKey())} type="button">{t("week.currentWeek")}</button> : <span className="current-week-label">{t("week.thisWeek")}</span>}
          <button className="weekly-focus-trigger" aria-label={t("week.focusSettings")} onClick={() => setShowPreference(true)} type="button"><span>{t("week.focus")}</span><Ellipsis aria-hidden="true" size={17} strokeWidth={1.8} /></button>
        </div>
      </header>
      <WeekSummary days={days} onOpenDay={setSelectedDay} visibleMetrics={preference.visibleMetrics} />
      {showPreference ? <><button className="weekly-preference-scrim" aria-label={t("week.closeFocus")} onClick={() => setShowPreference(false)} type="button" /><WeeklyPreference onChange={(value) => setWeeklyFocus(value.visibleMetrics)} onClose={() => setShowPreference(false)} value={preference} /></> : null}
    </section>
  );
}
