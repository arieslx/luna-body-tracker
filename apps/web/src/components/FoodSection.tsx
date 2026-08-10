import { useState } from "react";
import {
  EggIllustration,
  FruitIllustration,
  MeatIllustration,
  MilkIllustration,
  OilIllustration,
  OtherFoodIllustration,
  PlaceSettingIllustration,
  SnackIllustration,
  StapleIllustration,
  VegetableIllustration,
} from "@luna-body-tracker/ui";
import { useI18n, type MessageKey } from "../i18n";

const foods = [
  { id: "vegetable", labelKey: "today.food.vegetable", color: "#78aa77" },
  { id: "meat", labelKey: "today.food.meat", color: "#e58069" },
  { id: "staple", labelKey: "today.food.staple", color: "#e8bd67" },
  { id: "milk", labelKey: "today.food.milk", color: "#a7b7c7" },
  { id: "egg", labelKey: "today.food.egg", color: "#efb54d" },
  { id: "oil", labelKey: "today.food.oil", color: "#d8b94e" },
  { id: "fruit", labelKey: "today.food.fruit", color: "#e78f76" },
  { id: "snack", labelKey: "today.food.snack", color: "#c5a2c5" },
  { id: "other", labelKey: "today.food.other", color: "#a9aaa1" },
] as const;

const meals = [
  { id: "breakfast", labelKey: "meal.breakfast" },
  { id: "lunch", labelKey: "meal.lunch" },
  { id: "dinner", labelKey: "meal.dinner" },
  { id: "snack", labelKey: "meal.snack" },
] as const;

function FoodIcon({ id }: { id: (typeof foods)[number]["id"] }) {
  const FoodIllustration = {
    vegetable: VegetableIllustration,
    meat: MeatIllustration,
    staple: StapleIllustration,
    milk: MilkIllustration,
    egg: EggIllustration,
    oil: OilIllustration,
    fruit: FruitIllustration,
    snack: SnackIllustration,
    other: OtherFoodIllustration,
  }[id];
  return <FoodIllustration className="food-svg" decorative size="100%" />;
}

export function FoodSection({ selected, mealNotes, onSelectedChange, onMealNotesChange }: {
  selected: string[];
  mealNotes: Record<string, string>;
  onSelectedChange: (value: string[]) => void;
  onMealNotesChange: (value: Record<string, string>) => void;
}) {
  const { t } = useI18n();
  const [falling, setFalling] = useState<{ id: number; food: (typeof foods)[number] } | null>(null);

  function addFood(food: (typeof foods)[number]) {
    onSelectedChange(selected.includes(food.id) ? selected : [...selected, food.id]);
    setFalling({ id: Date.now(), food });
  }

  return (
    <section className="today-section food-section" id="food" data-section="food">
      <header className="food-heading">
        <p className="section-kicker">{t("today.food.kicker")}</p>
        <h2>{t("today.food.title")}</h2>
      </header>

      <div className="food-cloud" aria-label={t("today.food.types")}>
        {foods.map((food, index) => (
          <button
            aria-pressed={selected.includes(food.id)}
            className={`food-choice food-choice-${index}${selected.includes(food.id) ? " is-chosen" : ""}`}
            key={food.id}
            onClick={() => addFood(food)}
            style={{ "--food-color": food.color } as React.CSSProperties}
            type="button"
          >
            <FoodIcon id={food.id} />
            <span className="food-label">{t(food.labelKey as MessageKey)}</span>
          </button>
        ))}
      </div>

      <div className="plate-stage" aria-live="polite">
        {falling && (
          <span className="falling-food-svg" key={falling.id}><FoodIcon id={falling.food.id} /></span>
        )}
        <div className="illustrated-place-setting" aria-hidden="true">
          <PlaceSettingIllustration className="plate-svg" decorative size="100%" />
          <div className="plate-foods">
            {selected.map((id) => {
              const food = foods.find((item) => item.id === id)!;
              return <span className="plated-food" key={id}><FoodIcon id={food.id} /></span>;
            })}
          </div>
        </div>
        <p>{selected.length === 0 ? t("today.food.emptyPlate") : selected.map((id) => foods.find((food) => food.id === id)).filter((food): food is (typeof foods)[number] => Boolean(food)).map((food) => t(food.labelKey as MessageKey)).join(" · ")}</p>
        <small className="plate-guidance">{t("today.food.guidance")}</small>
      </div>

      <div className="meal-notes">
        {meals.map((meal) => (
          <label key={meal.id}>
            <span>{t(meal.labelKey)}</span>
            <textarea
              aria-label={t(meal.labelKey)}
              onChange={(event) => onMealNotesChange({ ...mealNotes, [meal.id]: event.target.value })}
              onInput={(event) => {
                event.currentTarget.style.height = "auto";
                event.currentTarget.style.height = `${event.currentTarget.scrollHeight}px`;
              }}
              placeholder={t("detail.mealPlaceholder")}
              rows={1}
              value={mealNotes[meal.id] ?? ""}
            />
          </label>
        ))}
      </div>
    </section>
  );
}
