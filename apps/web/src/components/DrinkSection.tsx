import { useState } from "react";
import {
  AmericanoIllustration,
  LatteIllustration,
  OtherDrinkIllustration,
  WaterIllustration,
  WineIllustration,
} from "@luna-body-tracker/ui";

const drinks = [
  { id: "americano", label: "冰美式" },
  { id: "latte", label: "拿铁" },
  { id: "wine", label: "酒" },
  { id: "other", label: "其他" },
];

function DrinkIcon({ id }: { id: string }) {
  const DrinkIllustration = {
    americano: AmericanoIllustration,
    latte: LatteIllustration,
    wine: WineIllustration,
    other: OtherDrinkIllustration,
  }[id] ?? OtherDrinkIllustration;
  return <DrinkIllustration className="drink-svg" decorative size="100%" />;
}

export function DrinkSection({ water, selectedDrinks, onWaterChange, onSelectedDrinksChange }: {
  water: number;
  selectedDrinks: string[];
  onWaterChange: (value: number) => void;
  onSelectedDrinksChange: (value: string[]) => void;
}) {
  const [ripple, setRipple] = useState(0);
  const [summaryOpen, setSummaryOpen] = useState(false);

  function chooseWater(level: number) {
    onWaterChange(level);
    setRipple(Date.now());
  }

  function toggleDrink(id: string) {
    onSelectedDrinksChange(selectedDrinks.includes(id) ? selectedDrinks.filter((item) => item !== id) : [...selectedDrinks, id]);
  }

  const selectedDrinkLabels = drinks.filter((drink) => selectedDrinks.includes(drink.id)).map((drink) => drink.label);
  const waterWords = [water > 0 ? `喝了 ${water} 杯水` : "", ...selectedDrinkLabels].filter(Boolean).join(" · ") || "还没有记录";
  const waterTop = 341 - water * 36.55;

  return (
    <section className="today-section drink-section" id="drink" data-section="drink">
      <header className="drink-heading">
        <p className="section-kicker">a soft refill</p>
        <h2>Water</h2>
      </header>

      <div className="water-cup-wrap">
        <div className="svg-water-cup">
          <WaterIllustration className="water-glass-svg" decorative level={water} size="100%" />
          {ripple > 0 && <span className="water-ripple" key={ripple} style={{ top: `${waterTop}px` }} />}
          <div className="water-segments" aria-label={`饮水状态，八格中已选择${water}格`}>
            {Array.from({ length: 8 }).map((_, index) => {
              const level = 8 - index;
              return <button aria-label={`选择第${level}格水位`} className={water >= level ? "is-filled" : ""} key={level} onClick={() => chooseWater(level)} type="button" />;
            })}
          </div>
        </div>
        <div className="water-summary">
          <button
            aria-expanded={summaryOpen}
            aria-label={`饮水记录：${waterWords}`}
            onClick={() => setSummaryOpen((open) => !open)}
            onKeyDown={(event) => { if (event.key === "Escape") setSummaryOpen(false); }}
            type="button"
          >{waterWords}</button>
          {summaryOpen && <div className="water-summary-popover" role="tooltip">{waterWords}</div>}
        </div>
      </div>

      <div className="other-drinks">
        <div className="other-drinks-title"><span>其他饮品</span><small>可多选</small></div>
        <div className="drink-options">
          {drinks.map((drink) => (
            <button className={selectedDrinks.includes(drink.id) ? "is-selected" : ""} key={drink.id} onClick={() => toggleDrink(drink.id)} type="button">
              <DrinkIcon id={drink.id} />
              {drink.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
