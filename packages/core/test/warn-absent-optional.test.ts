import { afterEach, describe, expect, test, vi } from "vitest";
import * as z from "zod/v4";
import { createEnv } from "../src/index.ts";

describe("warnAbsentOptional", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("warns for optional variables that are not set", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    createEnv({
      server: {
        SENTRY_DSN: z.string().optional(),
        DATABASE_URL: z.string(),
      },
      runtimeEnv: { DATABASE_URL: "postgres://localhost" },
      warnAbsentOptional: true,
    });

    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("SENTRY_DSN"));
  });

  test("doesn't warn for optional variables that are set", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    createEnv({
      server: { SENTRY_DSN: z.string().optional() },
      runtimeEnv: { SENTRY_DSN: "https://sentry.io" },
      warnAbsentOptional: true,
    });

    expect(warn).not.toHaveBeenCalled();
  });

  test("doesn't warn for variables with a default", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    createEnv({
      server: { LOG_LEVEL: z.string().default("info") },
      runtimeEnv: {},
      warnAbsentOptional: true,
    });

    expect(warn).not.toHaveBeenCalled();
  });

  test("is off by default", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    createEnv({
      server: { SENTRY_DSN: z.string().optional() },
      runtimeEnv: {},
    });

    expect(warn).not.toHaveBeenCalled();
  });
});
