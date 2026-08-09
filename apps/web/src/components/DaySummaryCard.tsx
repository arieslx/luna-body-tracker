import { AngryIllustration, CalmIllustration, EmoIllustration, HappyIllustration, SadIllustration, TiredIllustration } from "@luna-body-tracker/ui";
import type { MoodId, WeekDay, WeeklyMetric } from "../pages/weekData";
import { useI18n, type TFunction } from "../i18n";

const moodMeta = {
  calm: { Illustration: CalmIllustration },
  happy: { Illustration: HappyIllustration },
  tired: { Illustration: TiredIllustration },
  sad: { Illustration: SadIllustration },
  emo: { Illustration: EmoIllustration },
  angry: { Illustration: AngryIllustration },
} satisfies Record<MoodId, { Illustration: typeof CalmIllustration }>;

function firstFood(day: WeekDay, t: TFunction) {
  const entry = Object.entries(day.meals).find(([, value]) => value);
  if (entry) return `${t(`meal.${entry[0]}` as "meal.breakfast")} · ${entry[1]}`;
  return day.foods.join(" · ") || t("week.noFood");
}

function metricCopy(day: WeekDay, metric: WeeklyMetric, t: TFunction) {
  if (metric === "food") return { label: metric, value: firstFood(day, t) };
  if (metric === "sleep") return { label: metric, value: day.sleep === undefined ? t("week.noRecord") : t(day.sleep >= 7 ? "week.sleepGood" : "week.sleepShort", { hours: day.sleep }) };
  if (metric === "movement") return { label: metric, value: day.movement || t("week.noMovement") };
  if (metric === "water") return { label: metric, value: day.water ? t("week.waterSummary", { count: day.water }) : t("week.noRecord") };
  if (metric === "body") return { label: metric, value: day.poop || day.weight || t("week.noRecord") };
  if (metric === "notes") return { label: metric, value: day.notes || t("week.noNotes") };
  return null;
}

export function DaySummaryCard({ day, visibleMetrics, onOpen }: { day: WeekDay; visibleMetrics: WeeklyMetric[]; onOpen: () => void }) {
  const { t } = useI18n();
  const MoodIllustration = day.mood ? moodMeta[day.mood].Illustration : null;
  const highlights = visibleMetrics.filter((metric) => metric !== "mood").map((metric) => metricCopy(day, metric, t)).filter(Boolean).slice(0, 3);

  return (
    <article className="day-summary-card">
      <header>
        <time>{day.date.slice(5).replace("/", ".")}</time>
        {MoodIllustration && <div className="day-summary-mood" aria-label={day.mood}><MoodIllustration decorative size="100%" /></div>}
      </header>
      <div className="day-summary-highlights">
        {highlights.map((highlight) => highlight && <p key={highlight.label}><span>{highlight.value}</span></p>)}
      </div>
      <button className="view-day-button" aria-label={t("week.viewDayLabel", { weekday: day.weekday })} onClick={onOpen} type="button">&gt;</button>
    </article>
  );
}
