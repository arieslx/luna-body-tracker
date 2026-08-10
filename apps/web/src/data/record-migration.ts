import { parseDailyRecord, type DailyRecord } from "@luna-body-tracker/schema";
import { normalizeSleepValue, type SleepValue } from "./sleep-time";

const moodAliases: Record<string, string> = {
  grin: "happy",
  smile: "calm",
  cry: "sad",
};

const foodAliases: Record<string, string> = {
  vegetable: "vegetable",
  vegetables: "vegetable",
  meat: "meat",
  seafood: "meat",
  staple: "staple",
  grains: "staple",
  tubers: "staple",
  milk: "milk",
  dairy: "milk",
  egg: "egg",
  eggs: "egg",
  oil: "oil",
  fruit: "fruit",
  snack: "snack",
  nuts: "other",
  other: "other",
};

type LegacySetting = Record<string, unknown>;

function customLabels(settings: LegacySetting[]) {
  const labels = new Map<string, string>();
  settings.forEach((setting) => {
    const items = setting.foodCustomItems;
    if (!Array.isArray(items)) return;
    items.forEach((item) => {
      if (!item || typeof item !== "object") return;
      const { id, label } = item as { id?: unknown; label?: unknown };
      if (typeof id === "string" && typeof label === "string") labels.set(id, label);
    });
  });
  return labels;
}

function customExerciseLabels(settings: LegacySetting[]) {
  const labels = new Map<string, string>();
  settings.forEach((setting) => {
    const items = setting.exerciseCustomItems;
    if (!Array.isArray(items)) return;
    items.forEach((item) => {
      if (!item || typeof item !== "object") return;
      const { id, label } = item as { id?: unknown; label?: unknown };
      if (typeof id === "string" && typeof label === "string") labels.set(id, label);
    });
  });
  return labels;
}

function customFoodId(id: string, labels: Map<string, string>) {
  const label = labels.get(id)?.toLowerCase();
  if (label && ["水果", "fruit"].includes(label)) return "fruit";
  if (label && ["零食", "snack"].includes(label)) return "snack";
  return "other";
}

function migrateFoodPool(value: unknown, settings: LegacySetting[]) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return value;
  const labels = customLabels(settings);
  const migrated: Record<string, { name: string; amount: number }> = {};
  Object.entries(value).forEach(([legacyId, entry]) => {
    const id = foodAliases[legacyId] ?? customFoodId(legacyId, labels);
    const amount = entry && typeof entry === "object" && Number.isFinite(Number((entry as { amount?: unknown }).amount))
      ? Number((entry as { amount?: unknown }).amount)
      : 1;
    migrated[id] = { name: id, amount: (migrated[id]?.amount ?? 0) + amount };
  });
  return migrated;
}

function migrateExercise(value: unknown, settings: LegacySetting[]) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return value;
  if (Array.isArray((value as { entries?: unknown }).entries)) return value;
  const legacy = value as Record<string, unknown>;
  const labels = customExerciseLabels(settings);
  const category = legacy.strength === true ? "strength" : "cardio";
  const entries = [...labels]
    .filter(([id]) => legacy[id] === true)
    .map(([, name]) => ({ category, name, minutes: 30 }));
  if (!entries.length && legacy.strength === true) entries.push({ category: "strength", name: "力量", minutes: 30 });
  if (!entries.length && legacy.aerobic === true) entries.push({ category: "cardio", name: "有氧", minutes: 30 });
  return entries.length ? { entries } : undefined;
}

export function migrateLegacyRecord(record: DailyRecord, settings: LegacySetting[] = []): DailyRecord {
  const modules = { ...record.modules };
  const mood = modules.mood;
  if (mood && typeof mood === "object" && !Array.isArray(mood)) {
    const value = (mood as { value?: unknown }).value;
    if (typeof value === "string" && moodAliases[value]) modules.mood = { value: moodAliases[value] };
  }
  if (modules.foodPool) modules.foodPool = migrateFoodPool(modules.foodPool, settings) as typeof modules.foodPool;
  if (modules.exercise) {
    const exercise = migrateExercise(modules.exercise, settings);
    if (exercise) modules.exercise = exercise;
    else delete modules.exercise;
  }
  const sleep = modules.sleep;
  if (sleep && typeof sleep === "object" && !Array.isArray(sleep)) {
    const candidate = sleep as Partial<SleepValue>;
    if (typeof candidate.value === "number" && candidate.unit === "hour") {
      modules.sleep = normalizeSleepValue(candidate as SleepValue);
    }
  }
  return parseDailyRecord({
    ...record,
    modules,
    meta: { ...record.meta, recordedModuleIds: Object.keys(modules) },
  });
}
