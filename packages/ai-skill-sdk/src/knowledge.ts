import type { KnowledgeChunk, KnowledgeSource } from "./types";

const WORDS_PER_TOKEN_ESTIMATE = 0.75;

export function buildKnowledgeIndex(sources: KnowledgeSource[], maxChunkWords = 90): KnowledgeChunk[] {
  return sources.flatMap((source) => chunkSource(source, maxChunkWords));
}

export function queryKnowledgeIndex(
  chunks: KnowledgeChunk[],
  query: string,
  options: { tags?: string[]; maxChunks: number }
): KnowledgeChunk[] {
  const queryTerms = tokenize(query);
  const tagSet = new Set((options.tags ?? []).map((tag) => tag.toLowerCase()));

  return chunks
    .map((chunk) => ({
      chunk,
      score: scoreChunk(chunk, queryTerms, tagSet)
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.chunk.id.localeCompare(b.chunk.id))
    .slice(0, options.maxChunks)
    .map((item) => item.chunk);
}

export const defaultWomenCenteredKnowledge: KnowledgeSource[] = [
  {
    id: "women-not-small-men",
    title: "Women are not small men: training and recovery context",
    organization: "Luna Body Tracker local knowledge draft",
    sourcePath: "apps/skill/knowledge/women-not-small-men.md",
    versionDate: "2026-06-15",
    tags: ["female-physiology", "training", "recovery", "nutrition"],
    text:
      "Women-centered training guidance should not assume that female physiology is a scaled-down male default. Recovery, energy availability, iron status, cycle symptoms, stress, and sleep can change training tolerance. Recommendations should start from the user's own records, goals, and constraints, then use knowledge sources as support rather than as rigid rules."
  },
  {
    id: "cycle-hormone-phases",
    title: "High-hormone and low-hormone cycle phases",
    organization: "Luna Body Tracker local knowledge draft",
    sourcePath: "apps/skill/knowledge/cycle-hormone-phases.md",
    versionDate: "2026-06-15",
    tags: ["menstrual-cycle", "high-hormone", "low-hormone", "training", "nutrition"],
    text:
      "A practical cycle-aware model often distinguishes lower-hormone days around menstruation and the early follicular phase from higher-hormone days after ovulation in the luteal phase. Some people tolerate intensity better in lower-hormone windows, while higher-hormone windows may call for more attention to recovery, fueling, heat tolerance, sleep, and symptom tracking. Individual records should override generic phase assumptions."
  },
  {
    id: "cortisol-stress-fueling",
    title: "Cortisol, stress, and fueling in women-centered tracking",
    organization: "Luna Body Tracker local knowledge draft",
    sourcePath: "apps/skill/knowledge/cortisol-stress-fueling.md",
    versionDate: "2026-06-15",
    tags: ["cortisol", "stress", "nutrition", "sleep", "recovery"],
    text:
      "Cortisol is part of normal stress physiology, not automatically a problem. Persistent high stress signals, poor sleep, under-fueling, and intense training can cluster with fatigue, cravings, low mood, and poor recovery. Nutrition and fitness suggestions should avoid fear-based claims and instead look for record patterns such as sleep debt, missed meals, low protein, low carbohydrate availability, or repeated high-intensity days."
  }
];

function chunkSource(source: KnowledgeSource, maxChunkWords: number): KnowledgeChunk[] {
  const paragraphs = source.text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const chunks: string[] = [];

  paragraphs.forEach((paragraph) => {
    const words = paragraph.split(/\s+/);
    for (let index = 0; index < words.length; index += maxChunkWords) {
      chunks.push(words.slice(index, index + maxChunkWords).join(" "));
    }
  });

  return chunks.map((text, index) => {
    const chunkId = `${source.id}#${index + 1}`;
    return {
      id: chunkId,
      sourceId: source.id,
      title: source.title,
      provenance: {
        title: source.title,
        author: source.author,
        organization: source.organization,
        sourcePath: source.sourcePath,
        url: source.url,
        versionDate: source.versionDate,
        tags: source.tags,
        chunkId
      },
      text,
      tags: source.tags,
      estimatedTokens: estimateTokens(text)
    };
  });
}

function scoreChunk(chunk: KnowledgeChunk, queryTerms: string[], tagSet: Set<string>) {
  const haystack = `${chunk.title} ${chunk.tags.join(" ")} ${chunk.text}`.toLowerCase();
  const termScore = queryTerms.reduce((score, term) => score + (haystack.includes(term) ? 2 : 0), 0);
  const tagScore = chunk.tags.reduce((score, tag) => score + (tagSet.has(tag.toLowerCase()) ? 3 : 0), 0);
  return termScore + tagScore;
}

function tokenize(value: string) {
  return value
    .toLowerCase()
    .split(/[^\p{Letter}\p{Number}]+/u)
    .filter((term) => term.length >= 2);
}

export function estimateTokens(text: string) {
  return Math.ceil(text.split(/\s+/).filter(Boolean).length / WORDS_PER_TOKEN_ESTIMATE);
}
