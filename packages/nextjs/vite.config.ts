import { defineConfig } from "vite-plus";

/**
 * Package-local Vite+ configuration for the Next.js adapter.
 */
export default defineConfig({
  resolve: {
    alias: {
      "@t3-oss/env-core": new URL("../core/src/index.ts", import.meta.url).pathname,
      "@t3-oss/env-core/presets-arktype": new URL("../core/src/presets-arktype.ts", import.meta.url)
        .pathname,
      "@t3-oss/env-core/presets-zod": new URL("../core/src/presets-zod.ts", import.meta.url)
        .pathname,
      "@t3-oss/env-core/presets-valibot": new URL("../core/src/presets-valibot.ts", import.meta.url)
        .pathname,
    },
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
