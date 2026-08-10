import { parseDailyRecord, type DailyRecord, type ModuleValue } from "@luna-body-tracker/schema";
import type { SectionId } from "../components/LifeAnchor";
import { getLocalTimezone } from "./dates";

export function createEmptyDailyRecord(date: string, now = new Date()): DailyRecord {
  const timestamp = now.toISOString();
  return {
    id: `daily:${date}`,
    date,
    timezone: getLocalTimezone(),
    schemaVersion: 1,
    modules: {},
    meta: { recordedModuleIds: [], source: "web", createdAt: timestamp, updatedAt: timestamp }
  };
}

export function updateRecordModule(
  record: DailyRecord,
  moduleId: string,
  value: ModuleValue | undefined,
  now = new Date()
): DailyRecord {
  const modules = { ...record.modules };
  if (value === undefined) delete modules[moduleId];
  else modules[moduleId] = value;
  return parseDailyRecord({
    ...record,
    modules,
    meta: {
      ...record.meta,
      recordedModuleIds: Object.keys(modules),
      updatedAt: now.toISOString()
    }
  });
}

export function moduleValue<T>(record: DailyRecord, moduleId: string): T | undefined {
  return record.modules[moduleId] as T | undefined;
}

export function filledSections(record: DailyRecord): Set<SectionId> {
  const filled = new Set<SectionId>();
  if (hasObjectValue(record.modules.mood, "value")) filled.add("feeling");
  if (hasPositiveNumber(record.modules.sleep, "value")) filled.add("sleep");
  if (hasFood(record)) filled.add("food");
  if (hasPositiveNumber(record.modules.water, "value") || hasNonEmptyArray(record.modules.drinks, "selected")) filled.add("drink");
  if (hasNonEmptyArray(record.modules.exercise, "entries")) filled.add("movement");
  if (hasPositiveNumber(record.modules.poop, "count") || hasPositiveNumber(record.modules.weight, "kg")) filled.add("body");
  if (hasObjectValue(record.modules.note, "text")) filled.add("notes");
  return filled;
}

function hasFood(record: DailyRecord): boolean {
  const pool = record.modules.foodPool;
  if (pool && typeof pool === "object" && Object.keys(pool).length > 0) return true;
  const meals = record.modules.meals;
  return Boolean(meals && typeof meals === "object" && Object.values(meals).some((value) => typeof value === "string" && value.trim()));
}

function hasObjectValue(value: unknown, key: string): boolean {
  if (!value || typeof value !== "object") return false;
  const entry = (value as Record<string, unknown>)[key];
  return typeof entry === "string" ? entry.trim().length > 0 : entry !== undefined && entry !== null;
}

function hasPositiveNumber(value: unknown, key: string): boolean {
  return Boolean(value && typeof value === "object" && Number((value as Record<string, unknown>)[key]) > 0);
}

function hasNonEmptyArray(value: unknown, key: string): boolean {
  return Boolean(value && typeof value === "object" && Array.isArray((value as Record<string, unknown>)[key]) && ((value as Record<string, unknown>)[key] as unknown[]).length);
}
