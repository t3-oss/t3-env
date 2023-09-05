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
      clientPrefix: "FOO_",
      server: {
        // @ts-expect-error - server should not have FOO_ prefix
        FOO_BAR: z.string(),
        BAR: z.string(),
      },
      client: {},
      runtimeEnv: {},
    });
  });
});

test("client vars should be correctly prefixed", () => {
  ignoreErrors(() => {
    createEnv({
      clientPrefix: "FOO_",
      server: {},
      client: {
        FOO_BAR: z.string(),
        // @ts-expect-error - no FOO_ prefix
        BAR: z.string(),
      },
      runtimeEnv: {},
    });
  });
});

test("runtimeEnvStrict enforces all keys", () => {
  createEnv({
    clientPrefix: "FOO_",
    server: {},
    client: {},
    runtimeEnvStrict: {},
  });

  createEnv({
    clientPrefix: "FOO_",
    server: {},
    client: { FOO_BAR: z.string() },
    runtimeEnvStrict: { FOO_BAR: "foo" },
  });

  createEnv({
    clientPrefix: "FOO_",
    server: { BAR: z.string() },
    client: {},
    runtimeEnvStrict: { BAR: "foo" },
  });

  createEnv({
    clientPrefix: "FOO_",
    server: { BAR: z.string() },
    client: { FOO_BAR: z.string() },
    runtimeEnvStrict: { BAR: "foo", FOO_BAR: "foo" },
  });

  createEnv({
    clientPrefix: "FOO_",
    server: {},
    client: { FOO_BAR: z.string() },
    runtimeEnvStrict: {
      FOO_BAR: "foo",
      // @ts-expect-error - FOO_BAZ is extraneous
      FOO_BAZ: "baz",
    },
  });

  ignoreErrors(() => {
    createEnv({
      clientPrefix: "FOO_",
      server: { BAR: z.string() },
      client: { FOO_BAR: z.string() },
      // @ts-expect-error - BAR is missing
      runtimeEnvStrict: {
        FOO_BAR: "foo",
      },
    });
  });
});

describe("return type is correctly inferred", () => {
  test("simple", () => {
    const env = createEnv({
      clientPrefix: "FOO_",
      server: { BAR: z.string() },
      client: { FOO_BAR: z.string() },
      runtimeEnvStrict: {
        BAR: "bar",
        FOO_BAR: "foo",
      },
    });

    expectTypeOf(env).toEqualTypeOf<
      Readonly<{
        BAR: string;
        FOO_BAR: string;
      }>
    >();

    expect(env).toMatchObject({
      BAR: "bar",
      FOO_BAR: "foo",
    });
  });

  test("with transforms", () => {
    const env = createEnv({
      clientPrefix: "FOO_",
      server: { BAR: z.string().transform(Number) },
      client: { FOO_BAR: z.string() },
      runtimeEnvStrict: {
        BAR: "123",
        FOO_BAR: "foo",
      },
    });

    expectTypeOf(env).toEqualTypeOf<
      Readonly<{
        BAR: number;
        FOO_BAR: string;
      }>
    >();

    expect(env).toMatchObject({
      BAR: 123,
      FOO_BAR: "foo",
    });
  });

  test("without client vars", () => {
    const env = createEnv({
      clientPrefix: "FOO_",
      server: { BAR: z.string() },
      client: {},
      runtimeEnvStrict: {
        BAR: "bar",
      },
    });

    expectTypeOf(env).toEqualTypeOf<
      Readonly<{
        BAR: string;
      }>
    >();

    expect(env).toMatchObject({
      BAR: "bar",
    });
  });
});

test("can pass number and booleans", () => {
  const env = createEnv({
    clientPrefix: "FOO_",
    server: {
      PORT: z.number(),
      IS_DEV: z.boolean(),
    },
    client: {},
    runtimeEnvStrict: {
      PORT: 123,
      IS_DEV: true,
    },
  });

  expectTypeOf(env).toEqualTypeOf<
    Readonly<{
      PORT: number;
      IS_DEV: boolean;
    }>
  >();

  expect(env).toMatchObject({
    PORT: 123,
    IS_DEV: true,
  });
});

describe("errors when validation fails", () => {
  test("envs are missing", () => {
    expect(() =>
      createEnv({
        clientPrefix: "FOO_",
        server: { BAR: z.string() },
        client: { FOO_BAR: z.string() },
        runtimeEnv: {},
      })
    ).toThrowErrorMatchingInlineSnapshot(`"Invalid environment variables"`);
  });

  test("envs are invalid", () => {
    expect(() =>
      createEnv({
        clientPrefix: "FOO_",
        server: { BAR: z.string().transform(Number).pipe(z.number()) },
        client: { FOO_BAR: z.string() },
        runtimeEnv: {
          BAR: "123abc",
          FOO_BAR: "foo",
        },
      })
    ).toThrowErrorMatchingInlineSnapshot(`"Invalid environment variables"`);
  });

  test("with custom error handler", () => {
    expect(() =>
      createEnv({
        clientPrefix: "FOO_",
        server: { BAR: z.string().transform(Number).pipe(z.number()) },
        client: { FOO_BAR: z.string() },
        runtimeEnv: {
          BAR: "123abc",
          FOO_BAR: "foo",
        },
        onValidationError: (err) => {
          const barError = err.flatten().fieldErrors["BAR"]?.[0] as string;
          throw new Error(`Invalid variable BAR: ${barError}`);
        },
      })
    ).toThrowErrorMatchingInlineSnapshot(`
      "Invalid variable BAR: Expected number, received nan"
    `);
  });
});

