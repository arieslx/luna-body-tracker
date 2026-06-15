import { systemModuleDefinitions, type DailyRecord, type ModuleDefinition } from "@luna-body-tracker/schema";
import { buildKnowledgeIndex, defaultWomenCenteredKnowledge, estimateTokens, queryKnowledgeIndex } from "./knowledge";
import { filterRecords, getDataRange, projectRecordSummary, summarizeRecords } from "./records";
import type {
  KnowledgeSource,
  PeriodSummaryInput,
  ReadRecordsInput,
  RecommendationInput,
  SelfCheckResult,
  SkillContext,
  SkillLimits,
  ToolEnvelope,
  KnowledgeQueryInput
} from "./types";

const DEFAULT_LIMITS: SkillLimits = {
  maxDetailDays: 7,
  maxSummaryDays: 45,
  maxKnowledgeChunks: 3,
  maxEstimatedTokens: 900
};

export function createSkillContext(options: {
  records?: DailyRecord[];
  moduleDefinitions?: ModuleDefinition[];
  knowledgeSources?: KnowledgeSource[];
  limits?: Partial<SkillLimits>;
} = {}): SkillContext {
  return {
    records: options.records ?? [],
    moduleDefinitions: options.moduleDefinitions ?? systemModuleDefinitions,
    knowledgeChunks: buildKnowledgeIndex(options.knowledgeSources ?? defaultWomenCenteredKnowledge),
    limits: { ...DEFAULT_LIMITS, ...(options.limits ?? {}) }
  };
}

export function selfCheck(context: SkillContext): ToolEnvelope<SelfCheckResult> {
  const dataRange = getDataRange(context.records);
  const sourceIds = [...new Set(context.knowledgeChunks.map((chunk) => chunk.sourceId))].sort();
  const tags = [...new Set(context.knowledgeChunks.flatMap((chunk) => chunk.tags))].sort();

  return envelope(context, "self_check", "cheap_metadata", 120, {
    modules: context.moduleDefinitions.map((module) => ({
      id: module.id,
      title: module.title,
      origin: module.origin,
      category: module.category,
      sensitivity: module.sensitivity,
      lifecycle: module.lifecycle
    })),
    dataRange,
    knowledge: {
      chunkCount: context.knowledgeChunks.length,
      sourceIds,
      tags
    },
    limits: context.limits,
    requiredBeforeDetail: [
      "dateRange",
      "moduleIds when possible",
      "sensitivityPolicy",
      "detailLevel",
      "specific user goal or question"
    ]
  }, ["inspect_data_range", "summarize_period", "query_knowledge_index"]);
}

export function inspectDataRange(context: SkillContext) {
  return envelope(context, "inspect_data_range", "cheap_metadata", 80, getDataRange(context.records), [
    "summarize_period",
    "read_daily_records"
  ]);
}

export function readDailyRecords(context: SkillContext, input: ReadRecordsInput) {
  const records = filterRecords(context.records, {
    dateRange: input.dateRange,
    moduleIds: input.moduleIds,
    sensitivityPolicy: input.sensitivityPolicy
  });
  const maxDays = input.maxDays ?? (input.detailLevel === "detail" ? context.limits.maxDetailDays : context.limits.maxSummaryDays);
  const bounded = records.slice(0, maxDays);

  if (input.detailLevel === "detail" && records.length > context.limits.maxDetailDays) {
    return envelope(context, "read_daily_records", "cheap_metadata", 90, {
      declined: true,
      reason: `Detail reads are limited to ${context.limits.maxDetailDays} days. Narrow dateRange or use summary mode first.`,
      matchingRecordCount: records.length,
      summary: summarizeRecords(records)
    }, ["summarize_period", "read_daily_records"]);
  }

  if (input.detailLevel === "metadata") {
    return envelope(context, "read_daily_records", "cheap_metadata", 100, bounded.map(projectRecordSummary), [
      "summarize_period",
      "read_daily_records"
    ]);
  }

  if (input.detailLevel === "summary") {
    return envelope(context, "read_daily_records", "bounded_summary", 180, {
      summary: summarizeRecords(records),
      records: bounded.map(projectRecordSummary)
    }, ["read_daily_records", "query_knowledge_index"]);
  }

  return envelope(context, "read_daily_records", "bounded_detail", estimateTokens(JSON.stringify(bounded)), bounded, [
    "query_knowledge_index",
    "recommend_nutrition",
    "recommend_training"
  ]);
}

