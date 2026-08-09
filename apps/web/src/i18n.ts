import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { createIndexedDbStorage } from "@luna-body-tracker/storage";

export type Locale = "zh-CN" | "en";

const messages = {
  "zh-CN": {
    "week.focus": "周记重点",
    "week.focusSettings": "设置周记重点",
    "week.closeFocus": "关闭周记重点",
    "week.chooseHighlights": "选择想在周记看到的内容",
    "week.focusHint": "最多选择三项，让这一周只留下你在意的部分。",
    "week.selectedCount": "已选择 {count} / 3",
    "week.viewDay": "查看这一天",
    "week.viewDayLabel": "查看{weekday}的完整记录",
    "week.noRecord": "没有记录",
    "week.noFood": "没有留下饮食记录",
    "week.noMovement": "今天没有特别运动",
    "week.noNotes": "没有留下文字",
    "week.waterSummary": "喝了 {count} 杯水",
    "week.sleepGood": "睡得不错 · {hours} 小时",
    "week.sleepShort": "昨夜有些短 · {hours} 小时",
    "detail.back": "返回周视图",
    "detail.dailyNotes": "当天记录",
    "detail.mood": "心情",
    "detail.sleep": "睡眠",
    "detail.sleepHint": "昨晚睡了多久",
    "detail.hours": "小时",
    "detail.food": "饮食",
    "detail.mealPlaceholder": "写下一点今天吃过的…",
    "detail.water": "喝水",
    "detail.waterHint": "不用精确",
    "detail.cups": "杯",
    "detail.movement": "运动",
    "detail.movementPlaceholder": "散步、游泳，或只是伸展一下",
    "detail.body": "身体",
    "detail.weight": "体重",
    "detail.poop": "排泄",
    "detail.supplements": "保健品",
    "detail.supplementsPlaceholder": "今天吃过的保健品",
    "detail.notes": "备注",
    "detail.notesPlaceholder": "留给今天的一句话…",
    "meal.breakfast": "早餐",
    "meal.lunch": "午餐",
    "meal.dinner": "晚餐",
    "meal.snack": "加餐",
    "metric.mood": "心情",
    "metric.food": "饮食",
    "metric.sleep": "睡眠",
    "metric.movement": "运动",
    "metric.water": "喝水",
    "metric.body": "身体",
    "metric.notes": "备注",
    "mood.calm": "平静",
    "mood.happy": "开心",
    "mood.tired": "疲惫",
    "mood.sad": "难过",
    "mood.emo": "低落",
    "mood.angry": "生气",
    "weekday.0": "星期日",
    "weekday.1": "星期一",
    "weekday.2": "星期二",
    "weekday.3": "星期三",
    "weekday.4": "星期四",
    "weekday.5": "星期五",
    "weekday.6": "星期六"
    ,"settings.back": "返回今天",
    "settings.kicker": "属于你的 Luna",
    "settings.title": "设置",
    "settings.intro": "你的记录安静、私密地保存在这个浏览器中。",
    "settings.language": "语言",
    "settings.chinese": "中文",
    "settings.english": "English",
    "settings.backup": "保存副本",
    "settings.days": "{count} 天",
    "settings.readable": "可阅读的日记",
    "settings.complete": "完整数据备份",
    "settings.restore": "恢复 JSONL 备份",
    "settings.localNote": "导出和恢复都只在此设备进行，不会上传内容。清理浏览器数据或使用无痕窗口可能删除记录，建议定期保存 JSONL 备份。"
  },
  en: {
    "week.focus": "Weekly focus", "week.focusSettings": "Set weekly focus", "week.closeFocus": "Close weekly focus",
    "week.chooseHighlights": "Choose your weekly highlights", "week.focusHint": "Choose up to three things to keep this week quiet and personal.",
    "week.selectedCount": "{count} / 3 selected", "week.viewDay": "View day", "week.viewDayLabel": "View the full record for {weekday}",
    "week.noRecord": "No record", "week.noFood": "No food note", "week.noMovement": "No particular movement today", "week.noNotes": "No note",
    "week.waterSummary": "{count} cups of water", "week.sleepGood": "Rested well · {hours} hours", "week.sleepShort": "A short night · {hours} hours",
    "detail.back": "Back to week", "detail.dailyNotes": "Daily notes", "detail.mood": "Mood", "detail.sleep": "Sleep", "detail.sleepHint": "How long did you sleep?", "detail.hours": "hours",
    "detail.food": "Food", "detail.mealPlaceholder": "Leave a little note about what you ate…", "detail.water": "Water", "detail.waterHint": "No need to be exact", "detail.cups": "cups",
    "detail.movement": "Movement", "detail.movementPlaceholder": "A walk, a swim, or a little stretch", "detail.body": "Body", "detail.weight": "Weight", "detail.poop": "Poop",
    "detail.supplements": "Supplements", "detail.supplementsPlaceholder": "Anything you took today", "detail.notes": "Notes", "detail.notesPlaceholder": "A line for today…",
    "meal.breakfast": "Breakfast", "meal.lunch": "Lunch", "meal.dinner": "Dinner", "meal.snack": "Snack",
    "metric.mood": "Mood", "metric.food": "Food", "metric.sleep": "Sleep", "metric.movement": "Movement", "metric.water": "Water", "metric.body": "Body", "metric.notes": "Notes",
    "mood.calm": "Calm", "mood.happy": "Happy", "mood.tired": "Tired", "mood.sad": "Sad", "mood.emo": "Emo", "mood.angry": "Angry",
    "weekday.0": "Sunday", "weekday.1": "Monday", "weekday.2": "Tuesday", "weekday.3": "Wednesday", "weekday.4": "Thursday", "weekday.5": "Friday", "weekday.6": "Saturday",
    "settings.back": "Back to today", "settings.kicker": "Make it yours", "settings.title": "Settings",
    "settings.intro": "Your days stay quietly and privately in this browser.", "settings.language": "Language",
    "settings.chinese": "中文", "settings.english": "English", "settings.backup": "Keep a copy", "settings.days": "{count} days",
    "settings.readable": "Readable journal", "settings.complete": "Complete backup", "settings.restore": "Restore a JSONL backup",
    "settings.localNote": "Export and restore stay on this device. Clearing browser data or using private browsing may remove records, so keep a regular JSONL backup."
  }
} as const;

