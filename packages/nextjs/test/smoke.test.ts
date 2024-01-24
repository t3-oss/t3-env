/// <reference types="bun" />
import { describe, expect, spyOn, test } from "bun:test";

import { expectTypeOf } from "expect-type";
import z from "zod";
import { createEnv } from "../src";

function ignoreErrors(cb: () => void) {
  try {
    cb();
  } catch (err) {
    // ignore
  }
}

test("server vars should not be prefixed", () => {
  ignoreErrors(() => {
    createEnv({
      server: {
        // @ts-expect-error - server should not have NEXT_PUBLIC_ prefix
        NEXT_PUBLIC_BAR: z.string(),
        BAR: z.string(),
      },
      client: {},
      runtimeEnv: {
        BAR: "foo",
      },
    });
  });
});

test("client vars should be correctly prefixed", () => {
  ignoreErrors(() => {
    createEnv({
      server: {},
      client: {
        NEXT_PUBLIC_BAR: z.string(),
        // @ts-expect-error - no NEXT_PUBLIC_ prefix
        BAR: z.string(),
      },
      runtimeEnv: {
        NEXT_PUBLIC_BAR: "foo",
      },
    });
  });
});

test("runtimeEnv enforces all keys", () => {
  createEnv({
    server: {},
    client: { NEXT_PUBLIC_BAR: z.string() },
    runtimeEnv: { NEXT_PUBLIC_BAR: "foo" },
  });

  createEnv({
    server: { BAR: z.string() },
    client: { NEXT_PUBLIC_BAR: z.string() },
    runtimeEnv: { BAR: "foo", NEXT_PUBLIC_BAR: "foo" },
  });

  createEnv({
    server: {},
    client: { NEXT_PUBLIC_BAR: z.string() },
    runtimeEnv: {
      NEXT_PUBLIC_BAR: "foo",
      // @ts-expect-error - FOO_BAZ is extraneous
      FOO_BAZ: "baz",
    },
  });

  ignoreErrors(() => {
    createEnv({
      server: { BAR: z.string() },
      client: { NEXT_PUBLIC_BAR: z.string() },
      // @ts-expect-error - BAR is missing
      runtimeEnvStrict: {
        NEXT_PUBLIC_BAR: "foo",
      },
    });
  });
});

test("new experimental runtime option only requires client vars", () => {
  ignoreErrors(() => {
    createEnv({
      server: { BAR: z.string() },
      client: { NEXT_PUBLIC_BAR: z.string() },
      // @ts-expect-error - NEXT_PUBLIC_BAR is missing
      experimental__runtimeEnv: {},
    });
    createEnv({
      server: { BAR: z.string() },
      client: { NEXT_PUBLIC_BAR: z.string() },
      experimental__runtimeEnv: {
        // @ts-expect-error - BAR should not be specified
        BAR: "bar",
      },
    });
  });

  process.env = {
    BAR: "bar",
    NEXT_PUBLIC_BAR: "foo",
    NODE_ENV: "development",
  };

  const env = createEnv({
    shared: {
      NODE_ENV: z.enum(["development", "production"]),
    },
    server: { BAR: z.string() },
    client: { NEXT_PUBLIC_BAR: z.string() },
    experimental__runtimeEnv: {
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_BAR: process.env.NEXT_PUBLIC_BAR,
    },
  });

  expectTypeOf(env).toEqualTypeOf<
    Readonly<{
      BAR: string;
      NEXT_PUBLIC_BAR: string;
      NODE_ENV: "development" | "production";
    }>
  >();

  expect(env).toMatchObject({
    BAR: "bar",
    NEXT_PUBLIC_BAR: "foo",
    NODE_ENV: "development",
  });
});

describe("return type is correctly inferred", () => {
  test("simple", () => {
    const env = createEnv({
      server: { BAR: z.string() },
      client: { NEXT_PUBLIC_BAR: z.string() },
      runtimeEnv: {
        BAR: "bar",
        NEXT_PUBLIC_BAR: "foo",
      },
    });

    expectTypeOf(env).toEqualTypeOf<
      Readonly<{
        BAR: string;
        NEXT_PUBLIC_BAR: string;
      }>
    >();

    expect(env).toMatchObject({
      BAR: "bar",
      NEXT_PUBLIC_BAR: "foo",
    });
  });

  test("with transforms", () => {
    const env = createEnv({
      server: { BAR: z.string().transform(Number) },
      client: { NEXT_PUBLIC_BAR: z.string() },
      runtimeEnv: {
        BAR: "123",
        NEXT_PUBLIC_BAR: "foo",
      },
    });

    expectTypeOf(env).toEqualTypeOf<
      Readonly<{
        BAR: number;
        NEXT_PUBLIC_BAR: string;
      }>
    >();

    expect(env).toMatchObject({
      BAR: 123,
      NEXT_PUBLIC_BAR: "foo",
    });
  });
});

