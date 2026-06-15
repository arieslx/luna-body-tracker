import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Download, Eye, EyeOff, Languages, Plus, SettingsIcon, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const DB_NAME = "luna_body_tracker_db";
const DB_VERSION = 1;
const RECORD_STORE = "records";
const SETTINGS_STORE = "settingsFallback";
const SETTINGS_KEY = "luna-body-tracker:settings";
const SCHEMA_VERSION_KEY = "luna-body-tracker:schemaVersion";
const APP_SCHEMA_VERSION = 8;

type Locale = "zh-CN" | "en-US";
type ViewMode = "record" | "week";
type ModuleId = "mood" | "water" | "sleep" | "foodPool" | "exercise" | "poop" | "weight" | "note";
type FoodItem = readonly [key: string, label: string, emoji: string, origin: "builtIn" | "custom"];
type ExerciseItem = readonly [key: string, label: string, emoji: string, origin: "builtIn" | "custom"];
type CustomFoodItem = { id: string; label: string };
type CustomExerciseItem = { id: string; label: string };
type RecordData = {
  id: string;
  date: string;
  schemaVersion: number;
  mood?: string;
  waterCount?: number;
  sleepHours?: number | null;
  sleepSlots?: number[];
  foodPool?: Record<string, number>;
  meals?: Record<string, string>;
  exercise?: Record<string, boolean>;
  poopCount?: number;
  weightKg?: number | null;
  note?: string;
  privacyHidden?: Record<string, boolean>;
  createdAt: string;
  updatedAt: string;
};
type Settings = {
  schemaVersion: number;
  locale: Locale;
  hiddenModules: ModuleId[];
  moduleOrder: ModuleId[];
  foodCustomItems: CustomFoodItem[];
  exerciseCustomItems: CustomExerciseItem[];
  privacyHidden: Record<string, boolean>;
  theme: Record<string, string>;
};

const messages = {
  "zh-CN": {
    appEyebrow: "luna body tracker",
    loading: "离线保存中",
    saved: "离线保存完成",
    saving: "保存中",
    startupError: "页面启动失败",
    startupHelp: "请重新加载扩展。如果仍然失败，把下面这段错误发给我。",
    previousDay: "前一天",
    nextDay: "后一天",
    recordView: "记录",
    weekView: "周视图",
    exportJsonl: "导出 JSONL",
    exportMarkdown: "导出 Markdown",
    settings: "设置",
    layoutSettings: "布局设置",
    done: "完成",
    clearData: "清空本地数据",
    confirmReset: "确认清空所有本地记录吗？这个操作不能撤销。",
    language: "语言",
    visible: "显示",
    hidden: "隐藏",
    moveUp: "上移",
    moveDown: "下移",
    add: "添加",
    remove: "删除",
    noCustomItems: "还没有自定义项",
    customFoodEmpty: "自定义食物会显示在这里",
    addCustomHint: "在设置里添加",
    mainCategory: "主类目",
    custom: "自定义",
    foodPool: "food pool",
    customFood: "自定义食物",
    customFoodName: "咖啡 / 酒 / 甜食",
    exercise: "exercise",
    customExercise: "自定义运动",
    customExerciseName: "散步 / 拉伸 / 瑜伽",
    mealPlaceholder: "想写就写",
    notePlaceholder: "今天想多说的，放这里。",
    weeklyPlan: "weekly plan",
    source: "来源",
    timezone: "时区",
    recordedModules: "记录模块",
    none: "无",
    moduleLabels: {
      mood: "心情",
      water: "喝水",
      sleep: "睡眠",
      foodPool: "今日食物池",
      exercise: "运动",
      poop: "拉屎",
      weight: "体重",
      note: "备注"
    },
    meals: {
      breakfast: "早餐",
      lunch: "午餐",
      dinner: "晚餐",
      snack: "加餐"
    },
    summaryTitle: "身体记录导出",
    exportedAt: "导出时间",
    range: "范围",
    notes: "说明",
    noteLine1: "这些记录用于帮助你回看身体节律。空白代表没有记录，不代表没有发生。",
    noteLine2: "食物份量是粗略的身体尺度估计，不是热量或克数记录。",
    noteLine3: "这些数据用于自我了解，不用于医疗诊断。",
    fieldNotes: "字段说明",
    waterUnit: "杯",
    sleepUnit: "小时",
    overview: "最近概览",
    dailyRecords: "每日记录",
    recordedDays: "记录天数",
    averageWater: "平均喝水",
    averageSleep: "平均睡眠",
    averagePoop: "拉屎记录",
    topFoods: "最常记录的食物"
  },
  "en-US": {
    appEyebrow: "luna body tracker",
    loading: "Saving offline",
    saved: "Saved offline",
    saving: "Saving",
    startupError: "Startup failed",
    startupHelp: "Reload the extension. If it still fails, send this error.",
    previousDay: "Previous day",
    nextDay: "Next day",
    recordView: "Record",
    weekView: "Week",
    exportJsonl: "Export JSONL",
    exportMarkdown: "Export Markdown",
    settings: "Settings",
    layoutSettings: "Layout Settings",
    done: "Done",
    clearData: "Clear local data",
    confirmReset: "Clear all local records? This cannot be undone.",
    language: "Language",
    visible: "Visible",
    hidden: "Hidden",
    moveUp: "Move up",
    moveDown: "Move down",
    add: "Add",
    remove: "Remove",
    noCustomItems: "No custom items yet",
    customFoodEmpty: "Custom foods will appear here",
    addCustomHint: "Add in settings",
    mainCategory: "Main",
    custom: "Custom",
    foodPool: "food pool",
    customFood: "Custom Food",
    customFoodName: "coffee / wine / sweets",
    exercise: "exercise",
    customExercise: "Custom Exercise",
    customExerciseName: "walk / stretch / yoga",
    mealPlaceholder: "Optional note",
    notePlaceholder: "Anything else about today.",
    weeklyPlan: "weekly plan",
    source: "Source",
    timezone: "Timezone",
    recordedModules: "Recorded modules",
    none: "none",
    moduleLabels: {
      mood: "Mood",
      water: "Water",
      sleep: "Sleep",
      foodPool: "Food Pool",
      exercise: "Exercise",
      poop: "Bowel",
      weight: "Weight",
      note: "Note"
    },
    meals: {
      breakfast: "Breakfast",
      lunch: "Lunch",
      dinner: "Dinner",
      snack: "Snack"
    },
    summaryTitle: "Luna Body Tracker Export",
    exportedAt: "Exported at",
    range: "Range",
    notes: "Notes",
    noteLine1: "These records help you review body rhythms. Blank fields mean not recorded, not that nothing happened.",
    noteLine2: "Food amounts are rough body-scale estimates, not calories or grams.",
    noteLine3: "This data is for self-understanding, not medical diagnosis.",
    fieldNotes: "Field Notes",
    waterUnit: "bowl",
    sleepUnit: "hour",
    overview: "Overview",
    dailyRecords: "Daily Records",
    recordedDays: "Recorded days",
    averageWater: "Average water",
    averageSleep: "Average sleep",
    averagePoop: "Bowel records",
    topFoods: "Top foods"
  }
} as const;

