import { describe, expect, test } from "vitest";
import * as z from "zod/v4";
import { createEnv } from "../src/index.ts";

describe("skipValidation", () => {
  test("applies schema defaults when the values are valid (#266)", () => {
    const env = createEnv({
      server: {
        LOG_LEVEL: z.string().default("info"),
      },
      runtimeEnv: {},
      skipValidation: true,
    });

    expect(env.LOG_LEVEL).toBe("info");
  });

  test("keeps raw values when they are invalid instead of throwing", () => {
    const env = createEnv({
      server: {
        PORT: z.coerce.number().min(1),
      },
      runtimeEnv: { PORT: "not-a-number" },
      skipValidation: true,
    });

    expect(env.PORT).toBe("not-a-number");
  });

  test("does not throw when required values are missing", () => {
    const env = createEnv({
      server: {
        DATABASE_URL: z.string(),
      },
      runtimeEnv: { OTHER: "kept" },
      skipValidation: true,
    });

    expect(env.DATABASE_URL).toBeUndefined();
    expect((env as Record<string, unknown>).OTHER).toBe("kept");
  });
});
