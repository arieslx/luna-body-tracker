import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

export function repoPath(...segments: string[]) {
  return join(findRepoRoot(), ...segments);
}

function findRepoRoot() {
  let current = resolve(process.cwd());
  while (true) {
    const packagePath = join(current, "package.json");
    if (existsSync(packagePath)) {
      const packageJson = JSON.parse(readFileSync(packagePath, "utf8"));
      if (packageJson.name === "luna-body-tracker") return current;
    }
    const parent = dirname(current);
    if (parent === current) {
      throw new Error("Could not find luna-body-tracker repository root.");
    }
    current = parent;
  }
}
