import type { Meta, StoryObj } from "@storybook/react-vite";
import { lunaPalette } from "./palette";

const meta = { title: "Foundations/Palette", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const SoftPalette: Story = {
  render: () => <main className="luna-story-page"><h1>Soft palette</h1><p>Named colors shared by every Luna illustration. Warm paper is the default canvas.</p><div className="luna-palette-grid">{Object.entries(lunaPalette).map(([name, value]) => <div className="luna-palette-swatch" key={name} style={{ background: value }}><strong>{name}</strong><br />{value}</div>)}</div></main>,
};
