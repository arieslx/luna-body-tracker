import type { Meta, StoryObj } from "@storybook/react-vite";
import { AmericanoIllustration, AngryIllustration, CalmIllustration, EggIllustration, FruitIllustration, HappyIllustration, LatteIllustration, MeatIllustration, MilkIllustration, OilIllustration, OtherDrinkIllustration, OtherFoodIllustration, SadIllustration, SnackIllustration, StapleIllustration, TiredIllustration, VegetableIllustration, WaterIllustration, WineIllustration, EmoIllustration } from ".";
import { IllustrationGallery } from "./story-helpers";

const entries = [
  { name: "Calm", component: CalmIllustration }, { name: "Happy", component: HappyIllustration }, { name: "Tired", component: TiredIllustration }, { name: "Sad", component: SadIllustration }, { name: "Emo", component: EmoIllustration }, { name: "Angry", component: AngryIllustration },
  { name: "Vegetable", component: VegetableIllustration }, { name: "Meat", component: MeatIllustration }, { name: "Rice", component: StapleIllustration }, { name: "Milk", component: MilkIllustration }, { name: "Egg", component: EggIllustration }, { name: "Oil", component: OilIllustration }, { name: "Fruit", component: FruitIllustration }, { name: "Snack", component: SnackIllustration }, { name: "Other food", component: OtherFoodIllustration },
  { name: "Water", component: WaterIllustration }, { name: "Iced Americano", component: AmericanoIllustration }, { name: "Latte", component: LatteIllustration }, { name: "Wine", component: WineIllustration }, { name: "Other drink", component: OtherDrinkIllustration },
];
const meta = { title: "Gallery/Visual baseline" } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const MoodFoodAndDrinks: Story = { render: () => <IllustrationGallery title="Luna visual baseline" description="The first shared review set. Check silhouette, softness, proportions and family resemblance before the library expands." entries={entries} size={88} /> };
