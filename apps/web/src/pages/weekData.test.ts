import { describe, expect, it } from "vitest";
import { parseMovementText } from "./weekData";

describe("parseMovementText", () => {
  it("round-trips multiple displayed movements without appending another duration", () => {
    expect(parseMovementText("散步 30 min · 跑步 45 min")).toEqual([
      { category: "cardio", name: "散步", minutes: 30 },
      { category: "cardio", name: "跑步", minutes: 45 }
    ]);
  });

  it("uses 30 minutes only for a movement that has no explicit duration", () => {
    expect(parseMovementText("瑜伽")).toEqual([
      { category: "strength", name: "瑜伽", minutes: 30 }
    ]);
  });
});
