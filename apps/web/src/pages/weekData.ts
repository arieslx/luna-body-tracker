import type { DailyRecord } from "@luna-body-tracker/schema";
import type { WeeklyMetric } from "../data/record-context";
import { moduleValue } from "../data/record-mapper";
import type { TFunction } from "../i18n";

export type MoodId = "calm" | "happy" | "tired" | "sad" | "emo" | "angry" | "excited" | "anxious" | "sleepy" | "loved" | "confused";
export type MealId = "breakfast" | "lunch" | "dinner" | "snack";

export type WeekDay = {
  recordDate: string;
  date: string;
  weekday: string;
  mood?: MoodId;
  sleep?: number;
  meals: Partial<Record<MealId, string>>;
  foods: string[];
  movement: string;
  poop: string;
  weight: string;
  water: string;
  supplements: string;
  notes: string;
};

export type WeeklyPreference = { visibleMetrics: WeeklyMetric[] };

const strengthMovementNames = new Set(["力量", "核心", "深蹲", "拉伸", "瑜伽"]);

export function parseMovementText(value: string) {
  return value.split(/\s*·\s*/).map((part) => {
    const match = part.trim().match(/^(.*?)(?:\s+(\d+|60\+)\s*min)?$/);
    const name = match?.[1]?.trim();
    if (!name) return undefined;
    return {
      category: strengthMovementNames.has(name) ? "strength" as const : "cardio" as const,
      name,
      minutes: match?.[2] === "60+" ? 61 : Number(match?.[2] || 30)
    };
  }).filter((entry): entry is NonNullable<typeof entry> => entry !== undefined);
}

const foodLabels: Record<string, string> = {
  vegetable: "蔬菜", meat: "肉类", staple: "主食", milk: "牛奶", egg: "鸡蛋",
  oil: "油", fruit: "水果", snack: "零食", other: "其他"
};

export function dailyRecordToWeekDay(record: DailyRecord, t: TFunction): WeekDay {
  const mood = moduleValue<{ value: MoodId }>(record, "mood")?.value;
  const sleep = moduleValue<{ value: number }>(record, "sleep")?.value;
  const meals = moduleValue<Record<string, string | undefined>>(record, "meals") ?? {};
  const foodPool = moduleValue<Record<string, { name: string; label?: string }>>(record, "foodPool") ?? {};
  const exercise = moduleValue<{ entries: Array<{ name: string; minutes: number }> }>(record, "exercise")?.entries ?? [];
  const localDate = new Date(`${record.date}T12:00:00`);
  return {
    recordDate: record.date,
    date: record.date.replaceAll("-", "/"),
    weekday: t(`weekday.${localDate.getDay()}` as "weekday.0"),
    mood,
    sleep,
    meals: {
      breakfast: meals.breakfast,
      lunch: meals.lunch,
      dinner: meals.dinner,
      snack: meals.snack
    },
    foods: Object.entries(foodPool).map(([id, item]) => item.label || foodLabels[id] || item.name),
    movement: exercise.map((entry) => `${entry.name} ${entry.minutes > 60 ? "60+" : entry.minutes} min`).join(" · "),
    poop: moduleValue<{ count: number; label?: string }>(record, "poop")?.label ?? "",
    weight: moduleValue<{ kg: number }>(record, "weight")?.kg ? `${moduleValue<{ kg: number }>(record, "weight")!.kg.toFixed(1)} kg` : "",
    water: String(moduleValue<{ value: number }>(record, "water")?.value ?? ""),
    supplements: moduleValue<{ text: string }>(record, "supplements")?.text ?? "",
    notes: moduleValue<{ text: string }>(record, "note")?.text ?? ""
  };
}

export const mealOrder: MealId[] = ["breakfast", "lunch", "dinner", "snack"];
export type { WeeklyMetric };
