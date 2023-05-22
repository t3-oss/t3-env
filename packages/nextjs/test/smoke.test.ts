import { expect, expectTypeOf, test, describe } from "vitest";

import { createEnv } from "..";
import z from "zod";

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

    expectTypeOf(env).toEqualTypeOf<{
      BAR: string;
      NEXT_PUBLIC_BAR: string;
    }>();

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

    expectTypeOf(env).toEqualTypeOf<{
      BAR: number;
      NEXT_PUBLIC_BAR: string;
    }>();

    expect(env).toMatchObject({
      BAR: 123,
      NEXT_PUBLIC_BAR: "foo",
    });
  });
});
