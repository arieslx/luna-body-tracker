import type { Meta, StoryObj } from "@storybook/react-vite";
import { EggIllustration, FruitIllustration, MeatIllustration, MilkIllustration, OilIllustration, OtherFoodIllustration, SnackIllustration, StapleIllustration, VegetableIllustration } from "./food";
import { IllustrationGallery, illustrationArgTypes } from "./story-helpers";
import type { IllustrationGalleryArgs } from "./story-helpers";

const entries = [
  { name: "Vegetable", component: VegetableIllustration }, { name: "Meat", component: MeatIllustration },
  { name: "Rice", component: StapleIllustration }, { name: "Milk", component: MilkIllustration },
  { name: "Egg", component: EggIllustration }, { name: "Oil", component: OilIllustration },
  { name: "Fruit", component: FruitIllustration }, { name: "Snack", component: SnackIllustration },
  { name: "Other", component: OtherFoodIllustration },
];
const Gallery = (args: IllustrationGalleryArgs) => <IllustrationGallery title="Food" description="Soft filled silhouettes inspired by cut paper and painted shapes, without contour lines." entries={entries} {...args} />;
const meta = { title: "Illustrations/Food", component: Gallery, argTypes: illustrationArgTypes, args: { size: 96, state: "default", animated: false }, tags: ["autodocs"] } satisfies Meta<typeof Gallery>;
export default meta;
type Story = StoryObj<typeof meta>;
export const AllFoods: Story = {};
export const Completed: Story = { args: { state: "completed" } };
