import type { Preview } from "@storybook/react-vite";
import "../packages/ui/src/illustrations/illustrations.css";

const preview: Preview = {
  parameters: {
    backgrounds: {
      options: {
        luna: { name: "Luna paper", value: "#f8f7f1" },
        white: { name: "White", value: "#ffffff" },
        sage: { name: "Soft sage", value: "#dfe8dc" },
      },
    },
    controls: { expanded: true },
    a11y: { test: "todo" },
  },
  initialGlobals: { backgrounds: { value: "luna" } },
};

export default preview;
