import { describe, expect, it } from "vitest";
import {
  createSkillContext,
  queryKnowledge,
  readDailyRecords,
  recommendFromRecords,
  replayToolCalls,
  selfCheck,
  summarizePeriod
} from ".";
import { parseExtensionFixtureJsonl } from "./records";

const fixture = `{"date":"2026-06-14","dayOfWeek":"星期日","recordedModules":["mood","water","sleep","poop","note"],"mood":"grin","water":{"cups":2,"targetCups":8},"sleep":{"hours":3},"poop":{"count":2,"label":"2"},"note":"Slept late, woke early."}`;

describe("AI skill progressive disclosure", () => {
  it("self-check exposes cheap metadata before private data detail", () => {
    const context = createSkillContext({ records: parseExtensionFixtureJsonl(fixture) });
    const result = selfCheck(context);

    expect(result.disclosureLevel).toBe("cheap_metadata");
    expect(result.data.dataRange.recordCount).toBe(1);
    expect(result.data.requiredBeforeDetail).toContain("dateRange");
    expect(result.nextAllowedActions).toContain("summarize_period");
  });

  it("summarizes fixture data without returning full records", () => {
    const context = createSkillContext({ records: parseExtensionFixtureJsonl(fixture) });
    const result = summarizePeriod(context, { dateRange: { from: "2026-06-01", to: "2026-06-30" } });

    expect(result.disclosureLevel).toBe("bounded_summary");
    expect(result.data.recordCount).toBe(1);
    expect(result.data.moduleCounts).toMatchObject({ mood: 1, water: 1, sleep: 1 });
  });

  it("declines broad detail reads and asks for a narrower scope", () => {
    const records = parseExtensionFixtureJsonl(
      Array.from({ length: 8 }, (_, index) =>
        fixture.replace("2026-06-14", `2026-06-${String(index + 1).padStart(2, "0")}`)
      ).join("\n")
    );
    const context = createSkillContext({ records, limits: { maxDetailDays: 7 } });
    const result = readDailyRecords(context, {
      detailLevel: "detail",
      sensitivityPolicy: "summary_only",
      dateRange: { from: "2026-06-01", to: "2026-06-30" }
    });

    expect(result.data).toMatchObject({
      declined: true,
      matchingRecordCount: 8
    });
    expect(result.disclosureLevel).toBe("cheap_metadata");
  });

  it("retrieves knowledge with provenance", () => {
    const context = createSkillContext();
    const result = queryKnowledge(context, {
      query: "cortisol stress sleep nutrition",
      requireProvenance: true
    });

    if ("declined" in result.data) throw new Error(result.data.reason);
    expect(result.data.chunks[0].provenance).toMatchObject({
      sourcePath: expect.stringContaining("knowledge")
    });
  });

  it("frames nutrition recommendations as educational and source-backed", () => {
    const context = createSkillContext({ records: parseExtensionFixtureJsonl(fixture) });
    const result = recommendFromRecords(context, {
      goal: "nutrition",
      userQuestion: "Why do I crash in the afternoon around stress and low sleep?",
      dateRange: { from: "2026-06-01", to: "2026-06-30" }
    });

    expect(result.data.stance).toBe("educational_support_not_diagnosis");
    if ("declined" in result.data.knowledge) throw new Error(result.data.knowledge.reason);
    expect(result.data.knowledge.chunks.length).toBeGreaterThan(0);
  });

  it("replays tool calls deterministically", () => {
    const context = createSkillContext({ records: parseExtensionFixtureJsonl(fixture) });
    const calls = [
      { tool: "self_check" },
      { tool: "summarize_period", input: { dateRange: { from: "2026-06-01", to: "2026-06-30" } } }
    ];

    expect(replayToolCalls(context, calls)).toEqual(replayToolCalls(context, calls));
  });
});
