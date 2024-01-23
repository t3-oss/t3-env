/// <reference types="bun-types" />
import { expect, test, describe } from "bun:test";

import { createEnv } from "../src";
import z from "zod";
import { expectTypeOf } from "expect-type";

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
