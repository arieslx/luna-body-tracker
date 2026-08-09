import type { Meta, StoryObj } from "@storybook/react-vite";
import { EggIllustration } from "./food";

const meta = { title: "Foundations/Sizing", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const StandardSizes: Story = {
  render: () => <main className="luna-story-page"><h1>Standard sizes</h1><p>Silhouettes and internal details must remain clear throughout the product scale.</p><div className="luna-size-row">{[24, 32, 48, 64, 96, 160, 240].map((size) => <div className="luna-size-sample" key={size}><EggIllustration size={size} title={`Egg at ${size}px`} /><span>{size}px</span></div>)}</div></main>,
};