describe("errors when server var is accessed on client", () => {
  test("with default handler", () => {
    const env = createEnv({
      clientPrefix: "FOO_",
      server: { BAR: z.string() },
      client: { FOO_BAR: z.string() },
      runtimeEnvStrict: {
        BAR: "bar",
        FOO_BAR: "foo",
      },
      isServer: false,
    });

    expect(() => env.BAR).toThrowErrorMatchingInlineSnapshot(
      `"❌ Attempted to access a server-side environment variable on the client"`
    );
  });

  test("with custom handler", () => {
    const env = createEnv({
      clientPrefix: "FOO_",
      server: { BAR: z.string() },
      client: { FOO_BAR: z.string() },
      runtimeEnvStrict: {
        BAR: "bar",
        FOO_BAR: "foo",
      },
      isServer: false,
      onInvalidAccess: (key) => {
        throw new Error(`Attempted to access ${key} on the client`);
      },
    });

    expect(() => env.BAR).toThrowErrorMatchingInlineSnapshot(
      `"Attempted to access BAR on the client"`
    );
  });
});

describe("client/server only mode", () => {
  test("client only", () => {
    const env = createEnv({
      clientPrefix: "FOO_",
      client: {
        FOO_BAR: z.string(),
      },
      runtimeEnv: { FOO_BAR: "foo" },
    });

    expectTypeOf(env).toEqualTypeOf<Readonly<{ FOO_BAR: string }>>();
    expect(env).toMatchObject({ FOO_BAR: "foo" });
  });

  test("server only", () => {
    const env = createEnv({
      server: {
        BAR: z.string(),
      },
      runtimeEnv: { BAR: "bar" },
    });

    expectTypeOf(env).toEqualTypeOf<Readonly<{ BAR: string }>>();
    expect(env).toMatchObject({ BAR: "bar" });
  });

  test("config with missing client", () => {
    ignoreErrors(() => {
      createEnv(
        // @ts-expect-error - incomplete client config - client not present
        {
          clientPrefix: "FOO_",
          server: {},
          runtimeEnv: {},
        }
      );
    });
  });

  test("config with missing clientPrefix", () => {
    ignoreErrors(() => {
      // @ts-expect-error - incomplete client config - clientPrefix not present
      createEnv({
        client: {},
        server: {},
        runtimeEnv: {},
      });
    });
  });
});

describe("shared can be accessed on both server and client", () => {
  process.env = {
    NODE_ENV: "development",
    BAR: "bar",
    FOO_BAR: "foo",
  };

  const env = createEnv({
    shared: {
      NODE_ENV: z.enum(["development", "production", "test"]),
    },
    clientPrefix: "FOO_",
    server: { BAR: z.string() },
    client: { FOO_BAR: z.string() },
    runtimeEnv: process.env,
  });

  expectTypeOf(env).toEqualTypeOf<
    Readonly<{
      NODE_ENV: "development" | "production" | "test";
      BAR: string;
      FOO_BAR: string;
    }>
  >();

  test("server", () => {
    const { window } = globalThis;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    globalThis.window = undefined as any;

    expect(env).toMatchObject({
      NODE_ENV: "development",
      BAR: "bar",
      FOO_BAR: "foo",
    });

    globalThis.window = window;
  });

  test("client", () => {
    const { window } = globalThis;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    globalThis.window = {} as any;

    expect(env).toMatchObject({
      NODE_ENV: "development",
      FOO_BAR: "foo",
    });

    globalThis.window = window;
  });
});

test("envs are readonly", () => {
  const env = createEnv({
    server: { BAR: z.string() },
    runtimeEnv: { BAR: "bar" },
  });

  /**
   * We currently don't enforce readonly during runtime:
   * https://github.com/t3-oss/t3-env/pull/111#issuecomment-1682931526
   */

  // expect(() => {
  //   // @ts-expect-error - envs are readonly
  //   env.BAR = "foo";
  // }).toThrowErrorMatchingInlineSnapshot(
  //   '"Cannot assign to read only property BAR of object #<Object>"'
  // );

  // expect(env).toMatchObject({ BAR: "bar" });

  // @ts-expect-error - envs are readonly
  env.BAR = "foo";
  expect(env).toMatchObject({ BAR: "foo" });
});
