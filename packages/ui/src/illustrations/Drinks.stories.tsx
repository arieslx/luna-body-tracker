import type { Meta, StoryObj } from "@storybook/react-vite";
import { AmericanoIllustration, LatteIllustration, OtherDrinkIllustration, WaterIllustration, WineIllustration } from "./drinks";
import { IllustrationGallery, illustrationArgTypes } from "./story-helpers";
import type { IllustrationGalleryArgs } from "./story-helpers";

const entries = [
  { name: "Water", component: WaterIllustration }, { name: "Iced Americano", component: AmericanoIllustration },
  { name: "Latte", component: LatteIllustration }, { name: "Wine", component: WineIllustration },
  { name: "Other", component: OtherDrinkIllustration },
];
const Gallery = (args: IllustrationGalleryArgs) => <IllustrationGallery title="Drinks" description="A small family of softly colored vessels that remains readable at compact mobile sizes." entries={entries} {...args} />;
const meta = { title: "Illustrations/Drinks", component: Gallery, argTypes: illustrationArgTypes, args: { size: 96, state: "default", animated: false }, tags: ["autodocs"] } satisfies Meta<typeof Gallery>;
export default meta;
type Story = StoryObj<typeof meta>;
export const AllDrinks: Story = {};
export const Animated: Story = { args: { animated: true } };
