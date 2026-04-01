import { defineConfig } from "vite-plus";

/**
 * Root Vite+ configuration for the monorepo smoke build and staged checks.
 *
 * Lint and format settings live in sidecar Oxlint/Oxfmt configs for now because
 * `vp lint` / `vp fmt` in vite-plus 0.1.15 still fail when they are sourced from
 * `vite.config.ts` in this monorepo layout.
 */
export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  run: {
    cache: {
      scripts: true,
      tasks: true,
    },
  },
  build: {
    lib: {
      entry: "./scripts/vp-build-entry.ts",
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
