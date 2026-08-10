import { HouseHeart, TableProperties, type LucideIcon } from "lucide-react";

export type TabId = "today" | "weeks" | "settings";

const tabs: Array<{ id: TabId; label: string; Icon: LucideIcon }> = [
  { id: "today", label: "Today", Icon: HouseHeart },
  { id: "weeks", label: "Weeks", Icon: TableProperties },
];

export function LunaTabs({ active, onChange }: { active: TabId; onChange: (tab: TabId) => void }) {
  return (
    <nav className="luna-tabs" aria-label="Main navigation">
      {tabs.map((tab) => {
        const Icon = tab.Icon;
        return (
          <button
            aria-label={tab.label}
            aria-current={active === tab.id ? "page" : undefined}
            className={active === tab.id ? "tab is-active" : "tab"}
            key={tab.id}
            onClick={() => onChange(tab.id)}
            type="button"
          >
            <span className="tab-icon" aria-hidden="true"><Icon size={23} strokeWidth={1.7} /></span>
          </button>
        );
      })}
    </nav>
  );
}
