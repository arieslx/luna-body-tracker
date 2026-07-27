import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Luna landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Luna Body Tracker｜属于你的身心记录<\/title>/i);
  assert.match(html, /听见身体的/);
  assert.match(html, /01 \/ WHAT LUNA DOES/);
  assert.match(html, /从今天的一条记录开始。/);
  assert.doesNotMatch(html, /02 \/ A QUIETER WAY/);
  assert.doesNotMatch(html, /class="principles"/);
  assert.doesNotMatch(html, /href="#principles"/);
});

test("uses the requested palette without replacing the app palette", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

  assert.match(css, /--landing-background:\s*#eff0f3/);
  assert.match(css, /--landing-headline:\s*#0d0d0d/);
  assert.match(css, /--landing-paragraph:\s*#2a2a2a/);
  assert.match(css, /--landing-highlight:\s*#ff8e3c/);
  assert.match(css, /--landing-secondary:\s*#ffffff/);
  assert.match(css, /--landing-tertiary:\s*#d9376e/);

  assert.match(css, /--indigo:\s*#2917d9/);
  assert.match(css, /--paper:\s*#f8f7f3/);
  assert.match(css, /\.card-daily\s*\{[^}]*background:\s*var\(--lavender\)/s);
  assert.match(css, /\.card-local\s*\{[^}]*background:\s*var\(--pink\)/s);
  assert.match(css, /\.card-ai\s*\{[^}]*background:\s*var\(--blue\)/s);
});
