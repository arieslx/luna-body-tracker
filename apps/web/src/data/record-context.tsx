import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { DailyRecord, ModuleValue } from "@luna-body-tracker/schema";
import { createIndexedDbStorage, type LunaStorage } from "@luna-body-tracker/storage";
import { createEmptyDailyRecord, updateRecordModule } from "./record-mapper";

export type SaveStatus = "loading" | "saved" | "error";
export type WeeklyMetric = "mood" | "food" | "sleep" | "movement" | "water" | "body" | "notes";

type LunaRecordContextValue = {
  records: Map<string, DailyRecord>;
  status: SaveStatus;
  weeklyFocus: WeeklyMetric[];
  getRecord(date: string): DailyRecord;
  updateModule(date: string, moduleId: string, value: ModuleValue | undefined): void;
  replaceRecords(records: DailyRecord[]): Promise<void>;
  setWeeklyFocus(value: WeeklyMetric[]): void;
  retry(): void;
};

const LunaRecordContext = createContext<LunaRecordContextValue | null>(null);
const WEEKLY_FOCUS_KEY = "weekly-focus";
const DEFAULT_WEEKLY_FOCUS: WeeklyMetric[] = ["mood", "food", "movement"];

export function LunaRecordProvider({ children, storage: suppliedStorage }: { children: ReactNode; storage?: LunaStorage }) {
  const storage = useMemo(() => suppliedStorage ?? createIndexedDbStorage(), [suppliedStorage]);
  const [records, setRecords] = useState<Map<string, DailyRecord>>(new Map());
  const recordsRef = useRef(records);
  const [status, setStatus] = useState<SaveStatus>("loading");
  const [weeklyFocus, setWeeklyFocusState] = useState<WeeklyMetric[]>(DEFAULT_WEEKLY_FOCUS);
  const pending = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  useEffect(() => { recordsRef.current = records; }, [records]);

  const hydrate = useCallback(async () => {
    setStatus("loading");
    try {
      const [storedRecords, focus] = await Promise.all([
        storage.listDailyRecords(),
        storage.getSetting<WeeklyMetric[]>(WEEKLY_FOCUS_KEY)
      ]);
      const hydratedRecords = new Map(storedRecords.map((record) => [record.date, record]));
      recordsRef.current.forEach((record, date) => hydratedRecords.set(date, record));
      recordsRef.current = hydratedRecords;
      setRecords(hydratedRecords);
      if (focus?.length) setWeeklyFocusState(focus.slice(0, 3));
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }, [storage]);

  useEffect(() => { void hydrate(); }, [hydrate]);
  useEffect(() => () => pending.current.forEach(clearTimeout), []);

  const getRecord = useCallback((date: string) => records.get(date) ?? createEmptyDailyRecord(date), [records]);

  const scheduleSave = useCallback((record: DailyRecord) => {
    const previous = pending.current.get(record.date);
    if (previous) clearTimeout(previous);
    pending.current.set(record.date, setTimeout(async () => {
      try {
        await storage.putDailyRecord(record);
        pending.current.delete(record.date);
        setStatus("saved");
      } catch {
        setStatus("error");
      }
    }, 300));
  }, [storage]);

  const updateModule = useCallback((date: string, moduleId: string, value: ModuleValue | undefined) => {
    const current = recordsRef.current.get(date) ?? createEmptyDailyRecord(date);
    const next = updateRecordModule(current, moduleId, value);
    const nextRecords = new Map(recordsRef.current);
    nextRecords.set(date, next);
    recordsRef.current = nextRecords;
    setRecords(nextRecords);
    scheduleSave(next);
  }, [scheduleSave]);

  const replaceRecords = useCallback(async (nextRecords: DailyRecord[]) => {
    await storage.putDailyRecords(nextRecords);
    setRecords((current) => {
      const next = new Map(current);
      nextRecords.forEach((record) => next.set(record.date, record));
      recordsRef.current = next;
      return next;
    });
    setStatus("saved");
  }, [storage]);

  const setWeeklyFocus = useCallback((value: WeeklyMetric[]) => {
    const next = value.slice(0, 3);
    setWeeklyFocusState(next);
    void storage.putSetting(WEEKLY_FOCUS_KEY, next).catch(() => setStatus("error"));
  }, [storage]);

  const value = useMemo<LunaRecordContextValue>(() => ({
    records, status, weeklyFocus, getRecord, updateModule, replaceRecords, setWeeklyFocus, retry: hydrate
  }), [records, status, weeklyFocus, getRecord, updateModule, replaceRecords, setWeeklyFocus, hydrate]);

  return <LunaRecordContext.Provider value={value}>{children}</LunaRecordContext.Provider>;
}

export function useLunaRecords(): LunaRecordContextValue {
  const context = useContext(LunaRecordContext);
  if (!context) throw new Error("useLunaRecords must be used inside LunaRecordProvider.");
  return context;
}
