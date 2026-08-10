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
    "mood.excited": "兴奋",
    "mood.anxious": "焦虑",
    "mood.sleepy": "困倦",
    "mood.loved": "被爱",
    "mood.confused": "困惑",
    "today.rail.label": "生命状态轨道",
    "today.sleep.kicker": "昨夜",
    "today.sleep.title": "休息",
    "today.sleep.prompt": "沿着月亮的弧线，\n轻轻记下睡眠。",
    "today.sleep.reading": "睡眠",
    "today.sleep.duration": "{hours} 小时",
    "today.sleep.bedtime": "入睡时间 {time}",
    "today.sleep.wakeTime": "醒来时间 {time}",
    "today.food.kicker": "好好吃饭",
    "today.food.title": "今天吃了什么？",
    "today.food.types": "今天吃过的食物种类",
    "today.food.emptyPlate": "点一点，把今天吃过的放进盘子里",
    "today.food.guidance": "如果每餐能吃到一拳主食、两拳非淀粉蔬菜、1.5 拳肉类就好了。",
    "today.food.vegetable": "蔬菜", "today.food.meat": "肉类", "today.food.staple": "主食", "today.food.milk": "牛奶", "today.food.egg": "鸡蛋", "today.food.oil": "油", "today.food.fruit": "水果", "today.food.snack": "零食", "today.food.other": "其他",
    "today.drink.kicker": "温柔补水",
    "today.drink.title": "喝水",
    "today.drink.other": "其他饮品",
    "today.drink.multiple": "可多选",
    "today.drink.empty": "还没有记录",
    "today.drink.waterSummary": "喝了 {count} 杯水",
    "today.drink.americano": "冰美式", "today.drink.latte": "拿铁", "today.drink.wine": "酒", "today.drink.otherOption": "其他",
    "today.movement.kicker": "你的节奏",
    "today.movement.title": "活动",
    "today.movement.duration": "{minutes} 分钟",
    "today.movement.durationOver": "60+ 分钟",
    "today.movement.question": "今天身体想怎样动一动？",
    "today.movement.multiple": "可选择多项",
    "today.movement.adjusting": "正在调整 · {name}",
    "today.movement.cardio": "有氧", "today.movement.strength": "无氧",
    "today.movement.walk": "散步", "today.movement.run": "跑步", "today.movement.rope": "跳绳", "today.movement.cycle": "骑行", "today.movement.swim": "游泳",
    "today.movement.weights": "力量", "today.movement.core": "核心", "today.movement.squat": "深蹲", "today.movement.stretch": "拉伸", "today.movement.yoga": "瑜伽",
    "today.body.kicker": "身体照顾",
    "today.body.title": "身体",
    "today.body.weight": "体重",
    "today.body.weightHint": "轻触数字即可修改",
    "today.body.kg": "千克",
    "today.body.lb": "磅",
    "today.notes.kicker": "留在这里",
    "today.notes.title": "随记",
    "today.notes.prompt": "一个念头、一处细节，或者什么都不写。",
    "today.notes.label": "今天的随记",
    "today.notes.placeholder": "今天感觉……",
    "today.mood.calmMessage": "此刻很安稳，慢慢感受这份平静。",
    "today.mood.happyMessage": "把今天的小开心，轻轻收藏起来吧。",
    "today.mood.tiredMessage": "辛苦了，允许自己停下来休息一会儿。",
    "today.mood.sadMessage": "难过也没关系，你不需要马上振作。",
    "today.mood.emoMessage": "复杂的感受也值得被认真地看见。",
    "today.mood.angryMessage": "先深呼吸，你的情绪正在保护你。",
    "today.mood.excitedMessage": "这份雀跃很珍贵，让快乐多停留一会儿。",
    "today.mood.anxiousMessage": "不用急着解决一切，先陪自己慢慢呼吸。",
    "today.mood.sleepyMessage": "身体在轻声提醒你，是时候放慢一点了。",
    "today.mood.lovedMessage": "记住这份温暖，你值得被好好爱着。",
    "today.mood.confusedMessage": "暂时没有答案也没关系，方向会慢慢清晰。",
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
    "mood.excited": "Excited", "mood.anxious": "Anxious", "mood.sleepy": "Sleepy", "mood.loved": "Loved", "mood.confused": "Confused",
    "today.rail.label": "Life State Rail",
    "today.sleep.kicker": "last night", "today.sleep.title": "Rest", "today.sleep.prompt": "Follow the moon's arc,\nand softly mark your sleep.", "today.sleep.reading": "sleep", "today.sleep.duration": "{hours} hours", "today.sleep.bedtime": "Bedtime {time}", "today.sleep.wakeTime": "Wake time {time}",
    "today.food.kicker": "nourishment", "today.food.title": "What fed you?", "today.food.types": "Foods you had today", "today.food.emptyPlate": "Tap to place what you ate on the plate", "today.food.guidance": "A gentle guide: one fist of grains, two of vegetables, and one and a half of protein.",
    "today.food.vegetable": "Vegetables", "today.food.meat": "Meat", "today.food.staple": "Staples", "today.food.milk": "Milk", "today.food.egg": "Eggs", "today.food.oil": "Oil", "today.food.fruit": "Fruit", "today.food.snack": "Snacks", "today.food.other": "Other",
    "today.drink.kicker": "a soft refill", "today.drink.title": "Water", "today.drink.other": "Other drinks", "today.drink.multiple": "Select multiple", "today.drink.empty": "No record yet", "today.drink.waterSummary": "{count} cups of water",
    "today.drink.americano": "Iced Americano", "today.drink.latte": "Latte", "today.drink.wine": "Wine", "today.drink.otherOption": "Other",
    "today.movement.kicker": "your pace", "today.movement.title": "Movement", "today.movement.duration": "{minutes} min", "today.movement.durationOver": "60+ min", "today.movement.question": "How would your body like to move today?", "today.movement.multiple": "Select multiple", "today.movement.adjusting": "Adjusting · {name}",
    "today.movement.cardio": "Cardio", "today.movement.strength": "Strength",
    "today.movement.walk": "Walk", "today.movement.run": "Run", "today.movement.rope": "Jump rope", "today.movement.cycle": "Cycle", "today.movement.swim": "Swim",
    "today.movement.weights": "Weights", "today.movement.core": "Core", "today.movement.squat": "Squats", "today.movement.stretch": "Stretch", "today.movement.yoga": "Yoga",
    "today.body.kicker": "body care", "today.body.title": "Body", "today.body.weight": "Weight", "today.body.weightHint": "Tap the number to edit", "today.body.kg": "kg", "today.body.lb": "lb",
    "today.notes.kicker": "leave it here", "today.notes.title": "Notes", "today.notes.prompt": "A thought, a detail, or nothing at all.", "today.notes.label": "Notes for today", "today.notes.placeholder": "Today felt…",
    "today.mood.calmMessage": "Let yourself settle into this quiet moment.", "today.mood.happyMessage": "Keep a little piece of today's joy with you.", "today.mood.tiredMessage": "You've done enough. It is okay to rest.", "today.mood.sadMessage": "Sadness can stay awhile; you do not have to rush.", "today.mood.emoMessage": "Complicated feelings deserve to be noticed too.", "today.mood.angryMessage": "Take a breath; this feeling is trying to protect you.",
    "today.mood.excitedMessage": "This spark is precious. Let the joy stay a little longer.", "today.mood.anxiousMessage": "You do not have to solve everything now. Breathe with yourself.", "today.mood.sleepyMessage": "Your body is asking softly for a slower pace.", "today.mood.lovedMessage": "Keep this warmth close. You deserve to be deeply loved.", "today.mood.confusedMessage": "It is okay not to know yet. The way will become clearer.",
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
