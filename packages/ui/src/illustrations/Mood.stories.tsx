import type { Meta, StoryObj } from "@storybook/react-vite";
import { AngryIllustration, AnxiousIllustration, CalmIllustration, ConfusedIllustration, EmoIllustration, ExcitedIllustration, HappyIllustration, LovedIllustration, SadIllustration, SleepyIllustration, TiredIllustration } from "./mood";
import { IllustrationGallery, illustrationArgTypes } from "./story-helpers";
import type { IllustrationGalleryArgs } from "./story-helpers";

const entries = [
  { name: "Calm", component: CalmIllustration }, { name: "Happy", component: HappyIllustration },
  { name: "Tired", component: TiredIllustration }, { name: "Sad", component: SadIllustration },
  { name: "Emo", component: EmoIllustration }, { name: "Angry", component: AngryIllustration },
  { name: "Excited", component: ExcitedIllustration }, { name: "Anxious", component: AnxiousIllustration },
  { name: "Sleepy", component: SleepyIllustration }, { name: "Loved", component: LovedIllustration },
  { name: "Confused", component: ConfusedIllustration },
];
const Gallery = (args: IllustrationGalleryArgs) => <IllustrationGallery title="Mood" description="Quiet organic forms with minimal expressions. Only the selected mood needs full visual presence in the product." entries={entries} {...args} />;
const meta = { title: "Illustrations/Mood", component: Gallery, argTypes: illustrationArgTypes, args: { size: 96, state: "default", animated: false }, tags: ["autodocs"] } satisfies Meta<typeof Gallery>;
export default meta;
type Story = StoryObj<typeof meta>;
export const AllMoods: Story = {};
export const Muted: Story = { args: { state: "muted" } };
export const Selected: Story = { args: { state: "selected" } };
