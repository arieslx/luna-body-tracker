import type { ComponentType } from "react";
import type { IllustrationProps } from "./types";

export type IllustrationEntry = {
  name: string;
  component: ComponentType<IllustrationProps>;
};

export type IllustrationGalleryArgs = Pick<IllustrationProps, "state" | "animated"> & {
  size?: number;
};

export function IllustrationGallery({
  title,
  description,
  entries,
  size = 96,
  state = "default",
  animated = false,
}: {
  title: string;
  description: string;
  entries: IllustrationEntry[];
  size?: number;
  state?: IllustrationProps["state"];
  animated?: boolean;
}) {
  return (
    <main className="luna-story-page">
      <h1>{title}</h1>
      <p>{description}</p>
      <div className="luna-story-grid">
        {entries.map(({ name, component: Component }) => (
          <div className="luna-story-item" key={name}>
            <Component size={size} state={state} animated={animated} title={name} />
            <span>{name}</span>
          </div>
        ))}
      </div>
    </main>
  );
}

export const illustrationArgTypes = {
  size: { control: { type: "range", min: 24, max: 160, step: 8 } },
  state: { control: "inline-radio", options: ["default", "muted", "selected", "completed"] },
  animated: { control: "boolean" },
} as const;
