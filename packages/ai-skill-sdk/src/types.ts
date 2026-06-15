import type { DailyRecord, ModuleDefinition } from "@luna-body-tracker/schema";

export type DetailLevel = "metadata" | "summary" | "detail";
export type SensitivityPolicy = "exclude_sensitive" | "summary_only" | "allow_sensitive";
export type DisclosureLevel = "cheap_metadata" | "bounded_summary" | "bounded_detail";

export type SkillLimits = {
  maxDetailDays: number;
  maxSummaryDays: number;
  maxKnowledgeChunks: number;
  maxEstimatedTokens: number;
};

export type DateRange = {
  from?: string;
  to?: string;
};

export type KnowledgeSource = {
  id: string;
  title: string;
  author?: string;
  organization?: string;
  sourcePath?: string;
  url?: string;
  versionDate?: string;
  tags: string[];
  text: string;
};

export type KnowledgeChunk = {
  id: string;
  sourceId: string;
  title: string;
  provenance: {
    title: string;
    author?: string;
    organization?: string;
    sourcePath?: string;
    url?: string;
    versionDate?: string;
    tags: string[];
    chunkId: string;
  };
  text: string;
  tags: string[];
  estimatedTokens: number;
};

export type SkillContext = {
  moduleDefinitions: ModuleDefinition[];
  records: DailyRecord[];
  knowledgeChunks: KnowledgeChunk[];
  limits: SkillLimits;
};

export type ToolEnvelope<T> = {
  tool: string;
  disclosureLevel: DisclosureLevel;
  estimatedTokens: number;
  tokenPolicy: {
    maxEstimatedTokens: number;
    usedEstimatedTokens: number;
    allowedDetail: boolean;
    reason: string;
  };
  data: T;
  nextAllowedActions: string[];
};

export type SelfCheckResult = {
  modules: Array<Pick<ModuleDefinition, "id" | "title" | "origin" | "category" | "sensitivity" | "lifecycle">>;
  dataRange: {
    firstDate?: string;
    lastDate?: string;
    recordCount: number;
    moduleIds: string[];
  };
  knowledge: {
    chunkCount: number;
    sourceIds: string[];
    tags: string[];
  };
  limits: SkillLimits;
  requiredBeforeDetail: string[];
};

export type ReadRecordsInput = {
  dateRange?: DateRange;
  moduleIds?: string[];
  detailLevel: DetailLevel;
  sensitivityPolicy: SensitivityPolicy;
  maxDays?: number;
};

export type PeriodSummaryInput = {
  dateRange?: DateRange;
  moduleIds?: string[];
};

export type KnowledgeQueryInput = {
  query: string;
  tags?: string[];
  maxChunks?: number;
  requireProvenance?: boolean;
};

export type RecommendationInput = {
  goal: "nutrition" | "training";
  dateRange?: DateRange;
  userQuestion: string;
  moduleIds?: string[];
  maxKnowledgeChunks?: number;
};

export type ToolCall = {
  tool: string;
  input?: unknown;
};
