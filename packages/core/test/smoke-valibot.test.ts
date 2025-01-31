/// <reference types="bun" />
import { describe, expect, spyOn, test } from "bun:test";
import { expectTypeOf } from "expect-type";

import * as v from "valibot";
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
      clientPrefix: "FOO_",
      server: {
        // @ts-expect-error - server should not have FOO_ prefix
        FOO_BAR: v.string(),
        BAR: v.string(),
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
        FOO_BAR: v.string(),
        // @ts-expect-error - no FOO_ prefix
        BAR: v.string(),
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
    client: { FOO_BAR: v.string() },
    runtimeEnvStrict: { FOO_BAR: "foo" },
  });

  createEnv({
    clientPrefix: "FOO_",
    server: { BAR: v.string() },
    client: {},
    runtimeEnvStrict: { BAR: "foo" },
  });

  createEnv({
    clientPrefix: "FOO_",
    server: { BAR: v.string() },
    client: { FOO_BAR: v.string() },
    runtimeEnvStrict: { BAR: "foo", FOO_BAR: "foo" },
  });

  createEnv({
    clientPrefix: "FOO_",
    server: {},
    client: { FOO_BAR: v.string() },
    runtimeEnvStrict: {
      FOO_BAR: "foo",
      // @ts-expect-error - FOO_BAZ is extraneous
      FOO_BAZ: "baz",
    },
  });

  ignoreErrors(() => {
    createEnv({
      clientPrefix: "FOO_",
      server: { BAR: v.string() },
      client: { FOO_BAR: v.string() },
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
      server: { BAR: v.string() },
      client: { FOO_BAR: v.string() },
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
      server: { BAR: v.pipe(v.string(), v.transform(Number)) },
      client: { FOO_BAR: v.string() },
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
      server: { BAR: v.string() },
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
      PORT: v.number(),
      IS_DEV: v.boolean(),
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
        server: { BAR: v.string() },
        client: { FOO_BAR: v.string() },
        runtimeEnv: {},
      }),
    ).toThrow("Invalid environment variables");
  });

  test("envs are invalid", () => {
    expect(() =>
      createEnv({
        clientPrefix: "FOO_",
        server: { BAR: v.pipe(v.string(), v.transform(Number), v.number()) },
        client: { FOO_BAR: v.string() },
        runtimeEnv: {
          BAR: "123abc",
          FOO_BAR: "foo",
        },
      }),
    ).toThrow("Invalid environment variables");
  });

  test("with custom error handler", () => {
    expect(() =>
      createEnv({
        clientPrefix: "FOO_",
        server: { BAR: v.pipe(v.string(), v.transform(Number), v.number()) },
        client: { FOO_BAR: v.string() },
        runtimeEnv: {
          BAR: "123abc",
          FOO_BAR: "foo",
        },
        onValidationError: (issues) => {
          const barError = issues.find(
            (issue) => issue.path?.[0] === "BAR",
          )?.message;
          throw new Error(`Invalid variable BAR: ${barError}`);
        },
      }),
    ).toThrow(
      "Invalid variable BAR: Invalid type: Expected number but received NaN",
    );
  });
});

