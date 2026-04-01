import { defineConfig } from "vite-plus";

/**
 * Package-local Vite+ configuration for the Next.js adapter.
 */
export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  pack: {
    entry: [
      "src/index.ts",
      "src/presets-arktype.ts",
      "src/presets-zod.ts",
      "src/presets-valibot.ts",
    ],
    dts: true,
    platform: "neutral",
    unbundle: true,
  },
});
