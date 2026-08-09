import type { WeeklyMetric, WeeklyPreference as WeeklyPreferenceValue } from "../pages/weekData";
import { useI18n } from "../i18n";

const options: WeeklyMetric[] = ["mood", "food", "sleep", "movement", "water", "body", "notes"];

export function WeeklyPreference({ value, onChange, onClose }: { value: WeeklyPreferenceValue; onChange: (value: WeeklyPreferenceValue) => void; onClose: () => void }) {
  const { t } = useI18n();
  function toggle(metric: WeeklyMetric) {
    const selected = value.visibleMetrics.includes(metric);
    if (!selected && value.visibleMetrics.length >= 3) return;
    onChange({ visibleMetrics: selected ? value.visibleMetrics.filter((item) => item !== metric) : [...value.visibleMetrics, metric] });
  }

  return (
    <div className="weekly-preference" role="dialog" aria-label={t("week.chooseHighlights")}>
      <header><div><small>{t("week.focus")}</small><h2>{t("week.chooseHighlights")}</h2></div><button aria-label={t("week.closeFocus")} onClick={onClose} type="button">×</button></header>
      <p>{t("week.focusHint")}</p>
      <div className="weekly-preference-options">
        {options.map((option) => {
          const selected = value.visibleMetrics.includes(option);
          const disabled = !selected && value.visibleMetrics.length >= 3;
          return <button aria-pressed={selected} className={selected ? "is-selected" : ""} disabled={disabled} key={option} onClick={() => toggle(option)} type="button"><span />{t(`metric.${option}` as "metric.mood")}</button>;
        })}
      </div>
      <small>{t("week.selectedCount", { count: value.visibleMetrics.length })}</small>
    </div>
  );
}
