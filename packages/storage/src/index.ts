import { parseDailyRecord, type DailyRecord } from "@luna-body-tracker/schema";

export { createIndexedDbStorage, LUNA_DATABASE_NAME, LUNA_DATABASE_VERSION } from "./indexed-db";

export interface LunaStorage {
  listDailyRecords(): Promise<DailyRecord[]>;
  getDailyRecord(date: string): Promise<DailyRecord | undefined>;
  putDailyRecord(record: DailyRecord): Promise<void>;
  putDailyRecords(records: DailyRecord[]): Promise<void>;
  deleteDailyRecord(date: string): Promise<void>;
  getSetting<T>(key: string): Promise<T | undefined>;
  putSetting<T>(key: string, value: T): Promise<void>;
}

export function createMemoryStorage(initialRecords: DailyRecord[] = []): LunaStorage {
  const records = new Map(initialRecords.map((record) => [record.date, parseDailyRecord(record)]));
  const settings = new Map<string, unknown>();

  return {
    async listDailyRecords() {
      return [...records.values()].sort((a, b) => a.date.localeCompare(b.date));
    },
    async getDailyRecord(date) {
      return records.get(date);
    },
    async putDailyRecord(record) {
      const parsed = parseDailyRecord(record);
      records.set(parsed.date, parsed);
    },
    async putDailyRecords(nextRecords) {
      const parsed = nextRecords.map(parseDailyRecord);
      parsed.forEach((record) => records.set(record.date, record));
    },
    async deleteDailyRecord(date) {
      records.delete(date);
    },
    async getSetting<T>(key: string) {
      return settings.get(key) as T | undefined;
    },
    async putSetting<T>(key: string, value: T) {
      settings.set(key, value);
    }
  };
}