const MODULES: Array<{ id: ModuleId; span: string }> = [
  { id: "mood", span: "span-7 row-span-2 first-row-card" },
  { id: "water", span: "span-5 first-row-half" },
  { id: "sleep", span: "span-5 first-row-half" },
  { id: "foodPool", span: "span-12" },
  { id: "exercise", span: "span-12" },
  { id: "poop", span: "span-2 bottom-card" },
  { id: "weight", span: "span-2 bottom-card" },
  { id: "note", span: "span-8 bottom-card" }
];

const FOOD_ITEMS = [
  ["vegetables", "🥬"],
  ["meat", "🥩"],
  ["grains", "🍚"],
  ["tubers", "🍠"],
  ["beans", "🫘"],
  ["dairy", "🥛"],
  ["eggs", "🥚"],
  ["nuts", "🥜"],
  ["oil", "🫒"],
  ["seafood", "🦐"]
] as const;

const EXERCISE_ITEMS = [
  ["aerobic", "🏃"],
  ["strength", "💪"]
] as const;

const SLEEP_LABELS = ["20", "21", "22", "23", "24", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
const MOODS = [
  ["grin", "😁"],
  ["angry", "😡"],
  ["cry", "😭"],
  ["smile", "🙂"]
] as const;

const optionCopy = {
  "zh-CN": {
    moods: { grin: "露齿笑", angry: "愤怒", cry: "流泪", smile: "微笑" },
    foods: {
      vegetables: "蔬菜",
      meat: "肉类",
      grains: "谷物",
      tubers: "薯类",
      beans: "豆类",
      dairy: "奶制品",
      eggs: "鸡蛋",
      nuts: "坚果",
      oil: "油",
      seafood: "海鲜"
    },
    exercise: { aerobic: "有氧", strength: "无氧" }
  },
  "en-US": {
    moods: { grin: "Grin", angry: "Angry", cry: "Crying", smile: "Soft smile" },
    foods: {
      vegetables: "Vegetables",
      meat: "Protein",
      grains: "Grains",
      tubers: "Tubers",
      beans: "Beans",
      dairy: "Dairy",
      eggs: "Eggs",
      nuts: "Nuts",
      oil: "Oil",
      seafood: "Seafood"
    },
    exercise: { aerobic: "Aerobic", strength: "Strength" }
  }
} as const;

const DEFAULT_SETTINGS: Settings = {
  schemaVersion: APP_SCHEMA_VERSION,
  locale: "zh-CN",
  hiddenModules: [],
  moduleOrder: MODULES.map((module) => module.id),
  foodCustomItems: [],
  exerciseCustomItems: [],
  privacyHidden: {
    poop: false,
    weight: false
  },
  theme: {
    background: "#c9cacc",
    text: "#1d1f21",
    positive: "#2bbc8a",
    accent: "#d480aa"
  }
};

let dbPromise: Promise<IDBDatabase> | undefined;

export function App() {
  const [selectedDate, setSelectedDate] = useState(getDateKey());
  const [view, setView] = useState<ViewMode>("record");
  const [record, setRecord] = useState<RecordData | null>(null);
  const [records, setRecords] = useState<RecordData[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [saveState, setSaveState] = useState<string>(messages["zh-CN"].loading);
  const [error, setError] = useState<Error | null>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const locale = settings.locale;
  const t = messages[locale];

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const loadedSettings = await loadSettings();
        const loadedRecord = await loadOrCreateRecord(selectedDate);
        const loadedRecords = await getAllRecords();
        if (!mounted) return;
        setSettings(loadedSettings);
        setRecord(loadedRecord);
        setRecords(loadedRecords);
        setSaveState(messages[loadedSettings.locale].saved);
      } catch (caught) {
        setError(caught instanceof Error ? caught : new Error(String(caught)));
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [selectedDate]);

  useEffect(() => {
    setSaveState(messages[settings.locale].saved);
  }, [settings.locale]);

  const orderedModules = useMemo(() => getOrderedModules(settings), [settings]);
  const visibleModules = orderedModules.filter((module) => !settings.hiddenModules.includes(module.id));

  async function persistSettings(next: Settings) {
    const normalized = normalizeSettings(next);
    setSettings(normalized);
    await saveSettings(normalized);
  }

  async function updateRecord(patch: Partial<RecordData>) {
    if (!record) return;
    const next = normalizeRecord({ ...record, ...patch, updatedAt: new Date().toISOString() });
    setRecord(next);
    setSaveState(t.saving);
    await putRecord(next);
    setRecords(await getAllRecords());
    setSaveState(t.saved);
  }

  async function shiftSelectedDate(offset: number) {
    const date = parseDateKey(selectedDate);
    date.setDate(date.getDate() + offset);
    setSelectedDate(getDateKey(date));
  }

  function openSettings() {
    dialogRef.current?.showModal();
  }

  async function resetAllData() {
    if (!confirm(t.confirmReset)) return;
    const db = await openDb();
    await transactionPromise(db, RECORD_STORE, "readwrite", (store) => store.clear());
    const next = await loadOrCreateRecord(selectedDate);
    setRecord(next);
    setRecords(await getAllRecords());
  }

  if (error) {
    return (
      <main className="app-shell">
        <section className="card span-12">
          <p className="eyebrow">startup error</p>
          <h1>{t.startupError}</h1>
          <p className="save-state">{t.startupHelp}</p>
          <pre className="error-box">{error.stack ?? error.message}</pre>
        </section>
      </main>
    );
  }

  if (!record) {
    return (
      <main className="app-shell">
        <p className="save-state">{t.loading}</p>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="date-nav">
          <button className="date-button" title={t.previousDay} type="button" onClick={() => shiftSelectedDate(-1)}>
            <ChevronLeft size={22} />
          </button>
          <div>
            <p className="eyebrow">{t.appEyebrow}</p>
            <h1>{formatDateTitle(selectedDate, locale)}</h1>
          </div>
          <button className="date-button" title={t.nextDay} type="button" onClick={() => shiftSelectedDate(1)}>
            <ChevronRight size={22} />
          </button>
        </div>
        <div className="top-actions">
          <button className="text-button" type="button" onClick={() => setView(view === "week" ? "record" : "week")}>
            {view === "week" ? t.recordView : t.weekView}
          </button>
          <button className="icon-button" title={t.exportJsonl} type="button" onClick={() => exportJsonl(records, selectedDate)}>
            <Download size={17} />
            <span>JL</span>
          </button>
          <button className="icon-button" title={t.exportMarkdown} type="button" onClick={() => exportMarkdown(records, selectedDate, settings)}>
            <Download size={17} />
            <span>MD</span>
          </button>
          <button className="icon-button" title={t.settings} type="button" onClick={openSettings}>
            <SettingsIcon size={18} />
          </button>
        </div>
      </header>

      {view === "record" ? (
        <section className="board" aria-live="polite">
          {visibleModules.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
              record={record}
              settings={settings}
              updateRecord={updateRecord}
              locale={locale}
            />
          ))}
        </section>
      ) : (
        <WeekView records={records} selectedDate={selectedDate} settings={settings} />
      )}

      <p className="save-state">{saveState}</p>

      <SettingsDialog
        dialogRef={dialogRef}
        settings={settings}
        persistSettings={persistSettings}
        resetAllData={resetAllData}
      />
    </main>
  );
}

