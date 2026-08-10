import type { Meta, StoryObj } from "@storybook/react-vite";
import { BowlIllustration, ForkIllustration, KnifeIllustration, PlaceSettingIllustration, PlateIllustration } from "./tableware";
import { IllustrationGallery, illustrationArgTypes } from "./story-helpers";
import type { IllustrationGalleryArgs } from "./story-helpers";

const entries = [{ name: "Oval plate set", component: PlaceSettingIllustration }, { name: "Oval plate", component: PlateIllustration }, { name: "Bowl", component: BowlIllustration }, { name: "Fork", component: ForkIllustration }, { name: "Knife", component: KnifeIllustration }];
const Gallery = (args: IllustrationGalleryArgs) => <IllustrationGallery title="Tableware" description="Quiet table objects built from layered fills and softly imperfect proportions." entries={entries} {...args} />;
const meta = { title: "Illustrations/Tableware", component: Gallery, argTypes: illustrationArgTypes, args: { size: 96, state: "default", animated: false }, tags: ["autodocs"] } satisfies Meta<typeof Gallery>;
export default meta;
type Story = StoryObj<typeof meta>;
export const AllTableware: Story = {};
