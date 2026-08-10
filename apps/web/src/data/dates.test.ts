import { describe, expect, it } from "vitest";
import { currentWeekDateKeys, shiftDateKey } from "./dates";

describe("currentWeekDateKeys", () => {
  it("always returns Monday through Sunday for the reference week", () => {
    expect(currentWeekDateKeys(new Date("2026-08-12T12:00:00"))).toEqual([
      "2026-08-10", "2026-08-11", "2026-08-12", "2026-08-13", "2026-08-14", "2026-08-15", "2026-08-16"
    ]);
    expect(currentWeekDateKeys(new Date("2026-08-16T12:00:00"))[0]).toBe("2026-08-10");
  });

  it("moves across weeks without UTC date drift", () => {
    expect(shiftDateKey("2026-08-10", -7)).toBe("2026-08-03");
    expect(shiftDateKey("2026-08-10", 7)).toBe("2026-08-17");
  });
});
