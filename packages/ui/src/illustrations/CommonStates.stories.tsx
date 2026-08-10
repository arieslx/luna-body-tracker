import type { Meta, StoryObj } from "@storybook/react-vite";
import { AddIllustration, CompletedIllustration, EmptyIllustration, SelectedIllustration } from "./common";
import { IllustrationGallery, illustrationArgTypes } from "./story-helpers";
import type { IllustrationGalleryArgs } from "./story-helpers";

const entries = [{ name: "Empty", component: EmptyIllustration }, { name: "Selected", component: SelectedIllustration }, { name: "Completed", component: CompletedIllustration }, { name: "Add", component: AddIllustration }];
const Gallery = (args: IllustrationGalleryArgs) => <IllustrationGallery title="Common states" description="State symbols combine shape and internal marks so meaning does not depend on color alone." entries={entries} {...args} />;
const meta = { title: "Illustrations/Common states", component: Gallery, argTypes: illustrationArgTypes, args: { size: 96, state: "default", animated: false }, tags: ["autodocs"] } satisfies Meta<typeof Gallery>;
export default meta;
type Story = StoryObj<typeof meta>;
export const AllCommonStates: Story = {};
