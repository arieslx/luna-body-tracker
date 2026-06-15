import { z, ZodError } from "zod";
import {
  dailyRecordSchema,
  formatZodIssues,
  moduleDefinitionSchema,
  type DailyRecord,
  type ModuleDefinition
} from "@luna-body-tracker/schema";

export type ExportLine =
  | {
      type: "module_definition";
      version: 1;
      data: ModuleDefinition;
    }
  | {
      type: "daily_record";
      version: 1;
      data: DailyRecord;
    }
  | {
      type: "settings";
      version: 1;
      data: Record<string, unknown>;
    };

export type ExportSnapshot = {
  moduleDefinitions: ModuleDefinition[];
  dailyRecords: DailyRecord[];
  settings: Record<string, unknown>[];
};

const settingsLineSchema = z
  .object({
    type: z.literal("settings"),
    version: z.literal(1),
    data: z.record(z.unknown())
  })
  .strict();

const exportLineSchema = z.discriminatedUnion("type", [
  z
    .object({
      type: z.literal("module_definition"),
      version: z.literal(1),
      data: moduleDefinitionSchema
    })
    .strict(),
  z
    .object({
      type: z.literal("daily_record"),
      version: z.literal(1),
      data: dailyRecordSchema
    })
    .strict(),
  settingsLineSchema
]);

export function parseJsonl(input: string): ExportSnapshot {
  const snapshot: ExportSnapshot = {
    moduleDefinitions: [],
    dailyRecords: [],
    settings: []
  };

  input.split(/\r?\n/).forEach((rawLine, index) => {
    const line = rawLine.trim();
    if (!line) return;

    const parsedJson = parseJsonLine(line, index + 1);
    const parsedLine = parseExportLine(parsedJson, index + 1);

    if (parsedLine.type === "module_definition") snapshot.moduleDefinitions.push(parsedLine.data);
    if (parsedLine.type === "daily_record") snapshot.dailyRecords.push(parsedLine.data);
    if (parsedLine.type === "settings") snapshot.settings.push(parsedLine.data);
  });

  return snapshot;
}

export function writeJsonl(snapshot: {
  moduleDefinitions?: ModuleDefinition[];
  dailyRecords?: DailyRecord[];
  settings?: Record<string, unknown>[];
}): string {
  const lines: ExportLine[] = [
    ...(snapshot.moduleDefinitions ?? []).map((data) => ({ type: "module_definition" as const, version: 1 as const, data })),
    ...(snapshot.dailyRecords ?? []).map((data) => ({ type: "daily_record" as const, version: 1 as const, data })),
    ...(snapshot.settings ?? []).map((data) => ({ type: "settings" as const, version: 1 as const, data }))
  ];

  return lines.map((line) => JSON.stringify(exportLineSchema.parse(line))).join("\n");
}

function parseJsonLine(line: string, lineNumber: number): unknown {
  try {
    return JSON.parse(line);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Invalid JSONL line ${lineNumber}: ${message}`);
  }
}

function parseExportLine(input: unknown, lineNumber: number): ExportLine {
  try {
    return exportLineSchema.parse(input);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(`Invalid export line ${lineNumber}: ${formatZodIssues(error).join("; ")}`);
    }
    throw error;
  }
}
