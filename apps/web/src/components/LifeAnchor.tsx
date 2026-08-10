import { useI18n, type MessageKey } from "../i18n";

export type SectionId = "feeling" | "sleep" | "food" | "drink" | "movement" | "body" | "notes";

export const anchors: Array<{ id: SectionId; labelKey: MessageKey }> = [
  { id: "feeling", labelKey: "metric.mood" },
  { id: "sleep", labelKey: "metric.sleep" },
  { id: "food", labelKey: "metric.food" },
  { id: "drink", labelKey: "metric.water" },
  { id: "movement", labelKey: "metric.movement" },
  { id: "body", labelKey: "metric.body" },
  { id: "notes", labelKey: "metric.notes" },
];

export function LifeAnchor({ active, filled, onSelect }: { active: SectionId; filled: Set<SectionId>; onSelect: (id: SectionId) => void }) {
  const { t } = useI18n();
  return (
    <nav className="life-anchor" aria-label={t("today.rail.label")}>
      <div className="anchor-list">
        {anchors.map((item) => (
          <button
            aria-current={active === item.id ? "step" : undefined}
            className={`anchor-item${active === item.id ? " is-active" : ""}${filled.has(item.id) ? " is-filled" : ""}`}
            key={item.id}
            onClick={() => onSelect(item.id)}
            type="button"
          >
            <span className="anchor-dot" aria-hidden="true" />
            {t(item.labelKey)}
          </button>
        ))}
      </div>
    </nav>
  );
}
