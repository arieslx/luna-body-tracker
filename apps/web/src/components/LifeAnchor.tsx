export type SectionId = "feeling" | "sleep" | "food" | "drink" | "movement" | "body" | "notes";

export const anchors: Array<{ id: SectionId; label: string }> = [
  { id: "feeling", label: "Mood" },
  { id: "sleep", label: "Sleep" },
  { id: "food", label: "Food" },
  { id: "drink", label: "Drink" },
  { id: "movement", label: "Movement" },
  { id: "body", label: "Body" },
  { id: "notes", label: "Notes" },
];

export function LifeAnchor({ active, filled, onSelect }: { active: SectionId; filled: Set<SectionId>; onSelect: (id: SectionId) => void }) {
  return (
    <aside className="life-anchor" aria-label="Today's states">
      <div className="anchor-list">
        {anchors.map((item) => (
          <button
            className={`anchor-item${active === item.id ? " is-active" : ""}${filled.has(item.id) ? " is-filled" : ""}`}
            key={item.id}
            onClick={() => onSelect(item.id)}
            type="button"
          >
            <span className="anchor-dot" aria-hidden="true" />
            {item.label}
          </button>
        ))}
      </div>
    </aside>
  );
}
