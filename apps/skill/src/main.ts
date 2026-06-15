import { readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import {
  buildKnowledgeIndex,
  createSkillContext,
  parseExtensionFixtureJsonl,
  queryKnowledge,
  selfCheck,
  summarizePeriod,
  type KnowledgeSource
} from "@luna-body-tracker/ai-skill-sdk";

const command = process.argv[2] ?? "self-check";
const root = resolve(new URL("../../../", import.meta.url).pathname);

const fixturePath = join(root, "harness/fixtures/extension-export-sample.jsonl");
const records = parseExtensionFixtureJsonl(readFileSync(fixturePath, "utf8"));
const knowledgeSources = loadKnowledgeSources(join(root, "apps/skill/knowledge"));
const context = createSkillContext({
  records,
  knowledgeSources
});

if (command === "self-check") {
  writeJson(selfCheck(context));
} else if (command === "summarize-fixture") {
  writeJson(summarizePeriod(context, {}));
} else if (command === "query-knowledge") {
  const query = process.argv.slice(3).join(" ") || "female cortisol high hormone low hormone training nutrition";
  writeJson(queryKnowledge({ ...context, knowledgeChunks: buildKnowledgeIndex(knowledgeSources) }, {
    query,
    requireProvenance: true
  }));
} else {
  throw new Error(`Unknown command: ${command}`);
}

function loadKnowledgeSources(directory: string): KnowledgeSource[] {
  return readdirSync(directory)
    .filter((file) => file.endsWith(".md"))
    .sort()
    .map((file) => parseKnowledgeMarkdown(join(directory, file)));
}

function parseKnowledgeMarkdown(path: string): KnowledgeSource {
  const raw = readFileSync(path, "utf8");
  const frontmatterMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!frontmatterMatch) {
    throw new Error(`Knowledge file missing frontmatter: ${path}`);
  }
  const metadata = Object.fromEntries(
    frontmatterMatch[1].split("\n").map((line) => {
      const [key, ...rest] = line.split(":");
      return [key.trim(), rest.join(":").trim()];
    })
  );
  const tags = metadata.tags?.split(",").map((tag) => tag.trim()).filter(Boolean) ?? [];
  return {
    id: metadata.id,
    title: metadata.title,
    author: metadata.author || undefined,
    organization: metadata.organization || undefined,
    sourcePath: path,
    url: metadata.url || undefined,
    versionDate: metadata.versionDate || undefined,
    tags,
    text: frontmatterMatch[2].trim()
  };
}

function writeJson(value: unknown) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}
