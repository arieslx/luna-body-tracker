import { parseDailyRecord, type DailyRecord } from "./daily-record";

type ExtensionExportRecord = {
  date?: string;
  mood?: string;
  water?: { value?: number; unit?: "bowl"; targetValue?: number; cups?: number; targetCups?: number };
  sleep?: { value?: number; unit?: "hour"; hours?: number; slots?: number[]; labels?: string[] };
  weight?: { kg?: number };
  foodPool?: Record<string, { name?: string; amount?: number; label?: string }>;
  meals?: Record<string, string>;
  foodNote?: string;
  poop?: { count?: number; label?: string };
  note?: string;
  recordedModules?: string[];
};

export function migrateExtensionExportRecord(input: ExtensionExportRecord, timezone = "Asia/Shanghai"): DailyRecord {
  const date = input.date;
  if (!date) {
    throw new Error("Extension record is missing date.");
  }

  const modules: DailyRecord["modules"] = {};
  const recordedModuleIds = new Set(input.recordedModules ?? []);

  if (input.mood) modules.mood = { value: input.mood };
  if (input.water) modules.water = { value: input.water.value ?? input.water.cups ?? 0, unit: "bowl", targetValue: input.water.targetValue ?? input.water.targetCups };
  if (input.sleep) modules.sleep = { value: input.sleep.value ?? input.sleep.hours ?? input.sleep.slots?.length ?? 0, unit: "hour" };
  if (input.weight?.kg !== undefined) modules.weight = { kg: input.weight.kg };
  if (input.foodPool) modules.foodPool = input.foodPool;
  if (input.meals) modules.meals = input.meals;
  if (input.foodNote) modules.foodNote = { text: input.foodNote };
  if (input.poop) modules.poop = { count: input.poop.count ?? 0, label: input.poop.label };
  if (input.note) modules.note = { text: input.note };

  Object.keys(modules).forEach((moduleId) => recordedModuleIds.add(moduleId));

  return parseDailyRecord({
    id: `daily_${date}`,
    date,
    timezone,
    schemaVersion: 1,
    modules,
    meta: {
      recordedModuleIds: [...recordedModuleIds],
      source: "extension",
      createdAt: `${date}T00:00:00+08:00`,
      updatedAt: `${date}T23:59:00+08:00`
    }
  });
}