export function summarizePeriod(context: SkillContext, input: PeriodSummaryInput = {}) {
  const records = filterRecords(context.records, {
    dateRange: input.dateRange,
    moduleIds: input.moduleIds,
    sensitivityPolicy: "summary_only"
  });

  return envelope(context, "summarize_period", "bounded_summary", 180, summarizeRecords(records), [
    "read_daily_records",
    "query_knowledge_index"
  ]);
}

export function queryKnowledge(context: SkillContext, input: KnowledgeQueryInput) {
  const maxChunks = Math.min(input.maxChunks ?? context.limits.maxKnowledgeChunks, context.limits.maxKnowledgeChunks);
  const chunks = queryKnowledgeIndex(context.knowledgeChunks, input.query, {
    tags: input.tags,
    maxChunks
  });
  const estimatedTokens = chunks.reduce((sum, chunk) => sum + chunk.estimatedTokens, 0);

  if (!input.query.trim()) {
    return envelope(context, "query_knowledge_index", "cheap_metadata", 60, {
      declined: true,
      reason: "Knowledge queries require a specific query before retrieving chunks."
    }, ["query_knowledge_index"]);
  }

  return envelope(context, "query_knowledge_index", "bounded_summary", estimatedTokens, {
    chunks: chunks.map((chunk) => ({
      id: chunk.id,
      title: chunk.title,
      text: chunk.text,
      provenance: input.requireProvenance === false ? undefined : chunk.provenance
    }))
  }, ["recommend_nutrition", "recommend_training"]);
}

export function recommendFromRecords(context: SkillContext, input: RecommendationInput) {
  const summary = summarizePeriod(context, {
    dateRange: input.dateRange,
    moduleIds: input.moduleIds ?? ["sleep", "water", "foodPool", "meals", "exercise", "menstrual", "note"]
  }).data;
  const knowledge = queryKnowledge(context, {
    query: input.userQuestion,
    tags: input.goal === "nutrition" ? ["nutrition", "female-physiology", "menstrual-cycle"] : ["training", "recovery", "female-physiology"],
    maxChunks: input.maxKnowledgeChunks,
    requireProvenance: true
  }).data;

  return envelope(context, input.goal === "nutrition" ? "recommend_nutrition" : "recommend_training", "bounded_summary", 320, {
    stance: "educational_support_not_diagnosis",
    userQuestion: input.userQuestion,
    recordSummary: summary,
    knowledge,
    recommendationFrame: [
      "Start from the user's own records and stated goal.",
      "Prefer conservative, reversible suggestions.",
      "Name uncertainty and suggest what to track next.",
      "Escalate to a qualified clinician for medical symptoms, diagnosis, medication, or hormone treatment questions."
    ]
  }, ["read_daily_records", "query_knowledge_index"]);
}

function envelope<T>(
  context: SkillContext,
  tool: string,
  disclosureLevel: ToolEnvelope<T>["disclosureLevel"],
  estimatedTokens: number,
  data: T,
  nextAllowedActions: string[]
): ToolEnvelope<T> {
  const allowedDetail = estimatedTokens <= context.limits.maxEstimatedTokens;
  return {
    tool,
    disclosureLevel,
    estimatedTokens,
    tokenPolicy: {
      maxEstimatedTokens: context.limits.maxEstimatedTokens,
      usedEstimatedTokens: estimatedTokens,
      allowedDetail,
      reason: allowedDetail
        ? "Within the configured low-token disclosure budget."
        : "Estimated token usage exceeds the configured budget; narrow the request before reading detail."
    },
    data,
    nextAllowedActions
  };
}
