import { DaySummaryCard } from "./DaySummaryCard";
import type { WeekDay, WeeklyMetric } from "../pages/weekData";
import { toLocalDateKey } from "../data/dates";

export function WeekSummary({ days, visibleMetrics, onOpenDay }: { days: WeekDay[]; visibleMetrics: WeeklyMetric[]; onOpenDay: (index: number) => void }) {
  return (
    <div className="week-summary-layout">
      <svg className="timeline-spine" aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 56 980"><path d="M27-12C38 64 17 116 24 178C30 235 40 279 29 348C19 409 34 453 26 515C18 574 12 629 25 688C38 747 20 808 28 866C34 914 22 953 25 992" /></svg>
      {days.map((day, index) => {
        const isToday = day.recordDate === toLocalDateKey();
        return (
          <div className="week-journal-row" key={day.date}>
            <div className={`week-timeline-node spine-node-${index}${isToday ? " is-today" : ""}`}><span title={day.weekday}>{day.weekday.replace("星期", "周")}</span></div>
            <DaySummaryCard day={day} visibleMetrics={visibleMetrics} onOpen={() => onOpenDay(index)} />
          </div>
        );
      })}
    </div>
  );
}