export type MessageKey = keyof typeof messages["zh-CN"];
export type TFunction = (key: MessageKey, values?: Record<string, string | number>) => string;

export function translate(locale: Locale, key: MessageKey, values: Record<string, string | number> = {}): string {
  let message: string = messages[locale][key];
  Object.entries(values).forEach(([name, value]) => { message = message.replaceAll(`{${name}}`, String(value)); });
  return message;
}

type I18nContextValue = { locale: Locale; setLocale: (locale: Locale) => void; t: TFunction };
const I18nContext = createContext<I18nContextValue | null>(null);
const LOCALE_SETTING = "ui-locale";

function browserLocale(): Locale {
  return typeof navigator !== "undefined" && !navigator.language.toLowerCase().startsWith("zh") ? "en" : "zh-CN";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const storage = useMemo(() => createIndexedDbStorage(), []);
  const [locale, setLocaleState] = useState<Locale>(browserLocale);

  useEffect(() => {
    void storage.getSetting<Locale>(LOCALE_SETTING).then((stored) => {
      if (stored === "zh-CN" || stored === "en") setLocaleState(stored);
    }).catch(() => undefined);
  }, [storage]);

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);
    void storage.putSetting(LOCALE_SETTING, nextLocale);
  }, [storage]);
  const t = useCallback<TFunction>((key, values) => translate(locale, key, values), [locale]);
  return createElement(I18nContext.Provider, { value: { locale, setLocale, t } }, children);
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used inside I18nProvider.");
  return context;
}