test("can specify only server", () => {
  const onlyServer = createEnv({
    server: { BAR: z.string() },
    runtimeEnv: { BAR: "FOO" },
  });

  expectTypeOf(onlyServer).toMatchTypeOf<{
    BAR: string;
  }>();

  expect(onlyServer).toMatchObject({
    BAR: "FOO",
  });
});

test("can specify only client", () => {
  const onlyClient = createEnv({
    client: { NEXT_PUBLIC_BAR: z.string() },
    runtimeEnv: { NEXT_PUBLIC_BAR: "FOO" },
  });

  expectTypeOf(onlyClient).toMatchTypeOf<{
    NEXT_PUBLIC_BAR: string;
  }>();

  expect(onlyClient).toMatchObject({
    NEXT_PUBLIC_BAR: "FOO",
  });
});

describe("extending presets", () => {
  test("with invalid runtime envs", () => {
    const processEnv = {
      SERVER_ENV: "server",
      NEXT_PUBLIC_ENV: "client",
    };

    function lazyCreateEnv() {
      const preset = createEnv({
        server: {
          PRESET_ENV: z.string(),
        },
        experimental__runtimeEnv: processEnv,
      });

      return createEnv({
        server: {
          SERVER_ENV: z.string(),
        },
        client: {
          NEXT_PUBLIC_ENV: z.string(),
        },
        extends: [preset],
        runtimeEnv: processEnv,
      });
    }

    expectTypeOf(lazyCreateEnv).returns.toEqualTypeOf<
      Readonly<{
        SERVER_ENV: string;
        NEXT_PUBLIC_ENV: string;
        PRESET_ENV: string;
      }>
    >();

    const consoleError = spyOn(console, "error");
    expect(() => lazyCreateEnv()).toThrow("Invalid environment variables");
    expect(consoleError.mock.calls[0]).toEqual([
      "❌ Invalid environment variables:",
      { PRESET_ENV: ["Required"] },
    ]);
  });
  describe("single preset", () => {
    const processEnv = {
      PRESET_ENV: "preset",
      SHARED_ENV: "shared",
      SERVER_ENV: "server",
      NEXT_PUBLIC_ENV: "client",
    };

    function lazyCreateEnv() {
      const preset = createEnv({
        server: {
          PRESET_ENV: z.enum(["preset"]),
        },
        runtimeEnv: processEnv,
      });

      return createEnv({
        server: {
          SERVER_ENV: z.string(),
        },
        shared: {
          SHARED_ENV: z.string(),
        },
        client: {
          NEXT_PUBLIC_ENV: z.string(),
        },
        extends: [preset],
        runtimeEnv: processEnv,
      });
    }

    expectTypeOf(lazyCreateEnv).returns.toEqualTypeOf<
      Readonly<{
        SERVER_ENV: string;
        SHARED_ENV: string;
        NEXT_PUBLIC_ENV: string;
        PRESET_ENV: "preset";
      }>
    >();

    test("server", () => {
      const { window } = globalThis;
      globalThis.window = undefined as any;

      const env = lazyCreateEnv();

      expect(env).toMatchObject({
        SERVER_ENV: "server",
        SHARED_ENV: "shared",
        NEXT_PUBLIC_ENV: "client",
        PRESET_ENV: "preset",
      });

      globalThis.window = window;
    });

    test("client", () => {
      const { window } = globalThis;
      globalThis.window = {} as any;

      const env = lazyCreateEnv();

      expect(() => env.SERVER_ENV).toThrow(
        "❌ Attempted to access a server-side environment variable on the client",
      );
      expect(() => env.PRESET_ENV).toThrow(
        "❌ Attempted to access a server-side environment variable on the client",
      );
      expect(env.SHARED_ENV).toBe("shared");
      expect(env.NEXT_PUBLIC_ENV).toBe("client");

      globalThis.window = window;
    });
  });
});
