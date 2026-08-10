import { existsSync, readFileSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { repoPath } from "../test-utils";

describe("web app build smoke harness", () => {
  it("web dist contains the installable Luna interaction prototype", () => {
    const manifest = JSON.parse(readFileSync(repoPath("apps/web/dist/manifest.webmanifest"), "utf8"));
    const html = readFileSync(repoPath("apps/web/dist/index.html"), "utf8");
    const assets = readdirSync(repoPath("apps/web/dist/assets"));

    expect(manifest).toMatchObject({
      name: "Luna Body Tracker",
      display: "standalone",
      start_url: "/"
    });
    expect(html).toContain("/manifest.webmanifest");
    expect(html).toContain("Luna — today, gently");
    expect(existsSync(repoPath("apps/web/dist/sw.js"))).toBe(true);
    expect(existsSync(repoPath("apps/web/dist/icon.png"))).toBe(true);
    expect(assets.some((asset) => asset.endsWith(".js"))).toBe(true);
    expect(assets.some((asset) => asset.endsWith(".css"))).toBe(true);
  });
});
