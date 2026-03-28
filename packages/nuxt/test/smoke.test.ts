import { expect, test, vi } from "vitest";
import * as z from "zod";
import { createEnv } from "../src/index.ts";

test("accepts worktreeDetection", () => {
  vi.spyOn(console, "warn").mockImplementation(() => {});
  const currentEnv = process.env;
  process.env = {
    ...process.env,
    BAR: "foo",
  };

  try {
    const env = createEnv({
      worktreeDetection: true,
      server: { BAR: z.string() },
    });

    expect(env.BAR).toBe("foo");
  } finally {
    process.env = currentEnv;
  }
});
