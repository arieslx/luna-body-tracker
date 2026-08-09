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

const foods = [
  { id: "vegetable", label: "蔬菜", color: "#78aa77" },
  { id: "meat", label: "肉类", color: "#e58069" },
  { id: "staple", label: "主食", color: "#e8bd67" },
  { id: "milk", label: "牛奶", color: "#a7b7c7" },
  { id: "egg", label: "鸡蛋", color: "#efb54d" },
  { id: "oil", label: "油", color: "#d8b94e" },
  { id: "fruit", label: "水果", color: "#e78f76" },
  { id: "snack", label: "零食", color: "#c5a2c5" },
  { id: "other", label: "其他", color: "#a9aaa1" },
] as const;

const meals = [
  { id: "breakfast", label: "Breakfast", placeholder: "egg, coffee, or whatever you remember…" },
  { id: "lunch", label: "Lunch", placeholder: "a word or a little note about lunch…" },
  { id: "dinner", label: "Dinner", placeholder: "what dinner felt like today…" },
  { id: "snack", label: "Snack", placeholder: "anything in between…" },
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
  const [falling, setFalling] = useState<{ id: number; food: (typeof foods)[number] } | null>(null);

  function addFood(food: (typeof foods)[number]) {
    onSelectedChange(selected.includes(food.id) ? selected : [...selected, food.id]);
    setFalling({ id: Date.now(), food });
  }

  return (
    <section className="today-section food-section" id="food" data-section="food">
      <header className="food-heading">
        <p className="section-kicker">nourishment</p>
        <h2>What fed you?</h2>
      </header>

      <div className="food-cloud" aria-label="今天吃过的食物种类">
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
            <span className="food-label">{food.label}</span>
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
        <p>{selected.length === 0 ? "点一点，把今天吃过的放进盘子里" : selected.map((id) => foods.find((food) => food.id === id)?.label).filter(Boolean).join(" · ")}</p>
        <small className="plate-guidance">如果每餐能吃到一拳主食、两拳非淀粉蔬菜、1.5 拳肉类就好了。</small>
      </div>

      <div className="meal-notes">
        {meals.map((meal) => (
          <label key={meal.id}>
            <span>{meal.label}</span>
            <textarea
              aria-label={meal.label}
              onChange={(event) => onMealNotesChange({ ...mealNotes, [meal.id]: event.target.value })}
              onInput={(event) => {
                event.currentTarget.style.height = "auto";
                event.currentTarget.style.height = `${event.currentTarget.scrollHeight}px`;
              }}
              placeholder={meal.placeholder}
              rows={1}
              value={mealNotes[meal.id] ?? ""}
            />
          </label>
        ))}
      </div>
    </section>
  );
}
