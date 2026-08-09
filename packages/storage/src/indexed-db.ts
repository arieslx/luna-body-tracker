import { parseDailyRecord, type DailyRecord } from "@luna-body-tracker/schema";
import type { LunaStorage } from "./index";

export const LUNA_DATABASE_NAME = "luna-local";
export const LUNA_DATABASE_VERSION = 1;

const RECORDS_STORE = "daily-records";
const SETTINGS_STORE = "settings";

type SettingRow = { key: string; value: unknown };

export function createIndexedDbStorage(indexedDb: IDBFactory = indexedDB): LunaStorage {
  let databasePromise: Promise<IDBDatabase> | undefined;

  const database = () => {
    databasePromise ??= openDatabase(indexedDb);
    return databasePromise;
  };

  return {
    async listDailyRecords() {
      const db = await database();
      const rows = await request<DailyRecord[]>(db.transaction(RECORDS_STORE).objectStore(RECORDS_STORE).getAll());
      return rows.map(parseDailyRecord).sort((a, b) => a.date.localeCompare(b.date));
    },
    async getDailyRecord(date) {
      const db = await database();
      const row = await request<DailyRecord | undefined>(
        db.transaction(RECORDS_STORE).objectStore(RECORDS_STORE).get(date)
      );
      return row ? parseDailyRecord(row) : undefined;
    },
    async putDailyRecord(record) {
      const parsed = parseDailyRecord(record);
      const db = await database();
      const transaction = db.transaction(RECORDS_STORE, "readwrite");
      transaction.objectStore(RECORDS_STORE).put(parsed);
      await transactionDone(transaction);
    },
    async putDailyRecords(records) {
      const parsed = records.map(parseDailyRecord);
      const db = await database();
      const transaction = db.transaction(RECORDS_STORE, "readwrite");
      const store = transaction.objectStore(RECORDS_STORE);
      parsed.forEach((record) => store.put(record));
      await transactionDone(transaction);
    },
    async deleteDailyRecord(date) {
      const db = await database();
      const transaction = db.transaction(RECORDS_STORE, "readwrite");
      transaction.objectStore(RECORDS_STORE).delete(date);
      await transactionDone(transaction);
    },
    async getSetting<T>(key: string) {
      const db = await database();
      const row = await request<SettingRow | undefined>(
        db.transaction(SETTINGS_STORE).objectStore(SETTINGS_STORE).get(key)
      );
      return row?.value as T | undefined;
    },
    async putSetting<T>(key: string, value: T) {
      const db = await database();
      const transaction = db.transaction(SETTINGS_STORE, "readwrite");
      transaction.objectStore(SETTINGS_STORE).put({ key, value } satisfies SettingRow);
      await transactionDone(transaction);
    }
  };
}

function openDatabase(indexedDb: IDBFactory): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const openRequest = indexedDb.open(LUNA_DATABASE_NAME, LUNA_DATABASE_VERSION);
    openRequest.onupgradeneeded = () => {
      const db = openRequest.result;
      if (!db.objectStoreNames.contains(RECORDS_STORE)) {
        db.createObjectStore(RECORDS_STORE, { keyPath: "date" });
      }
      if (!db.objectStoreNames.contains(SETTINGS_STORE)) {
        db.createObjectStore(SETTINGS_STORE, { keyPath: "key" });
      }
    };
    openRequest.onsuccess = () => resolve(openRequest.result);
    openRequest.onerror = () => reject(openRequest.error ?? new Error("Unable to open Luna storage."));
    openRequest.onblocked = () => reject(new Error("Luna storage upgrade is blocked by another tab."));
  });
}

function request<T>(idbRequest: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    idbRequest.onsuccess = () => resolve(idbRequest.result);
    idbRequest.onerror = () => reject(idbRequest.error ?? new Error("Luna storage request failed."));
  });
}

function transactionDone(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error("Luna storage transaction failed."));
    transaction.onabort = () => reject(transaction.error ?? new Error("Luna storage transaction was aborted."));
  });
}
