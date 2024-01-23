/// <reference types="bun-types" />
import { expect, test, describe } from "bun:test";
import { expectTypeOf } from "expect-type";

import { createEnv } from "../src/index.js";
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
    createEnv({
      clientPrefix: undefined,
      server: {},
      // @ts-expect-error - clientPrefix is required
      client: {
        BAR: z.string(),
      },
      runtimeEnv: {},
    });
    createEnv({
      clientPrefix: "",
      server: {},
      // @ts-expect-error - clientPrefix should not be empty
      client: {
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

  const baseEnv = createEnv({
    clientPrefix: "FOO_",
    server: { BAR: z.string() },
    client: { FOO_BAR: z.string() },
    runtimeEnvStrict: { BAR: "foo", FOO_BAR: "foo" },
  });

  createEnv({
    server: { QUX: z.string() },
    client: { FOO_QUX: z.string() },
    runtimeEnvStrict: { QUX: "foo", FOO_QUX: "foo" },
    clientPrefix: "FOO_",
    extends: baseEnv,
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

  createEnv({
    server: { QUX: z.string() },
    client: { FOO_QUX: z.string() },
    runtimeEnvStrict: {
      QUX: "foo",
      FOO_QUX: "foo",
      // @ts-expect-error - FOO_BAZ is extraneous
      FOO_BAZ: "baz",
    },
    clientPrefix: "FOO_",
    extends: baseEnv,
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

  ignoreErrors(() => {
    createEnv({
      clientPrefix: "FOO_",
      server: { QUX: z.string() },
      client: { FOO_QUX: z.string() },
      // @ts-expect-error - BAR is missing
      runtimeEnvStrict: {
        FOO_QUX: "foo",
      },
      extends: baseEnv,
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
    ).toThrow("Invalid environment variables");
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
    ).toThrow("Invalid environment variables");
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
    ).toThrow("Invalid variable BAR: Expected number, received nan");
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

    expect(() => env.BAR).toThrow(
      "❌ Attempted to access a server-side environment variable on the client"
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

    expect(() => env.BAR).toThrow("Attempted to access BAR on the client");
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

  test("client only (extended env)", () => {
    const baseEnv = createEnv({
      clientPrefix: "FOO_",
      client: {
        FOO_BAR: z.string(),
      },
      runtimeEnv: { FOO_BAR: "foo" },
    });

    const env = createEnv({
      clientPrefix: "FOO_",
      client: {
        FOO_BAZ: z.string(),
      },
      runtimeEnv: { FOO_BAZ: "foo" },
      extends: baseEnv,
    });

    expectTypeOf(env).toEqualTypeOf<
      Readonly<{
        FOO_BAR: string;
        FOO_BAZ: string;
      }>
    >();

    expect(env).toMatchObject({
      FOO_BAR: "foo",
      FOO_BAZ: "foo",
    });
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

  test("server only (extended env)", () => {
    const baseEnv = createEnv({
      server: {
        BAR: z.string(),
      },
      runtimeEnv: { BAR: "bar" },
    });

    const env = createEnv({
      server: {
        BAZ: z.string(),
      },
      runtimeEnv: { BAZ: "baz" },
      extends: baseEnv,
    });

    expectTypeOf(env).toEqualTypeOf<
      Readonly<{
        BAR: string;
        BAZ: string;
      }>
    >();

    expect(env).toMatchObject({
      BAR: "bar",
      BAZ: "baz",
    });
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

  test("config with missing client (extended env)", () => {
    const baseEnv = createEnv({
      clientPrefix: "FOO_",
      client: {
        FOO_BAR: z.string(),
      },
      runtimeEnv: { FOO_BAR: "foo" },
    });
    ignoreErrors(() => {
      createEnv(
        // @ts-expect-error - incomplete client config - client not present
        {
          clientPrefix: "FOO_",
          server: {},
          runtimeEnv: {},
          extends: baseEnv,
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

  test("config with missing clientPrefix (extended env)", () => {
    const baseEnv = createEnv({
      clientPrefix: "FOO_",
      client: {
        FOO_BAR: z.string(),
      },
      runtimeEnv: { FOO_BAR: "foo" },
    });
    ignoreErrors(() => {
      // @ts-expect-error - incomplete client config - clientPrefix not present
      createEnv({
        client: {},
        server: {},
        runtimeEnv: {},
        extends: baseEnv,
      });
    });
  });
});

describe("shared can be accessed on both server and client", () => {
  const lazyCreateEnv = () =>
    createEnv({
      shared: {
        NODE_ENV: z.enum(["development", "production", "test"]),
      },
      clientPrefix: "FOO_",
      server: { BAR: z.string() },
      client: { FOO_BAR: z.string() },
      runtimeEnv: {
        NODE_ENV: "development",
        BAR: "bar",
        FOO_BAR: "foo",
      },
    });

  expectTypeOf(lazyCreateEnv).returns.toEqualTypeOf<
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

    const env = lazyCreateEnv();

    expect(env).toEqual({
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

    const env = lazyCreateEnv();

    expect(env).toEqual({
      NODE_ENV: "development",
      BAR: "bar",
      FOO_BAR: "foo",
    });
    expect(() => env.BAR).toThrow(
      "❌ Attempted to access a server-side environment variable on the client"
    );
    expect(env.FOO_BAR).toBe("foo");
    expect(env.NODE_ENV).toBe("development");

    globalThis.window = window;
  });
});

describe("shared can be accessed on both server and client (extended env)", () => {
  const runtimeEnv = {
    NODE_ENV: "development",
    DEBUG: "false",
    BAR: "bar",
    FOO_BAR: "foo",
    BAZ: "bar",
    FOO_BAZ: "foo",
  };

  function lazyCreateEnv() {
    const baseEnv = createEnv({
      shared: {
        NODE_ENV: z.enum(["development", "production", "test"]),
      },
      clientPrefix: "FOO_",
      server: { BAR: z.string() },
      client: { FOO_BAR: z.string() },
      runtimeEnv,
    });

    return createEnv({
      shared: {
        DEBUG: z.enum(["true", "false"]).transform((val) => val === "true"),
      },
      clientPrefix: "FOO_",
      server: { BAZ: z.string() },
      client: { FOO_BAZ: z.string() },
      extends: baseEnv,
      runtimeEnv,
    });
  }

  expectTypeOf(lazyCreateEnv).returns.toEqualTypeOf<
    Readonly<{
      DEBUG: boolean;
      NODE_ENV: "development" | "production" | "test";
      BAR: string;
      FOO_BAR: string;
      BAZ: string;
      FOO_BAZ: string;
    }>
  >();

  test("server", () => {
    const { window } = globalThis;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    globalThis.window = undefined as any;

    const env = lazyCreateEnv();

    expect(env).toEqual({
      DEBUG: false,
      NODE_ENV: "development",
      BAR: "bar",
      FOO_BAR: "foo",
      BAZ: "bar",
      FOO_BAZ: "foo",
    });

    globalThis.window = window;
  });

  test("client", () => {
    const { window } = globalThis;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    globalThis.window = {} as any;

    const env = lazyCreateEnv();

    expect(env).toEqual({
      DEBUG: false,
      NODE_ENV: "development",
      FOO_BAR: "foo",
      FOO_BAZ: "foo",
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
  // }).toThrow(
  //   '"Cannot assign to read only property BAR of object #<Object>"'
  // );

  // expect(env).toMatchObject({ BAR: "bar" });

  // @ts-expect-error - envs are readonly
  env.BAR = "foo";
  expect(env).toMatchObject({ BAR: "foo" });
});

describe("Object.keys, Object.entries, Object.values, Reflect.ownKeys, spread, for...in", () => {
  const lazyCreateEnv = () =>
    createEnv({
      shared: {
        NODE_ENV: z.enum(["development", "production", "test"]),
      },
      clientPrefix: "FOO_",
      server: { BAR: z.string() },
      client: { FOO_BAR: z.string() },
      runtimeEnv: {
        NODE_ENV: "development",
        BAR: "bar",
        FOO_BAR: "foo",
      },
    });

  test("server", () => {
    const { window } = globalThis;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    globalThis.window = undefined as any;

    const env = lazyCreateEnv();

    expect(Object.keys(env).sort()).toEqual(["BAR", "FOO_BAR", "NODE_ENV"]);
    expect(Object.values(env).sort()).toEqual(["bar", "development", "foo"]);
    expect(Object.entries(env).sort()).toEqual([
      ["BAR", "bar"],
      ["FOO_BAR", "foo"],
      ["NODE_ENV", "development"],
    ]);
    expect(Object.getOwnPropertyNames(env).sort()).toEqual([
      "BAR",
      "FOO_BAR",
      "NODE_ENV",
    ]);
    expect(Reflect.ownKeys(env).sort()).toEqual(["BAR", "FOO_BAR", "NODE_ENV"]);
    const keys: string[] = [];
    for (const key in env) {
      keys.push(key);
    }
    expect(keys.sort()).toEqual(["BAR", "FOO_BAR", "NODE_ENV"]);
    expect({ ...env }).toEqual({
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

    const env = lazyCreateEnv();

    expect(Object.keys(env).sort()).toEqual(["FOO_BAR", "NODE_ENV"]);
    expect(Object.values(env).sort()).toEqual(["development", "foo"]);
    expect(Object.entries(env).sort()).toEqual([
      ["FOO_BAR", "foo"],
      ["NODE_ENV", "development"],
    ]);
    expect(Object.getOwnPropertyNames(env).sort()).toEqual([
      "FOO_BAR",
      "NODE_ENV",
    ]);
    expect(Reflect.ownKeys(env).sort()).toEqual(["FOO_BAR", "NODE_ENV"]);
    const keys: string[] = [];
    for (const key in env) {
      keys.push(key);
    }
    expect(keys.sort()).toEqual(["FOO_BAR", "NODE_ENV"]);
    expect({ ...env }).toEqual({
      NODE_ENV: "development",
      FOO_BAR: "foo",
    });

    globalThis.window = window;
  });
});

describe("Object.keys, Object.entries, Object.values, Reflect.ownKeys, spread, for...in (extended env)", () => {
  const runtimeEnv = {
    NODE_ENV: "development",
    DEBUG: "false",
    BAR: "bar",
    FOO_BAR: "foo",
    BAZ: "bar",
    FOO_BAZ: "foo",
  };

  const lazyCreateEnv = () => {
    const baseEnv = createEnv({
      shared: {
        NODE_ENV: z.enum(["development", "production", "test"]),
      },
      clientPrefix: "FOO_",
      server: { BAR: z.string() },
      client: { FOO_BAR: z.string() },
      runtimeEnv,
    });

    return createEnv({
      shared: {
        DEBUG: z.enum(["true", "false"]).transform((val) => val === "true"),
      },
      clientPrefix: "FOO_",
      server: { BAZ: z.string() },
      client: { FOO_BAZ: z.string() },
      extends: baseEnv,
      runtimeEnv,
    });
  };

  test("server", () => {
    const { window } = globalThis;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    globalThis.window = undefined as any;

    const env = lazyCreateEnv();

    expect(Object.keys(env).sort()).toEqual([
      "BAR",
      "BAZ",
      "DEBUG",
      "FOO_BAR",
      "FOO_BAZ",
      "NODE_ENV",
    ]);
    expect(Object.values(env).sort()).toEqual([
      "bar",
      "bar",
      "development",
      false,
      "foo",
      "foo",
    ]);
    expect(Object.entries(env).sort()).toEqual([
      ["BAR", "bar"],
      ["BAZ", "bar"],
      ["DEBUG", false],
      ["FOO_BAR", "foo"],
      ["FOO_BAZ", "foo"],
      ["NODE_ENV", "development"],
    ]);
    expect(Object.getOwnPropertyNames(env).sort()).toEqual([
      "BAR",
      "BAZ",
      "DEBUG",
      "FOO_BAR",
      "FOO_BAZ",
      "NODE_ENV",
    ]);
    expect(Reflect.ownKeys(env).sort()).toEqual([
      "BAR",
      "BAZ",
      "DEBUG",
      "FOO_BAR",
      "FOO_BAZ",
      "NODE_ENV",
    ]);
    const keys: string[] = [];
    for (const key in env) {
      keys.push(key);
    }
    expect(keys.sort()).toEqual([
      "BAR",
      "BAZ",
      "DEBUG",
      "FOO_BAR",
      "FOO_BAZ",
      "NODE_ENV",
    ]);
    expect({ ...env }).toEqual({
      DEBUG: false,
      NODE_ENV: "development",
      BAR: "bar",
      BAZ: "bar",
      FOO_BAR: "foo",
      FOO_BAZ: "foo",
    });

    globalThis.window = window;
  });

  test("client", () => {
    const { window } = globalThis;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    globalThis.window = {} as any;

    const env = lazyCreateEnv();

    expect(Object.keys(env).sort()).toEqual([
      "DEBUG",
      "FOO_BAR",
      "FOO_BAZ",
      "NODE_ENV",
    ]);
    expect(Object.values(env).sort()).toEqual([
      "development",
      false,
      "foo",
      "foo",
    ]);
    expect(Object.entries(env).sort()).toEqual([
      ["DEBUG", false],
      ["FOO_BAR", "foo"],
      ["FOO_BAZ", "foo"],
      ["NODE_ENV", "development"],
    ]);
    expect(Object.getOwnPropertyNames(env).sort()).toEqual([
      "DEBUG",
      "FOO_BAR",
      "FOO_BAZ",
      "NODE_ENV",
    ]);
    expect(Reflect.ownKeys(env).sort()).toEqual([
      "DEBUG",
      "FOO_BAR",
      "FOO_BAZ",
      "NODE_ENV",
    ]);
    const keys: string[] = [];
    for (const key in env) {
      keys.push(key);
    }
    expect(keys.sort()).toEqual(["DEBUG", "FOO_BAR", "FOO_BAZ", "NODE_ENV"]);
    expect({ ...env }).toEqual({
      DEBUG: false,
      NODE_ENV: "development",
      FOO_BAR: "foo",
      FOO_BAZ: "foo",
    });

    globalThis.window = window;
  });
});

describe("extending envs", () => {
  test("simple", () => {
    const env1 = createEnv({
      server: { BAR: z.string() },
      runtimeEnv: { BAR: "bar" },
    });

    const env2 = createEnv({
      server: { FOO: z.string() },
      runtimeEnv: { FOO: "foo" },
      extends: env1,
    });

    expectTypeOf(env2).toEqualTypeOf<
      Readonly<{
        BAR: string;
        FOO: string;
      }>
    >();

    expect(env2).toMatchObject({
      BAR: "bar",
      FOO: "foo",
    });

    expect(env2.BAR).toBe("bar");
    expect(env2.FOO).toBe("foo");

    expect(env1.BAR).toBe("bar");
    // @ts-expect-error - FOO is not present on env1
    expect(env1.FOO).toBe(undefined);
  });

  test("multiple levels of extends", () => {
    const env1 = createEnv({
      server: { BAR: z.string() },
      runtimeEnv: { BAR: "bar" },
    });

    const env2 = createEnv({
      server: { FOO: z.string() },
      runtimeEnv: { FOO: "foo" },
      extends: env1,
    });

    const env3 = createEnv({
      server: { BAZ: z.string() },
      runtimeEnv: { BAZ: "baz" },
      extends: env2,
    });

    expectTypeOf(env3).toEqualTypeOf<
      Readonly<{
        BAR: string;
        FOO: string;
        BAZ: string;
      }>
    >();

    expect(env1).toEqual({
      BAR: "bar",
    });

    expect(env2).toEqual({
      BAR: "bar",
      FOO: "foo",
    });

    expect(env3).toEqual({
      BAR: "bar",
      FOO: "foo",
      BAZ: "baz",
    });
  });

  test("is an error to duplicate keys from the extended env", () => {
    const env1 = createEnv({
      server: { BAR: z.string() },
      client: { FOO_BAR: z.string() },
      runtimeEnv: { BAR: "bar", FOO_BAR: "foo" },
      clientPrefix: "FOO_",
    });

    expect(() => {
      createEnv({
        // @ts-expect-error - duplicate key
        server: { BAR: z.string() },
        runtimeEnv: { BAR: "bar" },
        extends: env1,
      });
    }).toThrowErrorMatchingInlineSnapshot(
      `"Cannot extend env with duplicate keys: BAR"`
    );

    expect(() => {
      createEnv({
        // @ts-expect-error - duplicate key
        client: { FOO_BAR: z.string() },
        runtimeEnv: { FOO_BAR: "foo" },
        clientPrefix: "FOO_",
        extends: env1,
      });
    }).toThrowErrorMatchingInlineSnapshot(
      `"Cannot extend env with duplicate keys: FOO_BAR"`
    );

    expect(() => {
      createEnv({
        // @ts-expect-error - duplicate key
        shared: { BAR: z.string() },
        runtimeEnv: { BAR: "bar" },
        extends: env1,
      });
    }).toThrowErrorMatchingInlineSnapshot(
      `"Cannot extend env with duplicate keys: BAR"`
    );
  });

  test("cannot access server vars from extended env on client", () => {
    const env1 = createEnv({
      clientPrefix: "FOO_",
      server: { BAR: z.string() },
      client: { FOO_BAR: z.string() },
      runtimeEnvStrict: {
        BAR: "bar",
        FOO_BAR: "foo",
      },
      isServer: false,
    });

    const env2 = createEnv({
      clientPrefix: "FOO_",
      server: { BAZ: z.string() },
      client: { FOO_BAZ: z.string() },
      runtimeEnvStrict: {
        BAZ: "baz",
        FOO_BAZ: "baz",
      },
      isServer: false,
      extends: env1,
    });

    expect(() => env2.BAR).toThrowErrorMatchingInlineSnapshot(
      `"❌ Attempted to access a server-side environment variable on the client"`
    );

    expect(() => {
      env2.BAR;
    }).toThrowErrorMatchingInlineSnapshot(
      `"❌ Attempted to access a server-side environment variable on the client"`
    );

    expect(() => {
      env2.BAZ;
    }).toThrowErrorMatchingInlineSnapshot(
      `"❌ Attempted to access a server-side environment variable on the client"`
    );
  });

  test("can access client and shared vars from extended env on client", () => {
    const env1 = createEnv({
      clientPrefix: "FOO_",
      shared: { NODE_ENV: z.enum(["development", "production", "test"]) },
      server: { BAR: z.string() },
      client: { FOO_BAR: z.string() },
      runtimeEnvStrict: {
        NODE_ENV: "development",
        BAR: "bar",
        FOO_BAR: "foo",
      },
      isServer: false,
    });

    expect(env1).toEqual({
      NODE_ENV: "development",
      FOO_BAR: "foo",
    });

    const env2 = createEnv({
      clientPrefix: "FOO_",
      shared: {
        DEBUG: z.enum(["true", "false"]).transform((val) => val === "true"),
      },
      server: { BAZ: z.string() },
      client: { FOO_BAZ: z.string() },
      runtimeEnvStrict: {
        DEBUG: "false",
        BAZ: "baz",
        FOO_BAZ: "baz",
      },
      isServer: false,
      extends: env1,
    });

    expect(env2).toEqual({
      NODE_ENV: "development",
      DEBUG: false,
      FOO_BAR: "foo",
      FOO_BAZ: "baz",
    });

    expect(env2.NODE_ENV).toBe("development");
    expect(env2.DEBUG).toBe(false);
    expect(env2.FOO_BAR).toBe("foo");
    expect(env2.FOO_BAZ).toBe("baz");
    expect(() => env2.BAR).toThrowErrorMatchingInlineSnapshot(
      '"❌ Attempted to access a server-side environment variable on the client"'
    );
    expect(() => env2.BAZ).toThrowErrorMatchingInlineSnapshot(
      '"❌ Attempted to access a server-side environment variable on the client"'
    );
  });

  test("can access client, server, and shared vars from extended env on server", () => {
    const env1 = createEnv({
      clientPrefix: "FOO_",
      shared: { NODE_ENV: z.enum(["development", "production", "test"]) },
      server: { BAR: z.string() },
      client: { FOO_BAR: z.string() },
      runtimeEnvStrict: {
        NODE_ENV: "development",
        BAR: "bar",
        FOO_BAR: "foo",
      },
      isServer: true,
    });

    const env2 = createEnv({
      clientPrefix: "FOO_",
      shared: {
        DEBUG: z.enum(["true", "false"]).transform((val) => val === "true"),
      },
      server: { BAZ: z.string() },
      client: { FOO_BAZ: z.string() },
      runtimeEnvStrict: {
        DEBUG: "false",
        BAZ: "baz",
        FOO_BAZ: "baz",
      },
      isServer: true,
      extends: env1,
    });

    expect(env2.NODE_ENV).toBe("development");
    expect(env2.DEBUG).toBe(false);
    expect(env2.BAR).toBe("bar");
    expect(env2.BAZ).toBe("baz");
    expect(env2.FOO_BAR).toBe("foo");
    expect(env2.FOO_BAZ).toBe("baz");
  });
});
