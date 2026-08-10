import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Illustration } from "./Illustration";

describe("Illustration", () => {
  it("renders an accessible title when one is supplied", () => {
    const html = renderToStaticMarkup(<Illustration title="Soft egg"><circle cx="32" cy="32" r="10" /></Illustration>);
    expect(html).toContain('role="img"');
    expect(html).toContain("Soft egg");
    expect(html).toContain("aria-labelledby");
  });

  it("is hidden from assistive technology when decorative", () => {
    const html = renderToStaticMarkup(<Illustration decorative><circle cx="32" cy="32" r="10" /></Illustration>);
    expect(html).toContain('aria-hidden="true"');
    expect(html).not.toContain("<title");
  });

  it("exposes visual state without relying on a business class", () => {
    const html = renderToStaticMarkup(<Illustration state="completed" title="Done"><circle cx="32" cy="32" r="10" /></Illustration>);
    expect(html).toContain('data-state="completed"');
    expect(html).toContain("luna-complete-mark");
  });
});
