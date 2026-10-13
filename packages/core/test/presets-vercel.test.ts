import { afterEach, expect, expectTypeOf, test, vi } from "vitest";
import { vercel as arktypeVercel } from "../src/presets-arktype.ts";
import { vercel as valibotVercel } from "../src/presets-valibot.ts";
import { vercel as zodVercel } from "../src/presets-zod.ts";

const presets = [
  ["Arktype", arktypeVercel],
  ["Valibot", valibotVercel],
  ["Zod", zodVercel],
] as const;

afterEach(() => vi.unstubAllEnvs());

test.each(presets)("%s preserves VERCEL_PROJECT_ID", (_, vercel) => {
  vi.stubEnv("VERCEL_PROJECT_ID", "prj_example");
  const env = vercel();
  expect(env.VERCEL_PROJECT_ID).toBe("prj_example");
  expectTypeOf(env.VERCEL_PROJECT_ID).toEqualTypeOf<string | undefined>();
});

test.each(presets)("%s allows VERCEL_PROJECT_ID to be absent", (_, vercel) => {
  vi.stubEnv("VERCEL_PROJECT_ID", undefined);
  expect(vercel().VERCEL_PROJECT_ID).toBeUndefined();
});
