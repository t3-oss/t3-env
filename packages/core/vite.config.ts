import { defineConfig } from "vite-plus";

/**
 * Package-local Vite+ pack configuration for @t3-oss/env-core.
 */
export default defineConfig({
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
