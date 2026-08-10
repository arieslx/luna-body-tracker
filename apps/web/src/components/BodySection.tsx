import { useState } from "react";
import { PoopIllustration, ToiletIllustration } from "@luna-body-tracker/ui";
import { useI18n } from "../i18n";

type Unit = "kg" | "lb";

export function BodySection({ poopCount, weightKg, onPoopCountChange, onWeightKgChange }: {
  poopCount: number;
  weightKg?: number;
  onPoopCountChange: (value: number) => void;
  onWeightKgChange: (value: number | undefined) => void;
}) {
  const { t } = useI18n();
  const [dropKey, setDropKey] = useState(0);
  const [unit, setUnit] = useState<Unit>("kg");
  const shownWeight = unit === "kg" ? weightKg : weightKg === undefined ? undefined : weightKg * 2.20462;

  function flush() {
    onPoopCountChange(Math.min(3, poopCount + 1));
    setDropKey(Date.now());
  }

  function choosePoopCount(count: number) {
    onPoopCountChange(count);
    setDropKey(Date.now());
  }

  function updateWeight(value: string) {
    if (!value.trim()) {
      onWeightKgChange(undefined);
      return;
    }
    const next = Number(value);
    if (!Number.isFinite(next)) return;
    onWeightKgChange(unit === "kg" ? next : next / 2.20462);
  }

  return (
    <section className="today-section body-section" id="body" data-section="body">
      <header className="body-heading">
        <p className="section-kicker">{t("today.body.kicker")}</p>
        <h2>{t("today.body.title")}</h2>
      </header>

      <div className="poop-area">
        <div className="poop-count" aria-label={`今天排便 ${poopCount >= 3 ? "3次以上" : `${poopCount}次`}`}>
          {[0, 1, 2, 3].map((count) => <button aria-label={`记录为${count === 3 ? "3次以上" : `${count}次`}`} className={poopCount === count ? "is-active" : ""} key={count} onClick={() => choosePoopCount(count)} type="button">{count === 3 ? "3+" : count}</button>)}
          <small>次</small>
        </div>
        <div className="toilet">
          <ToiletIllustration className="toilet-svg" decorative size="100%" />
          {dropKey > 0 && <span className="falling-poop-svg" key={dropKey}><PoopIllustration decorative size="100%" /></span>}
          <button aria-label="增加一次排便记录" className="flush-button" onClick={flush} type="button" />
        </div>
      </div>

      <div className="weight-area">
        <div>
          <p>{t("today.body.weight")}</p>
          <small>{t("today.body.weightHint")}</small>
        </div>
        <label className="weight-input">
          <input aria-label={`体重，单位${unit}`} inputMode="decimal" onChange={(event) => updateWeight(event.target.value)} placeholder="—" step="0.1" type="number" value={shownWeight === undefined ? "" : shownWeight.toFixed(1)} />
        </label>
        <div className="unit-switch" aria-label="体重单位">
          <button className={unit === "kg" ? "is-active" : ""} onClick={() => setUnit("kg")} type="button">{t("today.body.kg")}</button>
          <button className={unit === "lb" ? "is-active" : ""} onClick={() => setUnit("lb")} type="button">{t("today.body.lb")}</button>
        </div>
      </div>
    </section>
  );
}
