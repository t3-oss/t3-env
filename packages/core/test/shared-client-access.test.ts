import { describe, expect, test } from "vitest";
import * as z from "zod/v4";
import { createEnv } from "../src/index.ts";

describe("shared variables on the client", () => {
  test("shared variables are readable on the client without a clientPrefix (#228)", () => {
    const env = createEnv({
      clientPrefix: undefined,
      shared: { NODE_ENV: z.string() },
      server: {},
      client: {},
      runtimeEnv: { NODE_ENV: "development" },
      isServer: false,
    });

    expect(env.NODE_ENV).toBe("development");
  });

  test("shared variables from an extended preset are readable on the client (#240)", () => {
    const common = createEnv({
      clientPrefix: undefined,
      shared: { NODE_ENV: z.enum(["development", "production", "test"]) },
      server: {},
      client: {},
      runtimeEnv: { NODE_ENV: "production" },
      isServer: true,
    });

    const siteEnv = createEnv({
      clientPrefix: undefined,
      extends: [common],
      server: {},
      client: {},
      runtimeEnv: {},
      isServer: false,
    });

    expect(siteEnv.NODE_ENV).toBe("production");
  });

  test("server-only variables from an extended preset stay hidden on the client", () => {
    const common = createEnv({
      clientPrefix: undefined,
      server: { SECRET: z.string() },
      client: {},
      runtimeEnv: { SECRET: "hunter2" },
      isServer: true,
    });

    const siteEnv = createEnv({
      clientPrefix: undefined,
      extends: [common],
      server: {},
      client: {},
      runtimeEnv: {},
      isServer: false,
    });

    expect(() => siteEnv.SECRET).toThrow();
  });

  test("client-prefixed variables from an extended preset are readable on the client", () => {
    const common = createEnv({
      clientPrefix: "PUBLIC_",
      client: { PUBLIC_URL: z.string() },
      server: {},
      runtimeEnv: { PUBLIC_URL: "https://example.com" },
      isServer: true,
    });

    const siteEnv = createEnv({
      clientPrefix: undefined,
      extends: [common],
      server: {},
      client: {},
      runtimeEnv: {},
      isServer: false,
    });

    expect(siteEnv.PUBLIC_URL).toBe("https://example.com");
  });
});
