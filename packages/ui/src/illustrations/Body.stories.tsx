import type { Meta, StoryObj } from "@storybook/react-vite";
import { PoopIllustration, ToiletIllustration, WeightIllustration } from "./body";
import { IllustrationGallery, illustrationArgTypes } from "./story-helpers";
import type { IllustrationGalleryArgs } from "./story-helpers";

const entries = [{ name: "Toilet", component: ToiletIllustration }, { name: "Poop", component: PoopIllustration }, { name: "Weight", component: WeightIllustration }];
const Gallery = (args: IllustrationGalleryArgs) => <IllustrationGallery title="Body" description="Gentle, matter-of-fact body symbols that avoid clinical dashboard language." entries={entries} {...args} />;
const meta = { title: "Illustrations/Body", component: Gallery, argTypes: illustrationArgTypes, args: { size: 96, state: "default", animated: false }, tags: ["autodocs"] } satisfies Meta<typeof Gallery>;
export default meta;
type Story = StoryObj<typeof meta>;
export const AllBody: Story = {};
