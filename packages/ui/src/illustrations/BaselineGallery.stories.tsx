import type { Meta, StoryObj } from "@storybook/react-vite";
import { AmericanoIllustration, AngryIllustration, AnxiousIllustration, CalmIllustration, ConfusedIllustration, EggIllustration, EmoIllustration, ExcitedIllustration, FruitIllustration, HappyIllustration, LatteIllustration, LovedIllustration, MeatIllustration, MilkIllustration, OilIllustration, OtherDrinkIllustration, OtherFoodIllustration, SadIllustration, SleepyIllustration, SnackIllustration, StapleIllustration, TiredIllustration, VegetableIllustration, WaterIllustration, WineIllustration } from ".";
import { IllustrationGallery } from "./story-helpers";

const entries = [
  { name: "Calm", component: CalmIllustration }, { name: "Happy", component: HappyIllustration }, { name: "Tired", component: TiredIllustration }, { name: "Sad", component: SadIllustration }, { name: "Emo", component: EmoIllustration }, { name: "Angry", component: AngryIllustration },
  { name: "Excited", component: ExcitedIllustration }, { name: "Anxious", component: AnxiousIllustration }, { name: "Sleepy", component: SleepyIllustration }, { name: "Loved", component: LovedIllustration }, { name: "Confused", component: ConfusedIllustration },
  { name: "Vegetable", component: VegetableIllustration }, { name: "Meat", component: MeatIllustration }, { name: "Rice", component: StapleIllustration }, { name: "Milk", component: MilkIllustration }, { name: "Egg", component: EggIllustration }, { name: "Oil", component: OilIllustration }, { name: "Fruit", component: FruitIllustration }, { name: "Snack", component: SnackIllustration }, { name: "Other food", component: OtherFoodIllustration },
  { name: "Water", component: WaterIllustration }, { name: "Iced Americano", component: AmericanoIllustration }, { name: "Latte", component: LatteIllustration }, { name: "Wine", component: WineIllustration }, { name: "Other drink", component: OtherDrinkIllustration },
];
const meta = { title: "Gallery/Visual baseline" } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const MoodFoodAndDrinks: Story = { render: () => <IllustrationGallery title="Luna visual baseline" description="The first shared review set. Check silhouette, softness, proportions and family resemblance before the library expands." entries={entries} size={88} /> };
