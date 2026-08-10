import { AngryIllustration, AnxiousIllustration, CalmIllustration, ConfusedIllustration, EmoIllustration, ExcitedIllustration, HappyIllustration, LovedIllustration, SadIllustration, SleepyIllustration, TiredIllustration } from "@luna-body-tracker/ui";
import { MoveDownRight } from "lucide-react";
import type { MoodId, WeekDay, WeeklyMetric } from "../pages/weekData";
import { useI18n, type TFunction } from "../i18n";

const moodMeta = {
  calm: { Illustration: CalmIllustration },
  happy: { Illustration: HappyIllustration },
  tired: { Illustration: TiredIllustration },
  sad: { Illustration: SadIllustration },
  emo: { Illustration: EmoIllustration },
  angry: { Illustration: AngryIllustration },
  excited: { Illustration: ExcitedIllustration },
  anxious: { Illustration: AnxiousIllustration },
  sleepy: { Illustration: SleepyIllustration },
  loved: { Illustration: LovedIllustration },
  confused: { Illustration: ConfusedIllustration },
} satisfies Record<MoodId, { Illustration: typeof CalmIllustration }>;

function firstFood(day: WeekDay, t: TFunction) {
  const entry = Object.entries(day.meals).find(([, value]) => value);
  if (entry) return `${t(`meal.${entry[0]}` as "meal.breakfast")} · ${entry[1]}`;
  return day.foods.join(" · ") || null;
}

function metricCopy(day: WeekDay, metric: WeeklyMetric, t: TFunction) {
  if (metric === "food") {
    const value = firstFood(day, t);
    return value ? { label: metric, value } : null;
  }
  if (metric === "sleep") return day.sleep === undefined ? null : { label: metric, value: t(day.sleep >= 7 ? "week.sleepGood" : "week.sleepShort", { hours: day.sleep }) };
  if (metric === "movement") return day.movement ? { label: metric, value: day.movement } : null;
  if (metric === "water") return day.water ? { label: metric, value: t("week.waterSummary", { count: day.water }) } : null;
  if (metric === "body") return day.poop || day.weight ? { label: metric, value: day.poop || day.weight } : null;
  if (metric === "notes") return day.notes ? { label: metric, value: day.notes } : null;
  return null;
}

export function DaySummaryCard({ day, visibleMetrics, onOpen }: { day: WeekDay; visibleMetrics: WeeklyMetric[]; onOpen: () => void }) {
  const { t } = useI18n();
  const MoodIllustration = day.mood ? moodMeta[day.mood].Illustration : null;
  const highlights = visibleMetrics
    .filter((metric) => metric !== "mood")
    .map((metric) => metricCopy(day, metric, t))
    .filter((highlight): highlight is NonNullable<typeof highlight> => highlight !== null)
    .slice(0, 3);

  return (
    <article className="day-summary-card">
      <header>
        <time>{day.date.slice(5).replace("/", ".")}</time>
        {MoodIllustration && <div className="day-summary-mood" aria-label={day.mood}><MoodIllustration decorative size="100%" /></div>}
      </header>
      <div className="day-summary-highlights">
        {highlights.length ? highlights.map((highlight) => <p key={highlight.label}><span>{highlight.value}</span></p>) : <p className="day-summary-empty"><span>{t("week.noRecord")}</span></p>}
      </div>
      <button className="view-day-button" aria-label={t("week.viewDayLabel", { weekday: day.weekday })} onClick={onOpen} type="button"><MoveDownRight aria-hidden="true" size={15} strokeWidth={1.7} /></button>
    </article>
  );
}
