import { fileURLToPath } from "node:url";
import { defineConfig } from "vite-plus";

const coreIndexPath = fileURLToPath(new URL("./packages/core/src/index.ts", import.meta.url));
const corePresetsArktypePath = fileURLToPath(
  new URL("./packages/core/src/presets-arktype.ts", import.meta.url),
);
const corePresetsValibotPath = fileURLToPath(
  new URL("./packages/core/src/presets-valibot.ts", import.meta.url),
);
const corePresetsZodPath = fileURLToPath(
  new URL("./packages/core/src/presets-zod.ts", import.meta.url),
);
const workspaceSmokeEntryPath = fileURLToPath(
  new URL("./scripts/vp-build-entry.ts", import.meta.url),
);

/**
 * Root Vite+ configuration for the monorepo smoke build, test aliases, and staged checks.
 *
 * Lint and format settings live in sidecar Oxlint/Oxfmt configs for now because
 * `vp lint` / `vp fmt` in vite-plus 0.1.15 still fail when they are sourced from
 * `vite.config.ts` in this monorepo layout.
 */
export default defineConfig({
  resolve: {
    alias: {
      "@t3-oss/env-core": coreIndexPath,
      "@t3-oss/env-core/presets-arktype": corePresetsArktypePath,
      "@t3-oss/env-core/presets-valibot": corePresetsValibotPath,
      "@t3-oss/env-core/presets-zod": corePresetsZodPath,
    },
  },
  build: {
    lib: {
      entry: workspaceSmokeEntryPath,
      fileName: "workspace-smoke",
      formats: ["es"],
    },
    outDir: ".vite-build",
    emptyOutDir: true,
  },
  test: {
    silent: "passed-only",
  },
  staged: {
    "*": "vp check --fix",
  },
});
