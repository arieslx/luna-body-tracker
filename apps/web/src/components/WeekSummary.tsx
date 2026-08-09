import { DaySummaryCard } from "./DaySummaryCard";
import type { WeekDay, WeeklyMetric } from "../pages/weekData";

export function WeekSummary({ days, visibleMetrics, onOpenDay }: { days: WeekDay[]; visibleMetrics: WeeklyMetric[]; onOpenDay: (index: number) => void }) {
  return (
    <div className="week-summary-layout">
      <svg className="week-stream" aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 90 980"><path d="M0 0H57C77 30 76 82 56 109C41 129 43 167 62 190C79 214 77 263 55 290C40 310 42 351 63 375C80 398 76 448 53 473C40 491 43 535 64 559C80 582 77 632 55 657C39 677 42 720 62 744C79 768 76 818 54 843C40 863 43 910 62 934C70 946 70 963 66 980H0Z" /></svg>
      {days.map((day, index) => {
        return (
          <div className="week-journal-row" key={day.date}>
            <div className="week-timeline-node"><span title={day.weekday}>{day.weekday.replace("星期", "周")}</span></div>
            <DaySummaryCard day={day} visibleMetrics={visibleMetrics} onOpen={() => onOpenDay(index)} />
          </div>
        );
      })}
    </div>
  );
}
