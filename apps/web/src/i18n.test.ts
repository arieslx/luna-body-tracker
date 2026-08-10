import { describe, expect, it } from "vitest";
import { translate } from "./i18n";

describe("Today translations", () => {
  it("renders the requested Chinese module copy", () => {
    expect(translate("zh-CN", "metric.mood")).toBe("心情");
    expect(translate("zh-CN", "today.sleep.title")).toBe("休息");
    expect(translate("zh-CN", "meal.snack")).toBe("加餐");
    expect(translate("zh-CN", "today.movement.durationOver")).toBe("60+ 分钟");
    expect(translate("zh-CN", "today.body.kg")).toBe("千克");
    expect(translate("zh-CN", "today.notes.placeholder")).toBe("今天感觉……");
    expect(translate("zh-CN", "mood.excited")).toBe("兴奋");
    expect(translate("zh-CN", "mood.anxious")).toBe("焦虑");
    expect(translate("zh-CN", "mood.sleepy")).toBe("困倦");
    expect(translate("zh-CN", "mood.loved")).toBe("被爱");
    expect(translate("zh-CN", "mood.confused")).toBe("困惑");
  });

  it("keeps matching English copy for the same modules", () => {
    expect(translate("en", "metric.mood")).toBe("Mood");
    expect(translate("en", "today.sleep.title")).toBe("Rest");
    expect(translate("en", "meal.snack")).toBe("Snack");
    expect(translate("en", "today.movement.durationOver")).toBe("60+ min");
    expect(translate("en", "today.body.kg")).toBe("kg");
    expect(translate("en", "today.notes.placeholder")).toBe("Today felt…");
    expect(translate("en", "mood.excited")).toBe("Excited");
    expect(translate("en", "mood.anxious")).toBe("Anxious");
    expect(translate("en", "mood.sleepy")).toBe("Sleepy");
    expect(translate("en", "mood.loved")).toBe("Loved");
    expect(translate("en", "mood.confused")).toBe("Confused");
  });
});
