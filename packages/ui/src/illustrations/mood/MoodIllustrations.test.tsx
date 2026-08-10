import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  AnxiousIllustration,
  ConfusedIllustration,
  ExcitedIllustration,
  LovedIllustration,
  SleepyIllustration,
} from "./MoodIllustrations";

const newMoods = [
  ["Excited", ExcitedIllustration],
  ["Anxious", AnxiousIllustration],
  ["Sleepy", SleepyIllustration],
  ["Loved", LovedIllustration],
  ["Confused", ConfusedIllustration],
] as const;

describe("extended mood illustrations", () => {
  it.each(newMoods)("renders %s with an accessible title", (title, Component) => {
    const html = renderToStaticMarkup(<Component size={96} />);
    expect(html).toContain('role="img"');
    expect(html).toContain(`<title`);
    expect(html).toContain(`>${title}</title>`);
  });
});
