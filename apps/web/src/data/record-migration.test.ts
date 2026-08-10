import { describe, expect, it } from "vitest";
import { createEmptyDailyRecord } from "./record-mapper";
import { migrateLegacyRecord } from "./record-migration";

describe("legacy record migration", () => {
  it("maps legacy mood, food, and exercise values to the current UI model", () => {
    const record = createEmptyDailyRecord("2026-08-10");
    const migrated = migrateLegacyRecord({
      ...record,
      modules: {
        mood: { value: "grin" },
        foodPool: {
          vegetables: { name: "vegetables", amount: 1 },
          grains: { name: "grains", amount: 1 },
          dairy: { name: "dairy", amount: 1 },
          eggs: { name: "eggs", amount: 1 },
          custom_fruit: { name: "custom_fruit", amount: 1 },
        },
        exercise: { aerobic: true, exercise_walk: true },
      },
    }, [{
      foodCustomItems: [{ id: "custom_fruit", label: "水果" }],
      exerciseCustomItems: [{ id: "exercise_walk", label: "散步" }],
    }]);

    expect(migrated.modules.mood).toEqual({ value: "happy" });
    expect(migrated.modules.foodPool).toEqual({
      vegetable: { name: "vegetable", amount: 1 },
      staple: { name: "staple", amount: 1 },
      milk: { name: "milk", amount: 1 },
      egg: { name: "egg", amount: 1 },
      fruit: { name: "fruit", amount: 1 },
    });
    expect(migrated.modules.exercise).toEqual({ entries: [{ category: "cardio", name: "散步", minutes: 30 }] });
  });

  it("anchors duration-only sleep at 23:00 and calculates wake time", () => {
    const record = createEmptyDailyRecord("2026-08-10");
    const migrated = migrateLegacyRecord({
      ...record,
      modules: { sleep: { value: 8, unit: "hour" } },
    });

    expect(migrated.modules.sleep).toEqual({
      value: 8,
      unit: "hour",
      bedtime: "23:00",
      wakeTime: "07:00",
    });
  });
});