describe("errors when server var is accessed on client", () => {
  test("with default handler", () => {
    const env = createEnv({
      clientPrefix: "FOO_",
      server: { BAR: v.string() },
      client: { FOO_BAR: v.string() },
      runtimeEnvStrict: {
        BAR: "bar",
        FOO_BAR: "foo",
      },
      isServer: false,
    });

    expect(() => env.BAR).toThrow(
      "❌ Attempted to access a server-side environment variable on the client",
    );
  });

  test("with custom handler", () => {
    const env = createEnv({
      clientPrefix: "FOO_",
      server: { BAR: v.string() },
      client: { FOO_BAR: v.string() },
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
        FOO_BAR: v.string(),
      },
      runtimeEnv: { FOO_BAR: "foo" },
    });

    expectTypeOf(env).toEqualTypeOf<Readonly<{ FOO_BAR: string }>>();
    expect(env).toMatchObject({ FOO_BAR: "foo" });
  });

  test("server only", () => {
    const env = createEnv({
      server: {
        BAR: v.string(),
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
        },
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

  function lazyCreateEnv() {
    return createEnv({
      shared: {
        NODE_ENV: v.picklist(["development", "production", "test"]),
      },
      clientPrefix: "FOO_",
      server: { BAR: v.string() },
      client: { FOO_BAR: v.string() },
      runtimeEnv: process.env,
    });
  }

  expectTypeOf(lazyCreateEnv).returns.toEqualTypeOf<
    Readonly<{
      NODE_ENV: "development" | "production" | "test";
      BAR: string;
      FOO_BAR: string;
    }>
  >();

  test("server", () => {
    const { window } = globalThis;

    globalThis.window = undefined as any;

    const env = lazyCreateEnv();

    expect(env).toMatchObject({
      NODE_ENV: "development",
      BAR: "bar",
      FOO_BAR: "foo",
    });

    globalThis.window = window;
  });

  test("client", () => {
    const { window } = globalThis;

    globalThis.window = {} as any;

    const env = lazyCreateEnv();

    expect(() => env.BAR).toThrow(
      "❌ Attempted to access a server-side environment variable on the client",
    );
    expect(env.FOO_BAR).toBe("foo");
    expect(env.NODE_ENV).toBe("development");

    globalThis.window = window;
  });
});

test("envs are readonly", () => {
  const env = createEnv({
    server: { BAR: v.string() },
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

describe("extending presets", () => {
  test("with invalid runtime envs", () => {
    const processEnv = {
      SERVER_ENV: "server",
      CLIENT_ENV: "client",
    };

    function lazyCreateEnv() {
      const preset = createEnv({
        server: {
          PRESET_ENV: v.string(),
        },
        runtimeEnv: processEnv,
      });

      return createEnv({
        server: {
          SERVER_ENV: v.string(),
        },
        clientPrefix: "CLIENT_",
        client: {
          CLIENT_ENV: v.string(),
        },
        extends: [preset],
        runtimeEnv: processEnv,
      });
    }

    expectTypeOf(lazyCreateEnv).returns.toEqualTypeOf<
      Readonly<{
        SERVER_ENV: string;
        CLIENT_ENV: string;
        PRESET_ENV: string;
      }>
    >();

    const consoleError = spyOn(console, "error");
    expect(() => lazyCreateEnv()).toThrow("Invalid environment variables");
    expect(consoleError.mock.calls[0]).toEqual([
      "❌ Invalid environment variables:",
      [
        expect.objectContaining({
          message: expect.any(String),
          path: ["PRESET_ENV"],
        }),
      ],
    ]);
  });
  describe("single preset", () => {
    const processEnv = {
      PRESET_SERVER_ENV: "server_preset",
      PRESET_SHARED_ENV: "shared_preset",
      PRESET_CLIENT_ENV: "client_preset",
      SHARED_ENV: "shared",
      SERVER_ENV: "server",
      CLIENT_ENV: "client",
    };

    function lazyCreateEnv() {
      const preset = createEnv({
        server: {
          PRESET_SERVER_ENV: v.literal("server_preset"),
        },
        clientPrefix: "PRESET_CLIENT_",
        shared: {
          PRESET_SHARED_ENV: v.string(),
        },
        client: {
          PRESET_CLIENT_ENV: v.string(),
        },
        onInvalidAccess(variable) {
          throw new Error(
            `Attempted to access preset variable ${variable} on the client`,
          );
        },
        runtimeEnv: processEnv,
      });

      return createEnv({
        server: {
          SERVER_ENV: v.string(),
        },
        shared: {
          SHARED_ENV: v.string(),
        },
        clientPrefix: "CLIENT_",
        client: {
          CLIENT_ENV: v.string(),
        },
        onInvalidAccess(variable) {
          throw new Error(
            `Attempted to access variable ${variable} on the client`,
          );
        },
        extends: [preset],
        runtimeEnv: processEnv,
      });
    }

    expectTypeOf(lazyCreateEnv).returns.toEqualTypeOf<
      Readonly<{
        SERVER_ENV: string;
        SHARED_ENV: string;
        CLIENT_ENV: string;
        PRESET_SERVER_ENV: "server_preset";
        PRESET_SHARED_ENV: string;
        PRESET_CLIENT_ENV: string;
      }>
    >();

    test("server", () => {
      const { window } = globalThis;
      globalThis.window = undefined as any;

      const env = lazyCreateEnv();

      expect(env).toMatchObject({
        SERVER_ENV: "server",
        SHARED_ENV: "shared",
        CLIENT_ENV: "client",
        PRESET_SERVER_ENV: "server_preset",
        PRESET_SHARED_ENV: "shared_preset",
        PRESET_CLIENT_ENV: "client_preset",
      });

      globalThis.window = window;
    });

    test("client", () => {
      const { window } = globalThis;
      globalThis.window = {} as any;

      const env = lazyCreateEnv();

      expect(() => env.SERVER_ENV).toThrow(
        "Attempted to access variable SERVER_ENV on the client",
      );
      expect(() => env.PRESET_SERVER_ENV).toThrow(
        "Attempted to access preset variable PRESET_SERVER_ENV on the client",
      );
      expect(env.SHARED_ENV).toBe("shared");
      expect(env.CLIENT_ENV).toBe("client");
      expect(env.PRESET_SHARED_ENV).toBe("shared_preset");
      expect(env.PRESET_CLIENT_ENV).toBe("client_preset");

      globalThis.window = window;
    });
  });

  describe("multiple presets", () => {
    const processEnv = {
      PRESET_ENV1: "preset",
      PRESET_ENV2: 123,
      SHARED_ENV: "shared",
      SERVER_ENV: "server",
      CLIENT_ENV: "client",
    };

    function lazyCreateEnv() {
      const preset1 = createEnv({
        server: {
          PRESET_ENV1: v.picklist(["preset"]),
        },
        runtimeEnv: processEnv,
      });

      const preset2 = createEnv({
        server: {
          PRESET_ENV2: v.number(),
        },
        runtimeEnv: processEnv,
      });

      return createEnv({
        server: {
          SERVER_ENV: v.string(),
        },
        shared: {
          SHARED_ENV: v.string(),
        },
        clientPrefix: "CLIENT_",
        client: {
          CLIENT_ENV: v.string(),
        },
        extends: [preset1, preset2],
        runtimeEnv: processEnv,
      });
    }

    expectTypeOf(lazyCreateEnv).returns.toEqualTypeOf<
      Readonly<{
        PRESET_ENV1: "preset";
        PRESET_ENV2: number;
        SERVER_ENV: string;
        SHARED_ENV: string;
        CLIENT_ENV: string;
      }>
    >();

    test("server", () => {
      const { window } = globalThis;
      globalThis.window = undefined as any;

      const env = lazyCreateEnv();

      expect(env).toMatchObject({
        PRESET_ENV1: "preset",
        PRESET_ENV2: 123,
        SERVER_ENV: "server",
        SHARED_ENV: "shared",
        CLIENT_ENV: "client",
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
      expect(() => env.PRESET_ENV1).toThrow(
        "❌ Attempted to access a server-side environment variable on the client",
      );
      expect(() => env.PRESET_ENV2).toThrow(
        "❌ Attempted to access a server-side environment variable on the client",
      );
      expect(env.SHARED_ENV).toBe("shared");
      expect(env.CLIENT_ENV).toBe("client");

      globalThis.window = window;
    });
  });
});
