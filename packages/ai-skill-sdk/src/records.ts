import { migrateExtensionExportRecord, type DailyRecord } from "@luna-body-tracker/schema";
import type { DateRange, SensitivityPolicy } from "./types";

const SENSITIVE_MODULE_IDS = new Set(["weight", "poop", "menstrual", "note"]);

export function parseExtensionFixtureJsonl(input: string): DailyRecord[] {
  return input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      try {
        return migrateExtensionExportRecord(JSON.parse(line));
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Invalid fixture JSONL line ${index + 1}: ${message}`);
      }
    });
}

export function filterRecords(
  records: DailyRecord[],
  options: {
    dateRange?: DateRange;
    moduleIds?: string[];
    sensitivityPolicy: SensitivityPolicy;
  }
): DailyRecord[] {
  const moduleFilter = options.moduleIds?.length ? new Set(options.moduleIds) : undefined;
  return records
    .filter((record) => isInDateRange(record.date, options.dateRange))
    .map((record) => {
      const modules = Object.fromEntries(
        Object.entries(record.modules).filter(([moduleId]) => {
          if (moduleFilter && !moduleFilter.has(moduleId)) return false;
          if (options.sensitivityPolicy === "exclude_sensitive" && SENSITIVE_MODULE_IDS.has(moduleId)) return false;
          return true;
        })
      );
      return {
        ...record,
        modules,
        meta: {
          ...record.meta,
          recordedModuleIds: record.meta.recordedModuleIds.filter((moduleId) => moduleId in modules)
        }
      };
    });
}

export function summarizeRecords(records: DailyRecord[]) {
  const moduleCounts = new Map<string, number>();
  const dates = records.map((record) => record.date).sort();

  records.forEach((record) => {
    Object.keys(record.modules).forEach((moduleId) => {
      moduleCounts.set(moduleId, (moduleCounts.get(moduleId) ?? 0) + 1);
    });
  });

  return {
    recordCount: records.length,
    firstDate: dates[0],
    lastDate: dates.at(-1),
    moduleCounts: Object.fromEntries([...moduleCounts.entries()].sort(([a], [b]) => a.localeCompare(b)))
  };
}

export function projectRecordSummary(record: DailyRecord) {
  return {
    id: record.id,
    date: record.date,
    moduleIds: Object.keys(record.modules),
    source: record.meta.source,
    updatedAt: record.meta.updatedAt
  };
}

export function getDataRange(records: DailyRecord[]) {
  const dates = records.map((record) => record.date).sort();
  const moduleIds = new Set<string>();
  records.forEach((record) => Object.keys(record.modules).forEach((moduleId) => moduleIds.add(moduleId)));
  return {
    firstDate: dates[0],
    lastDate: dates.at(-1),
    recordCount: records.length,
    moduleIds: [...moduleIds].sort()
  };
}

export function isSensitiveModule(moduleId: string) {
  return SENSITIVE_MODULE_IDS.has(moduleId);
}

function isInDateRange(date: string, range?: DateRange) {
  if (range?.from && date < range.from) return false;
  if (range?.to && date > range.to) return false;
  return true;
}
