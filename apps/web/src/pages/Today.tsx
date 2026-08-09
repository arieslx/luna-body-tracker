import { useEffect, useRef, useState } from "react";
import { BodySection } from "../components/BodySection";
import { DrinkSection } from "../components/DrinkSection";
import { FeelingSection } from "../components/FeelingSection";
import { FoodSection } from "../components/FoodSection";
import { anchors, LifeAnchor, type SectionId } from "../components/LifeAnchor";
import { MovementSection, type ExerciseEntry } from "../components/MovementSection";
import { NotesSection } from "../components/QuietSections";
import { SleepSection } from "../components/SleepSection";
import { useLunaRecords } from "../data/record-context";
import { toLocalDateKey } from "../data/dates";
import { filledSections, moduleValue } from "../data/record-mapper";

type TextValue = { text: string };
type MoodValue = { value: string };
type SleepValue = { value: number; unit: "hour"; bedtime?: string; wakeTime?: string };
type FoodPoolValue = Record<string, { name: string; amount: number; label?: string }>;
type MealsValue = Record<string, string | undefined>;
type WaterValue = { value: number; unit: "bowl"; targetValue?: number };
type DrinksValue = { selected: string[] };
type PoopValue = { count: number; label?: string };
type WeightValue = { kg: number };
type ExerciseValue = { entries: ExerciseEntry[] };

export function Today({ onOpenSettings }: { onOpenSettings: () => void }) {
  const [active, setActive] = useState<SectionId>("feeling");
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [transientFilled, setTransientFilled] = useState<Set<SectionId>>(() => new Set());
  const scrollRef = useRef<HTMLDivElement>(null);
  const { getRecord, updateModule } = useLunaRecords();
  const today = toLocalDateKey();
  const record = getRecord(today);
  const filled = new Set([...filledSections(record), ...transientFilled]);
  const mood = moduleValue<MoodValue>(record, "mood")?.value;
  const note = moduleValue<TextValue>(record, "note")?.text ?? "";
  const sleep = moduleValue<SleepValue>(record, "sleep");
  const foodPool = moduleValue<FoodPoolValue>(record, "foodPool") ?? {};
  const meals = moduleValue<MealsValue>(record, "meals") ?? {};
  const water = moduleValue<WaterValue>(record, "water")?.value ?? 0;
  const selectedDrinks = moduleValue<DrinksValue>(record, "drinks")?.selected ?? [];
  const poopCount = moduleValue<PoopValue>(record, "poop")?.count ?? 0;
  const weightKg = moduleValue<WeightValue>(record, "weight")?.kg;
  const exerciseEntries = moduleValue<ExerciseValue>(record, "exercise")?.entries ?? [];

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.getAttribute("data-section") as SectionId);
      },
      { root, rootMargin: "-12% 0px -42% 0px", threshold: [0.08, 0.25, 0.5] },
    );
    root.querySelectorAll("[data-section]").forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  function scrollTo(id: SectionId) {
    const root = scrollRef.current;
    const target = root?.querySelector(`#${id}`);
    if (root && target) root.scrollTo({ top: (target as HTMLElement).offsetTop, behavior: "smooth" });
  }

  function submitSearch(event: React.FormEvent) {
    event.preventDefault();
    const query = search.trim().toLowerCase();
    const match = anchors.find((item) => item.label.toLowerCase().includes(query) || item.id.includes(query));
    if (match) {
      scrollTo(match.id);
      setSearchOpen(false);
      setSearch("");
    }
  }

  function markFilled(id: SectionId, value: boolean) {
    setTransientFilled((current) => {
      const next = new Set(current);
      if (value) next.add(id); else next.delete(id);
      return next;
    });
  }

  return (
    <div className="today-page">
      <div className="today-top-actions">
        <button className="today-more-button" aria-label="打开设置" onClick={onOpenSettings} type="button"><i /><i /><i /></button>
        <button className="today-search-button" aria-label="搜索今天的状态" aria-expanded={searchOpen} onClick={() => setSearchOpen((open) => !open)} type="button"><span /></button>
      </div>
      {searchOpen && <form className="today-search-popover" onSubmit={submitSearch}>
        <input aria-label="搜索区域" autoFocus onChange={(event) => setSearch(event.target.value)} placeholder="Mood, Sleep, Food…" value={search} />
        <button type="submit">Go</button>
      </form>}
      <LifeAnchor active={active} filled={filled} onSelect={scrollTo} />
      <div className="today-scroll" ref={scrollRef}>
        <FeelingSection value={mood} onChange={(value) => updateModule(today, "mood", { value })} />
        <SleepSection value={sleep} onChange={(value) => updateModule(today, "sleep", value)} />
        <FoodSection
          selected={Object.keys(foodPool)}
          mealNotes={meals as Record<string, string>}
          onSelectedChange={(selected) => updateModule(today, "foodPool", Object.fromEntries(selected.map((name) => [name, { name, amount: 1 }]))) }
          onMealNotesChange={(value) => updateModule(today, "meals", Object.values(value).some((entry) => entry?.trim()) ? value : undefined)}
        />
        <DrinkSection
          water={water}
          selectedDrinks={selectedDrinks}
          onWaterChange={(value) => updateModule(today, "water", value > 0 ? { value, unit: "bowl", targetValue: 8 } : undefined)}
          onSelectedDrinksChange={(selected) => updateModule(today, "drinks", selected.length ? { selected } : undefined)}
        />
        <MovementSection entries={exerciseEntries} onChange={(entries) => updateModule(today, "exercise", entries.length ? { entries } : undefined)} />
        <BodySection
          poopCount={poopCount}
          weightKg={weightKg}
          onPoopCountChange={(count) => updateModule(today, "poop", count > 0 ? { count, label: count >= 3 ? "3+" : String(count) } : undefined)}
          onWeightKgChange={(kg) => updateModule(today, "weight", kg === undefined ? undefined : { kg })}
        />
        <NotesSection value={note} onChange={(text) => updateModule(today, "note", text.trim() ? { text } : undefined)} />
      </div>
    </div>
  );
}