function ModuleCard(props: {
  module: { id: ModuleId; span: string };
  record: RecordData;
  settings: Settings;
  locale: Locale;
  updateRecord: (patch: Partial<RecordData>) => Promise<void>;
}) {
  const { module, record, settings, locale, updateRecord } = props;
  const t = messages[locale];
  const content = {
    mood: <MoodModule record={record} updateRecord={updateRecord} locale={locale} />,
    water: <WaterModule record={record} updateRecord={updateRecord} locale={locale} />,
    sleep: <SleepModule record={record} updateRecord={updateRecord} locale={locale} />,
    exercise: <ExerciseModule record={record} settings={settings} updateRecord={updateRecord} locale={locale} />,
    weight: <WeightModule record={record} updateRecord={updateRecord} locale={locale} />,
    foodPool: <FoodPoolModule record={record} settings={settings} updateRecord={updateRecord} locale={locale} />,
    poop: <PoopModule record={record} updateRecord={updateRecord} locale={locale} />,
    note: <NoteModule record={record} updateRecord={updateRecord} locale={locale} />
  }[module.id];

  return (
    <article className={`card ${module.span}`} data-module={module.id}>
      {content ?? <h3>{t.moduleLabels[module.id]}</h3>}
    </article>
  );
}

function MoodModule({ record, updateRecord, locale }: ModuleProps) {
  const t = messages[locale];
  return (
    <>
      <CardTitle title={t.moduleLabels.mood} />
      <div className="mood-row">
        {MOODS.map(([value, emoji]) => (
          <button
            className={`mood-option ${record.mood === value ? "is-active" : ""}`}
            key={value}
            title={moodLabel(value, locale)}
            type="button"
            onClick={() => updateRecord({ mood: value })}
          >
            <span className="mood-emoji">{emoji}</span>
            <span>{moodLabel(value, locale)}</span>
          </button>
        ))}
      </div>
    </>
  );
}

function WaterModule({ record, updateRecord, locale }: ModuleProps) {
  const t = messages[locale];
  const count = record.waterCount ?? 0;
  return (
    <>
      <CardTitle title={t.moduleLabels.water} value={`${count}/8 ${t.waterUnit}`} />
      <div className="water-grid">
        {Array.from({ length: 8 }, (_, index) => {
          const value = index + 1;
          const active = index < count;
          return (
            <button
              className={`water-cup ${active ? "is-active" : ""}`}
              key={value}
              title={`${value}`}
              type="button"
              onClick={() => updateRecord({ waterCount: record.waterCount === value ? Math.max(0, value - 1) : value })}
            >
              <WaterCup active={active} />
            </button>
          );
        })}
      </div>
    </>
  );
}

