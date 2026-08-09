import { useRef, useState } from "react";

const durations = [10, 20, 30, 45, 61];
const aerobic = ["散步", "跑步", "跳绳", "骑行", "游泳"];
const anaerobic = ["力量", "核心", "深蹲", "拉伸", "瑜伽"];
type Entry = { index: number; minutes: number };
export type ExerciseEntry = { category: "cardio" | "strength"; name: string; minutes: number };

function durationMark(minutes: number) {
  return minutes > 60 ? "60+" : String(minutes);
}

function durationSummary(minutes: number) {
  return minutes > 60 ? "60min+" : `${minutes} min`;
}

function arcPoint(index: number, total: number, radius: number) {
  const angle = (270 - (index / (total - 1)) * 180) * Math.PI / 180;
  return { left: 258 + radius * Math.cos(angle), top: 125 + radius * Math.sin(angle) };
}

type DialProps = {
  kind: "aerobic" | "anaerobic";
  label: string;
  options: string[];
  entries: Entry[];
  active: number | null;
  onSelect: (index: number) => void;
  onMinutes: (value: number) => void;
};

function MovementDial({ kind, label, options, entries, active, onSelect, onMinutes }: DialProps) {
  const dialRef = useRef<HTMLDivElement>(null);
  const activeEntry = entries.find((entry) => entry.index === active);
  const minutes = activeEntry?.minutes ?? 30;

  function drag(event: React.PointerEvent, ring: "sport" | "time") {
    const rect = dialRef.current?.getBoundingClientRect();
    if (!rect) return;
    const progress = Math.max(0, Math.min(1, (event.clientY - rect.top - 25) / 200));
    if (ring === "sport") onSelect(Math.round(progress * (options.length - 1)));
    else onMinutes(durations[Math.round(progress * (durations.length - 1))]);
  }

  const sportPoint = arcPoint(active ?? 2, options.length, 100);
  const timePoint = arcPoint(durations.indexOf(minutes), durations.length, 65);

  return (
    <div className={`movement-zone movement-zone-${kind}${entries.length ? " is-selected" : ""}`}>
      <div className="movement-zone-copy"><span>{label}</span><small>{active === null ? "可选择多项" : `正在调整 · ${options[active]}`}</small></div>
      <div className="movement-dial" ref={dialRef}>
        <div className="movement-ring movement-ring-outer" aria-hidden="true" />
        <div className="movement-ring movement-ring-inner" aria-hidden="true" />
        {options.map((option, index) => {
          const point = arcPoint(index, options.length, 100);
          const isSelected = entries.some((entry) => entry.index === index);
          return <button className={`movement-option${isSelected ? " is-selected" : ""}${active === index ? " is-active" : ""}`} key={option} onClick={() => onSelect(index)} style={point} type="button">{option}</button>;
        })}
        {durations.map((duration, index) => {
          const point = arcPoint(index, durations.length, 65);
          return <button className={`duration-option${minutes === duration && active !== null ? " is-active" : ""}`} disabled={active === null} key={duration} onClick={() => onMinutes(duration)} style={point} type="button">{durationMark(duration)}</button>;
        })}
        {active !== null && <button
          aria-label={`${label}运动：${options[active]}`}
          className="movement-handle movement-handle-sport"
          onPointerDown={(event) => event.currentTarget.setPointerCapture(event.pointerId)}
          onPointerMove={(event) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) drag(event, "sport"); }}
          style={sportPoint}
          type="button"
        />}
        {active !== null && <button
          aria-label={`运动时间：${minutes > 60 ? "超过60分钟" : `${minutes}分钟`}`}
          className="movement-handle movement-handle-time"
          onPointerDown={(event) => event.currentTarget.setPointerCapture(event.pointerId)}
          onPointerMove={(event) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) drag(event, "time"); }}
          style={timePoint}
          type="button"
        />}
      </div>
    </div>
  );
}

