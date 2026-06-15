import {
  inspectDataRange,
  queryKnowledge,
  readDailyRecords,
  recommendFromRecords,
  selfCheck,
  summarizePeriod
} from "./core";
import type { SkillContext, ToolCall } from "./types";

export function replayToolCalls(context: SkillContext, calls: ToolCall[]) {
  return calls.map((call) => runToolCall(context, call));
}

export function runToolCall(context: SkillContext, call: ToolCall) {
  switch (call.tool) {
    case "self_check":
      return selfCheck(context);
    case "inspect_data_range":
      return inspectDataRange(context);
    case "read_daily_records":
      return readDailyRecords(context, call.input as Parameters<typeof readDailyRecords>[1]);
    case "summarize_period":
      return summarizePeriod(context, call.input as Parameters<typeof summarizePeriod>[1]);
    case "query_knowledge_index":
      return queryKnowledge(context, call.input as Parameters<typeof queryKnowledge>[1]);
    case "recommend_nutrition":
      return recommendFromRecords(context, { ...(call.input as Parameters<typeof recommendFromRecords>[1]), goal: "nutrition" });
    case "recommend_training":
      return recommendFromRecords(context, { ...(call.input as Parameters<typeof recommendFromRecords>[1]), goal: "training" });
    default:
      throw new Error(`Unknown tool call: ${call.tool}`);
  }
}
