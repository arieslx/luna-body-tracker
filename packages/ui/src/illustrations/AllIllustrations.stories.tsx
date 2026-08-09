import type { Meta, StoryObj } from "@storybook/react-vite";
import { PoopIllustration, ToiletIllustration, WeightIllustration } from "./body";
import { AddIllustration, CompletedIllustration, EmptyIllustration, SelectedIllustration } from "./common";
import { AmericanoIllustration, LatteIllustration, OtherDrinkIllustration, WaterIllustration, WineIllustration } from "./drinks";
import { EggIllustration, FruitIllustration, MeatIllustration, MilkIllustration, OilIllustration, OtherFoodIllustration, SnackIllustration, StapleIllustration, VegetableIllustration } from "./food";
import { AngryIllustration, CalmIllustration, EmoIllustration, HappyIllustration, SadIllustration, TiredIllustration } from "./mood";
import { IllustrationGallery } from "./story-helpers";
import { BowlIllustration, ForkIllustration, KnifeIllustration, PlaceSettingIllustration, PlateIllustration } from "./tableware";

const entries = [
  { name: "Calm", component: CalmIllustration }, { name: "Happy", component: HappyIllustration }, { name: "Tired", component: TiredIllustration }, { name: "Sad", component: SadIllustration }, { name: "Emo", component: EmoIllustration }, { name: "Angry", component: AngryIllustration },
  { name: "Vegetable", component: VegetableIllustration }, { name: "Meat", component: MeatIllustration }, { name: "Rice", component: StapleIllustration }, { name: "Milk", component: MilkIllustration }, { name: "Egg", component: EggIllustration }, { name: "Oil", component: OilIllustration }, { name: "Fruit", component: FruitIllustration }, { name: "Snack", component: SnackIllustration }, { name: "Other food", component: OtherFoodIllustration },
  { name: "Water", component: WaterIllustration }, { name: "Iced Americano", component: AmericanoIllustration }, { name: "Latte", component: LatteIllustration }, { name: "Wine", component: WineIllustration }, { name: "Other drink", component: OtherDrinkIllustration },
  { name: "Oval plate set", component: PlaceSettingIllustration }, { name: "Oval plate", component: PlateIllustration }, { name: "Bowl", component: BowlIllustration }, { name: "Fork", component: ForkIllustration }, { name: "Knife", component: KnifeIllustration },
  { name: "Toilet", component: ToiletIllustration }, { name: "Poop", component: PoopIllustration }, { name: "Weight", component: WeightIllustration },
  { name: "Empty", component: EmptyIllustration }, { name: "Selected", component: SelectedIllustration }, { name: "Completed", component: CompletedIllustration }, { name: "Add", component: AddIllustration },
];

const meta = { title: "Gallery/All illustrations" } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const CompleteInventory: Story = {
  render: () => <IllustrationGallery title="All illustrations" description={`${entries.length} reusable Luna elements in one visual inventory.`} entries={entries} size={80} />,
};

export const StateAndSizeCheck: Story = {
  render: () => <main className="luna-story-page"><h1>State and size check</h1><p>A representative object checked across product states and compact-to-feature sizes.</p>{(["default", "muted", "selected", "completed"] as const).map((state) => <section key={state} style={{ marginBottom: 28 }}><h2 style={{ fontFamily: "Georgia, serif", fontWeight: 500 }}>{state}</h2><div className="luna-size-row">{[24, 64, 160].map((size) => <div className="luna-size-sample" key={size}><EggIllustration size={size} state={state} title={`Egg, ${state}, ${size}px`} /><span>{size}px</span></div>)}</div></section>)}</main>,
};