function SleepModule({ record, updateRecord, locale }: ModuleProps) {
  const t = messages[locale];
  const selectedSlots = getSleepSlots(record);
  const touchedRef = useRef(new Set<number>());
  const pointerActiveRef = useRef(false);

  useEffect(() => {
    const stop = () => {
      pointerActiveRef.current = false;
      touchedRef.current = new Set();
    };
    document.addEventListener("pointerup", stop);
    return () => document.removeEventListener("pointerup", stop);
  }, []);

  function toggleSlot(slot: number) {
    if (touchedRef.current.has(slot)) return;
    touchedRef.current.add(slot);
    const selected = new Set(getSleepSlots(record));
    if (selected.has(slot)) selected.delete(slot);
    else selected.add(slot);
    updateRecord({ sleepSlots: [...selected].sort((a, b) => a - b), sleepHours: null });
  }

  return (
    <>
      <CardTitle title={t.moduleLabels.sleep} value={`${selectedSlots.length} ${t.sleepUnit}`} />
      <div className="sleep-grid">
        {SLEEP_LABELS.map((label, index) => {
          const slot = index + 1;
          return (
            <button
              className={`sleep-cell ${selectedSlots.includes(slot) ? "is-active" : ""}`}
              key={slot}
              title={`${label}`}
              type="button"
              onPointerDown={(event) => {
                pointerActiveRef.current = true;
                touchedRef.current = new Set();
                event.preventDefault();
                toggleSlot(slot);
              }}
              onPointerEnter={() => {
                if (pointerActiveRef.current) toggleSlot(slot);
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
    </>
  );
}

function ExerciseModule({ record, settings, updateRecord, locale }: ModuleProps & { settings: Settings }) {
  const t = messages[locale];
  const exercise = record.exercise ?? {};
  const customItems = getCustomExerciseItems(settings);
  const toggle = (key: string) => updateRecord({ exercise: { ...exercise, [key]: !exercise[key] } });
  return (
    <>
      <CardTitle title={t.moduleLabels.exercise} />
      <div className="exercise-group">
        <div className="section-label">{t.mainCategory}</div>
        <div className="exercise-row exercise-row-primary">
          {getExerciseItems(settings).filter(([, , , origin]) => origin === "builtIn").map(([key, label, emoji]) => (
            <button className={`exercise-option ${exercise[key] ? "is-active" : ""}`} key={key} type="button" onClick={() => toggle(key)}>
              <span className="exercise-emoji">{emoji}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="exercise-group">
        <div className="section-label">{t.custom}</div>
        <div className="exercise-row">
          {customItems.length ? customItems.map((item) => (
            <button className={`exercise-option is-custom ${exercise[item.id] ? "is-active" : ""}`} key={item.id} type="button" onClick={() => toggle(item.id)}>
              <span className="exercise-emoji">✦</span>
              <span>{item.label}</span>
            </button>
          )) : <span className="empty-inline">{t.addCustomHint}</span>}
        </div>
      </div>
    </>
  );
}

function WeightModule({ record, updateRecord, locale }: ModuleProps) {
  const t = messages[locale];
  const hidden = getRecordPrivacy(record, "weight");
  return (
    <>
      <CardTitle title={t.moduleLabels.weight} privacy={{ hidden, label: hidden ? t.visible : t.hidden, onToggle: () => togglePrivacy(record, "weight", updateRecord) }} />
      <label className={`weight-field privacy-data ${hidden ? "is-blurred" : ""}`}>
        <input
          className="number-input"
          inputMode="decimal"
          min="0"
          placeholder="--"
          step="0.1"
          type="number"
          value={record.weightKg ?? ""}
          onChange={(event) => {
            const rawValue = event.target.value.trim();
            const value = rawValue ? Number(rawValue) : null;
            updateRecord({ weightKg: Number.isFinite(value) ? value : null });
          }}
        />
        <span>KG</span>
      </label>
    </>
  );
}

function FoodPoolModule({ record, settings, updateRecord, locale }: ModuleProps & { settings: Settings }) {
  const t = messages[locale];
  const foodPool = { ...createEmptyFoodPool(settings), ...(record.foodPool ?? {}) };
  const customItems = getCustomFoodItems(settings);
  const meals = record.meals ?? {};

  function toggleFood(key: string) {
    updateRecord({ foodPool: { ...foodPool, [key]: foodPool[key] ? 0 : 1 } });
  }

  return (
    <>
      <CardTitle title={t.moduleLabels.foodPool} />
      <div className="meal-grid">
        {Object.entries(t.meals).map(([key, label]) => (
          <label className="meal-field" key={key}>
            <span>{label}:</span>
            <input
              value={meals[key] ?? ""}
              placeholder={t.mealPlaceholder}
              type="text"
              onChange={(event) => updateRecord({ meals: { ...meals, [key]: event.target.value } })}
            />
          </label>
        ))}
      </div>
      <div className="food-grid">
        {getFoodItems(settings).filter(([, , , origin]) => origin === "builtIn").map(([key, label, emoji]) => (
          <button className={`food-chip ${foodPool[key] ? "is-active" : ""}`} key={key} type="button" onClick={() => toggleFood(key)}>
            <span className="chip-emoji">{emoji}</span>
            <span className="chip-main">{label}</span>
          </button>
        ))}
      </div>
      <div className="food-divider" />
      <div className="food-grid food-grid-custom">
        {customItems.length ? customItems.map((item) => (
          <button className={`food-chip is-custom ${foodPool[item.id] ? "is-active" : ""}`} key={item.id} type="button" onClick={() => toggleFood(item.id)}>
            <span className="chip-emoji">✦</span>
            <span className="chip-main">{item.label}</span>
          </button>
        )) : <span className="empty-inline">{t.customFoodEmpty}</span>}
      </div>
    </>
  );
}

function PoopModule({ record, updateRecord, locale }: ModuleProps) {
  const t = messages[locale];
  const count = record.poopCount ?? 0;
  const hidden = getRecordPrivacy(record, "poop");
  return (
    <>
      <CardTitle title={t.moduleLabels.poop} privacy={{ hidden, label: hidden ? t.visible : t.hidden, onToggle: () => togglePrivacy(record, "poop", updateRecord) }} />
      <div className={`poop-row privacy-data ${hidden ? "is-blurred" : ""}`}>
        {[0, 1, 2, 3].map((value) => (
          <button className={`poop-step ${count === value ? "is-active" : ""}`} key={value} type="button" onClick={() => updateRecord({ poopCount: value })}>
            {poopLabel(value)}
          </button>
        ))}
      </div>
    </>
  );
}

function NoteModule({ record, updateRecord, locale }: ModuleProps) {
  const t = messages[locale];
  return (
    <>
      <CardTitle title={t.moduleLabels.note} />
      <textarea className="note-input" placeholder={t.notePlaceholder} value={record.note ?? ""} onChange={(event) => updateRecord({ note: event.target.value })} />
    </>
  );
}

type ModuleProps = {
  record: RecordData;
  updateRecord: (patch: Partial<RecordData>) => Promise<void>;
  locale: Locale;
};

function CardTitle({ title, value, privacy }: { title: string; value?: string; privacy?: { hidden: boolean; label: string; onToggle: () => void } }) {
  return (
    <div className="card-title">
      <h3>{title}</h3>
      {value ? <span className="card-value">{value}</span> : null}
      {privacy ? (
        <button className="privacy-toggle" title={privacy.label} type="button" onClick={privacy.onToggle}>
          {privacy.hidden ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      ) : null}
    </div>
  );
}

function SettingsDialog(props: {
  dialogRef: React.RefObject<HTMLDialogElement>;
  settings: Settings;
  persistSettings: (settings: Settings) => Promise<void>;
  resetAllData: () => Promise<void>;
}) {
  const { dialogRef, settings, persistSettings, resetAllData } = props;
  const [foodName, setFoodName] = useState("");
  const [exerciseName, setExerciseName] = useState("");
  const t = messages[settings.locale];
  const orderedModules = getOrderedModules(settings);

  function moveModule(moduleId: ModuleId, direction: number) {
    persistSettings({ ...settings, moduleOrder: moveInArray(settings.moduleOrder, moduleId, direction) });
  }

  function toggleModule(moduleId: ModuleId, visible: boolean) {
    const hidden = new Set(settings.hiddenModules);
    if (visible) hidden.delete(moduleId);
    else hidden.add(moduleId);
    persistSettings({ ...settings, hiddenModules: [...hidden] });
  }

  function addCustomFood() {
    const label = foodName.trim();
    if (!label) return;
    const item = { id: `custom_${Date.now().toString(36)}`, label };
    setFoodName("");
    persistSettings({ ...settings, foodCustomItems: [...getCustomFoodItems(settings), item] });
  }

  function addCustomExercise() {
    const label = exerciseName.trim();
    if (!label) return;
    const item = { id: `exercise_${Date.now().toString(36)}`, label };
    setExerciseName("");
    persistSettings({ ...settings, exerciseCustomItems: [...getCustomExerciseItems(settings), item] });
  }

  return (
    <dialog className="modal" ref={dialogRef}>
      <form className="modal-panel" method="dialog">
        <div className="modal-head">
          <div>
            <p className="eyebrow">settings</p>
            <h2>{t.layoutSettings}</h2>
          </div>
          <button className="icon-button dark" value="cancel" type="submit">
            <X size={18} />
          </button>
        </div>

        <section className="settings-section">
          <p className="eyebrow">{t.language}</p>
          <div className="segmented-control">
            {(["zh-CN", "en-US"] as Locale[]).map((locale) => (
              <button className={settings.locale === locale ? "is-active" : ""} key={locale} type="button" onClick={() => persistSettings({ ...settings, locale })}>
                <Languages size={15} />
                <span>{locale}</span>
              </button>
            ))}
          </div>
        </section>

        <div className="setting-list">
          {orderedModules.map((module, index) => {
            const checked = !settings.hiddenModules.includes(module.id);
            return (
              <div className="setting-row" key={module.id}>
                <span>{t.moduleLabels[module.id]}</span>
                <button className="mini-button" disabled={index === 0} title={t.moveUp} type="button" onClick={() => moveModule(module.id, -1)}>
                  <ArrowUp size={16} />
                </button>
                <button className="mini-button" disabled={index === orderedModules.length - 1} title={t.moveDown} type="button" onClick={() => moveModule(module.id, 1)}>
                  <ArrowDown size={16} />
                </button>
                <input aria-label={checked ? t.visible : t.hidden} checked={checked} type="checkbox" onChange={(event) => toggleModule(module.id, event.target.checked)} />
              </div>
            );
          })}
        </div>

        <section className="settings-section">
          <p className="eyebrow">{t.foodPool}</p>
          <h3>{t.customFood}</h3>
          <div className="custom-food-form">
            <input maxLength={12} placeholder={t.customFoodName} type="text" value={foodName} onChange={(event) => setFoodName(event.target.value)} />
            <button className="primary-button" type="button" onClick={addCustomFood}>
              <Plus size={16} />
              <span>{t.add}</span>
            </button>
          </div>
          <CustomList
            emptyText={t.noCustomItems}
            items={getCustomFoodItems(settings)}
            removeLabel={t.remove}
            onRemove={(id) => persistSettings({ ...settings, foodCustomItems: getCustomFoodItems(settings).filter((item) => item.id !== id) })}
          />
        </section>

        <section className="settings-section">
          <p className="eyebrow">{t.exercise}</p>
          <h3>{t.customExercise}</h3>
          <div className="custom-food-form custom-exercise-form">
            <input maxLength={12} placeholder={t.customExerciseName} type="text" value={exerciseName} onChange={(event) => setExerciseName(event.target.value)} />
            <button className="primary-button" type="button" onClick={addCustomExercise}>
              <Plus size={16} />
              <span>{t.add}</span>
            </button>
          </div>
          <CustomList
            emptyText={t.noCustomItems}
            items={getCustomExerciseItems(settings)}
            removeLabel={t.remove}
            onRemove={(id) => persistSettings({ ...settings, exerciseCustomItems: getCustomExerciseItems(settings).filter((item) => item.id !== id) })}
          />
        </section>

        <div className="modal-actions">
          <button className="text-button" type="button" onClick={resetAllData}>
            <Trash2 size={16} />
            <span>{t.clearData}</span>
          </button>
          <button className="primary-button" value="default" type="submit">{t.done}</button>
        </div>
      </form>
    </dialog>
  );
}

function CustomList({ emptyText, items, removeLabel, onRemove }: { emptyText: string; items: Array<{ id: string; label: string }>; removeLabel: string; onRemove: (id: string) => void }) {
  return (
    <div className="custom-food-list">
      {items.length ? items.map((item) => (
        <span className="custom-food-item" key={item.id}>
          {item.label}
          <button className="mini-button" title={removeLabel} type="button" onClick={() => onRemove(item.id)}>
            <X size={14} />
          </button>
        </span>
      )) : <span className="card-value">{emptyText}</span>}
    </div>
  );
}

function WeekView({ records, selectedDate, settings }: { records: RecordData[]; selectedDate: string; settings: Settings }) {
  const t = messages[settings.locale];
  const weekDates = getWeekDates(selectedDate);
  const recordsByDate = new Map(records.map((record) => [record.date, record]));
  return (
    <section className="week-view">
      <section className="notebook">
        <div className="notebook-head">
          <p className="eyebrow">{t.weeklyPlan}</p>
          <h2>{formatWeekDate(weekDates[0])} - {formatWeekDate(weekDates[6])}</h2>
        </div>
        <div className="week-table">
          {weekDates.map((dateKey) => (
            <WeekDayRow dateKey={dateKey} key={dateKey} record={recordsByDate.get(dateKey)} settings={settings} />
          ))}
        </div>
      </section>
    </section>
  );
}

function WeekDayRow({ dateKey, record = emptyWeekRecord(dateKey), settings }: { dateKey: string; record?: RecordData; settings: Settings }) {
  const t = messages[settings.locale];
  const meals = record.meals ?? {};
  const mealLines = Object.entries(t.meals)
    .filter(([key]) => String(meals[key] ?? "").trim())
    .map(([key, label]) => <p key={key}><span>{label}</span>{String(meals[key]).trim()}</p>);
  const foodItems = getFoodItems(settings).filter(([key]) => record.foodPool?.[key]);
  const mood = record.mood ? `${moodEmoji(record.mood)} ${moodLabel(record.mood, settings.locale)}` : "";
  const sleep = weekSleepTextLine(record, settings.locale);
  const exercise = exerciseLabel(record.exercise ?? {}, settings);
  const poop = typeof record.poopCount === "number" ? weekPoopLabel(record.poopCount) : "";
  const water = typeof record.waterCount === "number" ? `${record.waterCount}/8 ${t.waterUnit}` : "";
  const weight = typeof record.weightKg === "number" ? `${record.weightKg} KG` : "";
  const poopHidden = getRecordPrivacy(record, "poop");
  const weightHidden = getRecordPrivacy(record, "weight");

  return (
    <article className="week-row">
      <div className="week-cell date-cell">
        <strong>{formatWeekDate(dateKey)}</strong>
        <span>{formatWeekday(dateKey, settings.locale)}</span>
        <em>{mood || t.moduleLabels.mood}</em>
      </div>
      <div className="week-cell">
        <p><span>{t.moduleLabels.sleep}</span>{sleep || " "}</p>
        {mealLines.length ? mealLines : (
          <div className="food-fallback">
            {foodItems.map(([, label]) => <span key={label}>{label}</span>)}
          </div>
        )}
      </div>
      <div className="week-cell"><p><span>{t.moduleLabels.exercise}</span>{exercise === "--" ? " " : exercise}</p></div>
      <div className="week-cell"><p><span>{t.moduleLabels.poop}</span><b className={`week-private privacy-data ${poopHidden ? "is-blurred" : ""}`}>{poop || " "}</b></p></div>
      <div className="week-cell"><p><span>{t.moduleLabels.weight}</span><b className={`week-private privacy-data ${weightHidden ? "is-blurred" : ""}`}>{weight || " "}</b></p></div>
      <div className="week-cell"><p><span>{t.moduleLabels.water}</span>{water || " "}</p></div>
    </article>
  );
}

function WaterCup({ active }: { active: boolean }) {
  return (
    <svg className="water-svg" viewBox="0 0 28 32" aria-hidden="true">
      <path className="cup-line" d="M8 3h12l-2 26H10L8 3Z" />
      <path className="water-fill" d="M10 16h8l-.8 11h-6.4L10 16Z" style={{ opacity: active ? 1 : 0 }} />
      <path className="cup-line" d="M9 8h10" />
    </svg>
  );
}

function openDb() {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(RECORD_STORE)) {
          const store = db.createObjectStore(RECORD_STORE, { keyPath: "id" });
          store.createIndex("date", "date", { unique: true });
          store.createIndex("updatedAt", "updatedAt", { unique: false });
        }
        if (!db.objectStoreNames.contains(SETTINGS_STORE)) {
          db.createObjectStore(SETTINGS_STORE, { keyPath: "key" });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  return dbPromise;
}

async function getRecord(id: string) {
  const db = await openDb();
  const record = await transactionPromise(db, RECORD_STORE, "readonly", (store) => store.get(id));
  return record ? normalizeRecord(record as RecordData) : undefined;
}

async function putRecord(record: RecordData) {
  const db = await openDb();
  return transactionPromise(db, RECORD_STORE, "readwrite", (store) => store.put(normalizeRecord(record)));
}

async function getAllRecords() {
  const db = await openDb();
  const records = await transactionPromise(db, RECORD_STORE, "readonly", (store) => store.getAll());
  return (records as RecordData[]).map(normalizeRecord).sort((a, b) => a.date.localeCompare(b.date));
}

function transactionPromise(db: IDBDatabase, storeName: string, mode: IDBTransactionMode, operation: (store: IDBObjectStore) => IDBRequest) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, mode);
    const store = transaction.objectStore(storeName);
    const request = operation(store);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    transaction.onerror = () => reject(transaction.error);
  });
}

async function loadSettings() {
  const chromeStorage = (globalThis as { chrome?: { storage?: { local?: { get: (keys: string[]) => Promise<Record<string, unknown>>; set: (value: Record<string, unknown>) => Promise<void> } } } }).chrome?.storage?.local;
  if (chromeStorage) {
    const result = await chromeStorage.get([SETTINGS_KEY, SCHEMA_VERSION_KEY]);
    return normalizeSettings(result[SETTINGS_KEY]);
  }
  const db = await openDb();
  const result = await transactionPromise(db, SETTINGS_STORE, "readonly", (store) => store.get(SETTINGS_KEY));
  return normalizeSettings((result as { value?: unknown } | undefined)?.value);
}

async function saveSettings(settings: Settings) {
  const normalized = normalizeSettings(settings);
  const chromeStorage = (globalThis as { chrome?: { storage?: { local?: { set: (value: Record<string, unknown>) => Promise<void> } } } }).chrome?.storage?.local;
  if (chromeStorage) {
    await chromeStorage.set({ [SETTINGS_KEY]: normalized, [SCHEMA_VERSION_KEY]: APP_SCHEMA_VERSION });
    return;
  }
  const db = await openDb();
  await transactionPromise(db, SETTINGS_STORE, "readwrite", (store) => store.put({ key: SETTINGS_KEY, value: normalized }));
}

async function loadOrCreateRecord(dateKey: string) {
  const existing = await getRecord(dateKey);
  if (existing) return existing;
  const now = new Date().toISOString();
  const record = normalizeRecord({
    id: dateKey,
    date: dateKey,
    schemaVersion: APP_SCHEMA_VERSION,
    privacyHidden: {
      poop: false,
      weight: false
    },
    createdAt: now,
    updatedAt: now
  });
  await putRecord(record);
  return record;
}

function normalizeRecord(record: RecordData): RecordData {
  return {
    ...record,
    schemaVersion: APP_SCHEMA_VERSION,
    privacyHidden: {
      poop: Boolean(record?.privacyHidden?.poop),
      weight: Boolean(record?.privacyHidden?.weight)
    }
  };
}

function normalizeSettings(settings: unknown): Settings {
  const raw = typeof settings === "object" && settings ? settings as Partial<Settings> : {};
  const merged = { ...DEFAULT_SETTINGS, ...raw };
  const knownIds = MODULES.map((module) => module.id);
  const shouldUseDefaultOrder = !raw.schemaVersion || raw.schemaVersion < APP_SCHEMA_VERSION;
  const rawOrder = shouldUseDefaultOrder ? DEFAULT_SETTINGS.moduleOrder : (merged.moduleOrder ?? []);
  const order = rawOrder.filter((id): id is ModuleId => knownIds.includes(id));
  const locale: Locale = merged.locale === "en-US" ? "en-US" : "zh-CN";
  return {
    ...merged,
    schemaVersion: APP_SCHEMA_VERSION,
    locale,
    hiddenModules: (merged.hiddenModules ?? []).filter((id): id is ModuleId => knownIds.includes(id)),
    moduleOrder: order.concat(knownIds.filter((id): id is ModuleId => !order.includes(id))),
    foodCustomItems: getNormalizedCustomFoodItems(merged.foodCustomItems),
    exerciseCustomItems: getNormalizedCustomExerciseItems(merged.exerciseCustomItems),
    privacyHidden: {
      poop: Boolean(merged.privacyHidden?.poop),
      weight: Boolean(merged.privacyHidden?.weight)
    }
  };
}

function getNormalizedCustomFoodItems(items: unknown = []): CustomFoodItem[] {
  return (Array.isArray(items) ? items : []).map((item) => {
    if (typeof item === "string") return { id: `custom_${slugify(item)}`, label: item };
    const value = item as Partial<CustomFoodItem>;
    return { id: value.id || `custom_${slugify(value.label ?? "")}`, label: value.label ?? "" };
  }).filter((item) => item.id && item.label);
}

function getNormalizedCustomExerciseItems(items: unknown = []): CustomExerciseItem[] {
  return (Array.isArray(items) ? items : []).map((item) => {
    if (typeof item === "string") return { id: `exercise_${slugify(item)}`, label: item };
    const value = item as Partial<CustomExerciseItem>;
    return { id: value.id || `exercise_${slugify(value.label ?? "")}`, label: value.label ?? "" };
  }).filter((item) => item.id && item.label);
}

function createEmptyFoodPool(settings: Settings) {
  return Object.fromEntries(getFoodItems(settings).map(([key]) => [key, 0]));
}

function getOrderedModules(settings: Settings) {
  const order = settings.moduleOrder?.length ? settings.moduleOrder : DEFAULT_SETTINGS.moduleOrder;
  return order
    .map((id) => MODULES.find((module) => module.id === id))
    .filter((module): module is { id: ModuleId; span: string } => Boolean(module))
    .concat(MODULES.filter((module) => !order.includes(module.id)));
}

function getCustomFoodItems(settings: Settings) {
  return getNormalizedCustomFoodItems(settings.foodCustomItems);
}

function getCustomExerciseItems(settings: Settings) {
  return getNormalizedCustomExerciseItems(settings.exerciseCustomItems);
}

function getFoodItems(settings: Settings): FoodItem[] {
  const customItems: FoodItem[] = getCustomFoodItems(settings).map((item) => [item.id, item.label, "✦", "custom"] as const);
  const builtInItems: FoodItem[] = FOOD_ITEMS.map(([key, emoji]) => {
    const label = optionCopy[settings.locale].foods[key];
    return [key, label, emoji, "builtIn"] as const;
  });
  return builtInItems.concat(customItems);
}

function getExerciseItems(settings: Settings): ExerciseItem[] {
  const customItems: ExerciseItem[] = getCustomExerciseItems(settings).map((item) => [item.id, item.label, "✦", "custom"] as const);
  const builtInItems: ExerciseItem[] = EXERCISE_ITEMS.map(([key, emoji]) => [key, optionCopy[settings.locale].exercise[key], emoji, "builtIn"] as const);
  return builtInItems.concat(customItems);
}

function togglePrivacy(record: RecordData, moduleId: string, updateRecord: (patch: Partial<RecordData>) => Promise<void>) {
  updateRecord({
    privacyHidden: {
      poop: getRecordPrivacy(record, "poop"),
      weight: getRecordPrivacy(record, "weight"),
      [moduleId]: !getRecordPrivacy(record, moduleId)
    }
  });
}

function getRecordPrivacy(record: RecordData, moduleId: string) {
  return Boolean(record?.privacyHidden?.[moduleId]);
}

function exportJsonl(records: RecordData[], selectedDate: string) {
  const lines = records.map((record) => JSON.stringify(toExportRecord(record)));
  downloadFile(`luna-body-tracker-${selectedDate}.jsonl`, lines.join("\n"), "application/x-ndjson");
}

function exportMarkdown(records: RecordData[], selectedDate: string, settings: Settings) {
  downloadFile(`luna-body-tracker-summary-${selectedDate}.md`, createSummaryMarkdown(records, selectedDate, settings), "text/markdown");
}

function toExportRecord(record: RecordData) {
  const exported: Record<string, unknown> & { recordedModules: string[] } = {
    date: record.date,
    dayOfWeek: new Date(`${record.date}T00:00:00`).toLocaleDateString("zh-CN", { weekday: "long" }),
    recordedModules: []
  };

  if (record.mood) {
    exported.mood = record.mood;
    exported.recordedModules.push("mood");
  }
  if (typeof record.waterCount === "number") {
    exported.water = { value: record.waterCount, unit: "bowl", targetValue: 8 };
    exported.recordedModules.push("water");
  }
  if (typeof record.sleepHours === "number") {
    exported.sleep = { value: record.sleepHours, unit: "hour" };
    exported.recordedModules.push("sleep");
  }
  if (Array.isArray(record.sleepSlots) && record.sleepSlots.length) {
    exported.sleep = {
      value: record.sleepSlots.length,
      unit: "hour",
      slots: record.sleepSlots,
      labels: record.sleepSlots.map((slot) => SLEEP_LABELS[slot - 1]).filter(Boolean)
    };
    if (!exported.recordedModules.includes("sleep")) exported.recordedModules.push("sleep");
  }
  if (record.exercise && Object.values(record.exercise).some(Boolean)) {
    exported.exercise = record.exercise;
    exported.recordedModules.push("exercise");
  }
  if (typeof record.weightKg === "number") {
    exported.weight = { kg: record.weightKg };
    exported.recordedModules.push("weight");
  }
  if (record.foodPool && Object.values(record.foodPool).some(Boolean)) {
    exported.foodPool = record.foodPool;
    exported.recordedModules.push("foodPool");
  }
  if (record.meals && Object.values(record.meals).some((value) => String(value ?? "").trim())) {
    exported.meals = Object.fromEntries(Object.entries(record.meals).filter(([, value]) => String(value ?? "").trim()));
    if (!exported.recordedModules.includes("foodPool")) exported.recordedModules.push("foodPool");
  }
  if (typeof record.poopCount === "number") {
    exported.poop = { count: record.poopCount, label: poopLabel(record.poopCount) };
    exported.recordedModules.push("poop");
  }
  if (record.note?.trim()) {
    exported.note = record.note.trim();
    exported.recordedModules.push("note");
  }
  return exported;
}

function createSummaryMarkdown(records: RecordData[], selectedDate: string, settings: Settings) {
  const t = messages[settings.locale];
  const sorted = [...records].sort((a, b) => a.date.localeCompare(b.date));
  const from = sorted[0]?.date ?? selectedDate;
  const to = sorted.at(-1)?.date ?? selectedDate;
  const recordedDays = sorted.filter((record) => toExportRecord(record).recordedModules.length).length;
  const avgWater = average(sorted.map((record) => record.waterCount).filter((value): value is number => typeof value === "number"));
  const avgSleep = average(sorted.map((record) => getSleepSlots(record).length || record.sleepHours).filter((value): value is number => typeof value === "number"));
  const avgPoop = average(sorted.map((record) => record.poopCount).filter((value): value is number => typeof value === "number"));
  const foodCounts = getFoodFrequencies(sorted, settings);

  const daily = sorted.map((record) => [
    `### ${record.date}`,
    "",
    `- ${t.moduleLabels.mood}: ${moodLabel(record.mood, settings.locale)}`,
    `- ${t.moduleLabels.water}: ${typeof record.waterCount === "number" ? `${record.waterCount}/8 ${t.waterUnit}` : "--"}`,
    `- ${t.moduleLabels.sleep}: ${sleepTextLine(record, settings.locale) || "--"}`,
    `- ${t.moduleLabels.exercise}: ${exerciseLabel(record.exercise ?? {}, settings)}`,
    `- ${t.moduleLabels.weight}: ${typeof record.weightKg === "number" ? `${record.weightKg} kg` : "--"}`,
    `- ${t.moduleLabels.foodPool}: ${foodTextLine(record.foodPool, settings) || "--"}`,
    `- ${t.moduleLabels.poop}: ${poopLabel(record.poopCount ?? 0)}`,
    `- ${t.moduleLabels.note}: ${record.note?.trim() || "--"}`
  ].join("\n")).join("\n\n");

  return [
    `# ${t.summaryTitle}`,
    "",
    `${t.exportedAt}: ${new Date().toLocaleString(settings.locale)}`,
    `${t.range}: ${from} - ${to}`,
    `${t.timezone}: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
    "",
    `## ${t.notes}`,
    "",
    t.noteLine1,
    t.noteLine2,
    t.noteLine3,
    `## ${t.overview}`,
    "",
    `- ${t.recordedDays}: ${recordedDays} / ${sorted.length}`,
    `- ${t.averageWater}: ${formatAverage(avgWater)}`,
    `- ${t.averageSleep}: ${formatAverage(avgSleep)}`,
    `- ${t.averagePoop}: ${formatAverage(avgPoop)}`,
    `- ${t.topFoods}: ${foodCounts.slice(0, 3).map(([label]) => label).join(" / ") || "--"}`,
    "",
    `## ${t.dailyRecords}`,
    "",
    daily
  ].join("\n");
}

function getDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateKey(dateKey: string) {
  return new Date(`${dateKey}T00:00:00`);
}

function formatDateTitle(dateKey: string, locale: Locale) {
  const date = parseDateKey(dateKey);
  const week = date.toLocaleDateString(locale, { weekday: "short" });
  return `${dateKey.replaceAll("-", "/")} ${week}`;
}

function getWeekDates(dateKey: string) {
  const date = parseDateKey(dateKey);
  const day = date.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + mondayOffset);
  return Array.from({ length: 7 }, (_, index) => {
    const next = new Date(date);
    next.setDate(date.getDate() + index);
    return getDateKey(next);
  });
}

function formatWeekDate(dateKey: string) {
  return dateKey.replaceAll("-", "/");
}

function formatWeekday(dateKey: string, locale: Locale) {
  return parseDateKey(dateKey).toLocaleDateString(locale, { weekday: "short" });
}

function moodLabel(value?: string, locale: Locale = "zh-CN") {
  if (!value) return "--";
  return optionCopy[locale].moods[value as keyof typeof optionCopy["zh-CN"]["moods"]] ?? "--";
}

function moodEmoji(value?: string) {
  return MOODS.find(([mood]) => mood === value)?.[1] ?? "";
}

function exerciseLabel(exercise: Record<string, boolean>, settings: Settings) {
  const labels = getExerciseItems(settings).filter(([key]) => exercise?.[key]).map(([, label]) => label);
  return labels.join(" / ") || "--";
}

function getSleepSlots(record: RecordData) {
  if (Array.isArray(record.sleepSlots)) return record.sleepSlots;
  if (typeof record.sleepHours === "number" && record.sleepHours > 0) return Array.from({ length: record.sleepHours }, (_, index) => index + 1);
  return [];
}

function sleepTextLine(record: RecordData, locale: Locale) {
  const slots = getSleepSlots(record);
  if (!slots.length && typeof record.sleepHours === "number") return `${record.sleepHours} ${messages[locale].sleepUnit}`;
  if (!slots.length) return "";
  return `${slots.map((slot) => SLEEP_LABELS[slot - 1]).filter(Boolean).join(", ")} (${slots.length} ${messages[locale].sleepUnit})`;
}

function weekSleepTextLine(record: RecordData, locale: Locale) {
  const slots = getSleepSlots(record);
  if (!slots.length && typeof record.sleepHours === "number") return `${record.sleepHours} ${messages[locale].sleepUnit}`;
  if (!slots.length) return "";
  const slotText = slots.map((slot) => SLEEP_LABELS[slot - 1]).filter(Boolean).join(", ");
  return `${slotText}, ${slots.length} ${messages[locale].sleepUnit}`;
}

function poopLabel(value: number) {
  return value === 3 ? "3+" : String(value ?? 0);
}

function weekPoopLabel(value: number) {
  const count = Number(value);
  if (!Number.isFinite(count) || count <= 0) return "";
  if (count >= 3) return "💩💩💩+";
  return "💩".repeat(count);
}

function foodTextLine(foodPool: Record<string, number> | undefined, settings: Settings) {
  if (!foodPool) return "";
  return getFoodItems(settings).filter(([key]) => foodPool[key]).map(([, label]) => label).join(", ");
}

function getFoodFrequencies(records: RecordData[], settings: Settings) {
  const counts = new Map<string, number>();
  records.forEach((record) => {
    getFoodItems(settings).forEach(([key, label]) => {
      if (record.foodPool?.[key]) counts.set(label, (counts.get(label) ?? 0) + 1);
    });
  });
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

function emptyWeekRecord(dateKey: string): RecordData {
  return {
    id: dateKey,
    date: dateKey,
    schemaVersion: APP_SCHEMA_VERSION,
    createdAt: "",
    updatedAt: "",
    privacyHidden: {}
  };
}

function moveInArray(items: ModuleId[], itemId: ModuleId, direction: number) {
  const next = [...items];
  const index = next.indexOf(itemId);
  const target = index + direction;
  if (index < 0 || target < 0 || target >= next.length) return next;
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

function slugify(value: string) {
  return String(value).trim().toLowerCase().replace(/[^\p{Letter}\p{Number}]+/gu, "_").replace(/^_+|_+$/g, "") || Date.now().toString(36);
}

function average(values: number[]) {
  if (!values.length) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function formatAverage(value: number | null) {
  return value == null ? "--" : value.toFixed(1);
}

function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
