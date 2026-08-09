export type TabId = "today" | "weeks" | "settings";

const tabs: Array<{ id: TabId; label: string }> = [
  { id: "today", label: "Today" },
  { id: "weeks", label: "Weeks" },
];

export function LunaTabs({ active, onChange }: { active: TabId; onChange: (tab: TabId) => void }) {
  return (
    <nav className="luna-tabs" aria-label="Main navigation">
      {tabs.map((tab) => (
        <button
          className={active === tab.id ? "tab is-active" : "tab"}
          key={tab.id}
          onClick={() => onChange(tab.id)}
          type="button"
        >
          <span className="tab-mark" aria-hidden="true" />
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
