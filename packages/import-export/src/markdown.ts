import type { DailyRecord, ModuleDefinition } from "@luna-body-tracker/schema";

export function exportMarkdown(snapshot: {
  moduleDefinitions?: ModuleDefinition[];
  dailyRecords?: DailyRecord[];
}): string {
  const moduleDefinitions = snapshot.moduleDefinitions ?? [];
  const dailyRecords = [...(snapshot.dailyRecords ?? [])].sort((a, b) => a.date.localeCompare(b.date));

  const sections = [
    "# Luna Body Tracker Export",
    renderModuleDefinitions(moduleDefinitions),
    renderDailyRecords(dailyRecords)
  ].filter(Boolean);

  return `${sections.join("\n\n")}\n`;
}

function renderModuleDefinitions(moduleDefinitions: ModuleDefinition[]): string {
  if (!moduleDefinitions.length) return "";

  const rows = moduleDefinitions.map((module) =>
    [
      module.id,
      module.title,
      module.origin,
      module.category,
      module.lifecycle,
      module.sensitivity
    ].map(escapeTableCell).join(" | ")
  );

  return [
    "## Modules",
    "",
    "| ID | Title | Origin | Category | Lifecycle | Sensitivity |",
    "| --- | --- | --- | --- | --- | --- |",
    ...rows.map((row) => `| ${row} |`)
  ].join("\n");
}

function renderDailyRecords(dailyRecords: DailyRecord[]): string {
  if (!dailyRecords.length) return "";

  return [
    "## Daily Records",
    "",
    ...dailyRecords.map((record) => renderDailyRecord(record))
  ].join("\n\n");
}

function renderDailyRecord(record: DailyRecord): string {
  const moduleLines = Object.entries(record.modules).map(([moduleId, value]) => {
    return `- ${moduleId}: ${renderModuleValue(value)}`;
  });

  return [
    `### ${record.date}`,
    "",
    `- Source: ${record.meta.source}`,
    `- Timezone: ${record.timezone}`,
    `- Recorded modules: ${record.meta.recordedModuleIds.join(", ") || "none"}`,
    ...moduleLines
  ].join("\n");
}

function renderModuleValue(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (value === null || value === undefined) return "";
  return JSON.stringify(value);
}

function escapeTableCell(value: string): string {
  return value.replace(/\|/g, "\\|");
}
