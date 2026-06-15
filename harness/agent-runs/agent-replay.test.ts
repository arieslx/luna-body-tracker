import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  createSkillContext,
  parseExtensionFixtureJsonl,
  replayToolCalls,
  type ToolCall
} from "@luna-body-tracker/ai-skill-sdk";
import { repoPath } from "../test-utils";

describe("agent replay harness", () => {
  it("replays saved AI tool calls deterministically", () => {
    const fixture = readFileSync(repoPath("harness/fixtures/extension-export-sample.jsonl"), "utf8");
    const replay = JSON.parse(readFileSync(repoPath("harness/agent-runs/phase5-replay.json"), "utf8")) as ToolCall[];
    const context = createSkillContext({
      records: parseExtensionFixtureJsonl(fixture)
    });

    const first = replayToolCalls(context, replay);
    const second = replayToolCalls(context, replay);

    expect(second).toEqual(first);
    expect(first.map((result) => result.tool)).toEqual([
      "self_check",
      "summarize_period",
      "query_knowledge_index"
    ]);
    expect(first.every((result) => result.estimatedTokens <= result.tokenPolicy.maxEstimatedTokens)).toBe(true);
  });
});