export function MovementSection({ entries, onChange }: { entries: ExerciseEntry[]; onChange: (entries: ExerciseEntry[]) => void }) {
  const aerobicEntries = entries.filter((entry) => entry.category === "cardio").map((entry) => ({ index: aerobic.indexOf(entry.name), minutes: entry.minutes })).filter((entry) => entry.index >= 0);
  const anaerobicEntries = entries.filter((entry) => entry.category === "strength").map((entry) => ({ index: anaerobic.indexOf(entry.name), minutes: entry.minutes })).filter((entry) => entry.index >= 0);
  const [activeAerobic, setActiveAerobic] = useState<number | null>(null);
  const [activeAnaerobic, setActiveAnaerobic] = useState<number | null>(null);

  function updateCategory(category: "cardio" | "strength", next: Entry[]) {
    const labels = category === "cardio" ? aerobic : anaerobic;
    onChange([
      ...entries.filter((entry) => entry.category !== category),
      ...next.map((entry) => ({ category, name: labels[entry.index], minutes: entry.minutes }))
    ]);
  }

  function selectSport(index: number, category: "cardio" | "strength", current: Entry[], setActive: (index: number | null) => void) {
    if (!current.some((entry) => entry.index === index)) updateCategory(category, [...current, { index, minutes: 30 }]);
    setActive(index);
  }

  function setMinutes(value: number, category: "cardio" | "strength", active: number | null, current: Entry[]) {
    if (active === null) return;
    updateCategory(category, current.map((entry) => entry.index === active ? { ...entry, minutes: value } : entry));
  }

  function removeSport(index: number, category: "cardio" | "strength", current: Entry[], active: number | null, setActive: (index: number | null) => void) {
    const next = current.filter((entry) => entry.index !== index);
    updateCategory(category, next);
    if (active === index) setActive(next[0]?.index ?? null);
  }

  return (
    <section className="today-section movement-section" id="movement" data-section="movement">
      <header className="movement-heading">
        <p className="section-kicker">your pace</p>
        <h2>Movement</h2>
        <div className="movement-tags" aria-live="polite">
          {aerobicEntries.map((entry) => <button className={activeAerobic === entry.index ? "is-active" : ""} key={`a-${entry.index}`} onClick={() => setActiveAerobic(entry.index)} type="button">{aerobic[entry.index]} · {durationSummary(entry.minutes)} <i onClick={(event) => { event.stopPropagation(); removeSport(entry.index, "cardio", aerobicEntries, activeAerobic, setActiveAerobic); }}>×</i></button>)}
          {anaerobicEntries.map((entry) => <button className={activeAnaerobic === entry.index ? "is-active is-anaerobic" : "is-anaerobic"} key={`n-${entry.index}`} onClick={() => setActiveAnaerobic(entry.index)} type="button">{anaerobic[entry.index]} · {durationSummary(entry.minutes)} <i onClick={(event) => { event.stopPropagation(); removeSport(entry.index, "strength", anaerobicEntries, activeAnaerobic, setActiveAnaerobic); }}>×</i></button>)}
          {!aerobicEntries.length && !anaerobicEntries.length && <small>今天身体想怎样动一动？</small>}
        </div>
      </header>
      <MovementDial kind="aerobic" label="有氧" options={aerobic} entries={aerobicEntries} active={activeAerobic} onSelect={(index) => selectSport(index, "cardio", aerobicEntries, setActiveAerobic)} onMinutes={(value) => setMinutes(value, "cardio", activeAerobic, aerobicEntries)} />
      <MovementDial kind="anaerobic" label="无氧" options={anaerobic} entries={anaerobicEntries} active={activeAnaerobic} onSelect={(index) => selectSport(index, "strength", anaerobicEntries, setActiveAnaerobic)} onMinutes={(value) => setMinutes(value, "strength", activeAnaerobic, anaerobicEntries)} />
    </section>
  );
}
