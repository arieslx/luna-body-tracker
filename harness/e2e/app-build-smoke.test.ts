import { existsSync, readFileSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { repoPath } from "../test-utils";

describe("extension and PWA build smoke harness", () => {
  it("extension dist is loadable as an unpacked Chrome extension", () => {
    const manifest = JSON.parse(readFileSync(repoPath("apps/extension/dist/manifest.json"), "utf8"));
    const html = readFileSync(repoPath("apps/extension/dist/newtab.html"), "utf8");
    const assets = readdirSync(repoPath("apps/extension/dist/assets"));

    expect(manifest).toMatchObject({
      manifest_version: 3,
      name: "Luna Body Tracker",
      chrome_url_overrides: { newtab: "newtab.html" }
    });
    expect(html).toContain("Luna Body Tracker");
    expect(assets.some((asset) => asset.endsWith(".js"))).toBe(true);
    expect(assets.some((asset) => asset.endsWith(".css"))).toBe(true);
  });

  it("web dist contains PWA install assets and the shared app shell", () => {
    const manifest = JSON.parse(readFileSync(repoPath("apps/web/dist/manifest.webmanifest"), "utf8"));
    const html = readFileSync(repoPath("apps/web/dist/index.html"), "utf8");

    expect(manifest).toMatchObject({
      name: "Luna Body Tracker",
      display: "standalone",
      start_url: "/"
    });
    expect(html).toContain("/manifest.webmanifest");
    expect(existsSync(repoPath("apps/web/dist/sw.js"))).toBe(true);
    expect(existsSync(repoPath("apps/web/dist/icons/icon.svg"))).toBe(true);
  });
});
